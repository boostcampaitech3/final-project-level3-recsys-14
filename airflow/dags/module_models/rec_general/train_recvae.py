import numpy as np
import torch
from torch import optim
import random
from copy import deepcopy
from .utils import *
from .models import *
import time
from .config import *
from .dataset import *
import datetime
import json

seed = args.seed
random.seed(seed)
np.random.seed(seed)
torch.manual_seed(seed)
import warnings
warnings.filterwarnings(action='ignore')

torch.manual_seed(args.seed)

# 만약 GPU가 사용가능한 환경이라면 GPU를 사용
def train_recvae():
    if torch.cuda.is_available():
        args.cuda = True

    device = torch.device("cuda" if args.cuda else "cpu")
    #device = "cpu"
    print("DEVICE: ", device)
    
    def evaluate(model, data_tr, data_te, metrics, batch_size=500):
        metrics = deepcopy(metrics)
        model.eval()

        e_idxlist = list(range(data_tr.shape[0]))
        e_N = data_tr.shape[0]

        for m in metrics:
            m['score'] = []

        with torch.no_grad():
            for start_idx in range(0, e_N, batch_size):
                end_idx = min(start_idx + batch_size, e_N)
                data = data_tr[e_idxlist[start_idx:end_idx]]
                heldout_data = data_te[e_idxlist[start_idx:end_idx]]

                data_tensor = naive_sparse2tensor(data).to(device)

                ratings_pred = model(data_tensor, calculate_loss=False).cpu().detach().numpy()

                if not (data_tr is data_te):
                    ratings_pred[data.nonzero()] = -np.inf

                for m in metrics:
                    m['score'].append(m['metric'](ratings_pred, heldout_data, k=m['k']))

        for m in metrics:
            m['score'] = np.concatenate(m['score']).mean()

        return [x['score'] for x in metrics]


    def train(model, opts, train_data, batch_size, beta, gamma, dropout_rate):
        model.train()
        np.random.shuffle(idxlist)
        for batch_idx, start_idx in enumerate(range(0, N, batch_size)):
            end_idx = min(start_idx + batch_size, N)

            data = train_data[idxlist[start_idx:end_idx]]
            data = naive_sparse2tensor(data).to(device)

            for optimizer in opts:
                optimizer.zero_grad()

            _, loss = model(data, beta=beta, gamma=gamma, dropout_rate=dropout_rate)
            
            loss.backward()

            for optimizer in opts:
                optimizer.step()

    loader = DataLoader(args.dataset)
    print("loader 완료")
    n_items = loader.load_n_items()
    train_data = loader.load_data('train')
    vad_data_tr, vad_data_te = loader.load_data('validation')
    test_data_tr, test_data_te = loader.load_data('test')

    N = train_data.shape[0]  # 25360
    idxlist = list(range(N))

    model_kwargs = {
        'hidden_dim': args.hidden_dim,
        'latent_dim': args.latent_dim,
        'input_dim': train_data.shape[1]
    }

    metrics = [
        {'metric': ndcg, 'k': 100},
        {'metric': recall, 'k': 10},
        {'metric': recall, 'k': 30},
        {'metric': recall, 'k': 50}
    ]

    best_recall = -np.inf

    model = RecVAE(**model_kwargs).to(device)
    model_best = RecVAE(**model_kwargs).to(device)

    learning_kwargs = {
        'model': model,
        'train_data': train_data,
        'batch_size': args.batch_size,
        'beta': args.beta,
        'gamma': args.gamma
    }

    decoder_params = set(model.decoder.parameters())
    encoder_params = set(model.encoder.parameters())

    optimizer_encoder = optim.Adam(encoder_params, lr=args.lr)
    optimizer_decoder = optim.Adam(decoder_params, lr=args.lr)

    log_dir_name = str(datetime.datetime.now())[0:10] + f'_recvae'
    log_dir = os.path.join(args.log_dir, log_dir_name)

    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    if not os.path.exists(args.save_dir):
        os.makedirs(args.save_dir)
    # -- wandb initialize with configuration

    for epoch in range(1, args.n_epochs+1):
        if args.not_alternating:
            train(opts=[optimizer_encoder, optimizer_decoder], dropout_rate=0.5, **learning_kwargs)
        else:
            train(opts=[optimizer_encoder], dropout_rate=0.5, **learning_kwargs)
            model.update_prior()
            train(opts=[optimizer_decoder], dropout_rate=0, **learning_kwargs)

        train_scores = evaluate(model, train_data, train_data, metrics)
        valid_scores = evaluate(model, vad_data_tr, vad_data_te, metrics)

        print('-' * 70)
        print(f'epoch {epoch} | previous best recall: {best_recall}')

        print('training set')
        for metric, score in zip(metrics, train_scores):
            print(f"{metric['metric'].__name__}@{metric['k']}:\t{score:.4f}")

        valid_recall = 0

        print('validation set')
        for metric, score in zip(metrics, valid_scores):
            if metric['metric'].__name__ == 'recall' and metric['k'] == 30:
                valid_recall = score
            print(f"{metric['metric'].__name__}@{metric['k']}:\t{score:.4f}")

        if valid_recall > best_recall:
            best_recall = valid_recall
            model_best.load_state_dict(deepcopy(model.state_dict()))
            with open(os.path.join(log_dir, f'best_recvae_' + args.save), 'wb') as f:
                torch.save(model.state_dict(), f)
            print(f"best_model saved!! (save {best_recall})")
        print('-' * 70 + '\n')

    with open(os.path.join(args.save_dir, f'best_recvae_' + args.save), 'wb') as f:
        torch.save(model_best.state_dict(), f)

    final_scores = evaluate(model_best, test_data_tr, test_data_te, metrics)

    for metric, score in zip(metrics, final_scores):
        print(f"{metric['metric'].__name__}@{metric['k']}:\t{score:.4f}")

    pro_dir = os.path.join(args.dataset, 'pro_sg')
    #np.savetxt(pro_dir+'/recvae_result.txt', [final_scores[1]]) # best_recall 저장

    #f = open(f"{pro_dir}/model_score.json", encoding="utf-8")
    #model_score = json.loads(f.read())
    with open(pro_dir + '/model_score.json', 'r', encoding="utf-8") as f:
        model_score = json.load(f)

    model_score['recvae'] = final_scores[1]
    with open(pro_dir + '/model_score.json', 'w', encoding="utf-8") as f:
        json.dump(model_score, f, ensure_ascii=False, indent="\t")