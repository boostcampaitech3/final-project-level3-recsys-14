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
import warnings
warnings.filterwarnings(action='ignore')

seed = args.seed
random.seed(seed)
np.random.seed(seed)
torch.manual_seed(seed)


torch.manual_seed(args.seed)


update_count = 0
def train_vae():
    # 만약 GPU가 사용가능한 환경이라면 GPU를 사용
    if torch.cuda.is_available():
        args.cuda = True
    #args.cuda = False
    device = torch.device("cuda" if args.cuda else "cpu")
    #device = "cpu"
    print("DEVICE: ", device)
    
    def train(model, criterion, optimizer, is_VAE = False):
        # Turn on training mode
        model.train()
        train_loss = 0.0
        start_time = time.time()
        global update_count

        np.random.shuffle(idxlist)
        
        for batch_idx, start_idx in enumerate(range(0, N, args.batch_size)):
            end_idx = min(start_idx + args.batch_size, N)
            
            data = train_data[idxlist[start_idx:end_idx]]
            data = naive_sparse2tensor(data).to(device)
            optimizer.zero_grad()

            if is_VAE:
                if args.total_anneal_steps > 0:
                    anneal = min(args.anneal_cap, 
                                    1. * update_count / args.total_anneal_steps)
                else:
                    anneal = args.anneal_cap

                optimizer.zero_grad()
                recon_batch, mu, logvar = model(data)
                loss = criterion(recon_batch, data, mu, logvar, anneal)
            else:
                recon_batch = model(data)
                loss = criterion(recon_batch, data)

            loss.backward()
            train_loss += loss.item()
            optimizer.step()

            update_count += 1


    def evaluate(model, criterion, data_tr, data_te, is_VAE=False):
        # Turn on evaluation mode
        model.eval()
        total_loss = 0.0
        global update_count
        e_idxlist = list(range(data_tr.shape[0]))
        e_N = data_tr.shape[0]
        n100_list = []
        r10_list = []
        r30_list = []
        
        with torch.no_grad():
            for start_idx in range(0, e_N, args.batch_size):
                end_idx = min(start_idx + args.batch_size, N)
                data = data_tr[e_idxlist[start_idx:end_idx]]
                heldout_data = data_te[e_idxlist[start_idx:end_idx]]

                data_tensor = naive_sparse2tensor(data).to(device)
                if is_VAE :

                    if args.total_anneal_steps > 0:
                        anneal = min(args.anneal_cap, 
                                    1. * update_count / args.total_anneal_steps)
                    else:
                        anneal = args.anneal_cap

                    recon_batch, mu, logvar = model(data_tensor)

                    loss = criterion(recon_batch, data_tensor, mu, logvar, anneal)

                else :
                    recon_batch = model(data_tensor)
                    loss = criterion(recon_batch, data_tensor)

                total_loss += loss.item()

                # Exclude examples from training set
                recon_batch = recon_batch.cpu().numpy()
                recon_batch[data.nonzero()] = -np.inf

                n100 = ndcg(recon_batch, heldout_data, 100)
                r10 = recall(recon_batch, heldout_data, 10)
                r30 = recall(recon_batch, heldout_data, 30)

                n100_list.append(n100)
                r10_list.append(r10)
                r30_list.append(r30)
    
        total_loss /= len(range(0, e_N, args.batch_size))
        n100_list = np.concatenate(n100_list)
        r10_list = np.concatenate(r10_list)
        r30_list = np.concatenate(r30_list)

        return total_loss, np.mean(n100_list), np.mean(r10_list), np.mean(r30_list)

    ###############################################################################
    # Load data
    ###############################################################################
    loader = DataLoader(args.dataset)

    n_items = loader.load_n_items() # 6807
    train_data = loader.load_data('train') # csr_matrix
    vad_data_tr, vad_data_te = loader.load_data('validation')
    test_data_tr, test_data_te = loader.load_data('test')

    N = train_data.shape[0] # 25360
    idxlist = list(range(N))

    ###############################################################################
    # Build the model
    ###############################################################################

    # p_dims = [200, 1200, 3000, n_items] # [200, 600, 6807]
    p_dims = [200, 3000, n_items] # [200, 600, 6807]
    pro_dir2 = os.path.join(args.dataset, 'pro_sg')
    item_tag_emb = pd.read_csv(pro_dir2 + '/item_tag_emb.csv')
    # model = MultiVAE(p_dims).to(device)
    model = MultiVAE(p_dims, tag_emb=item_tag_emb).to(device)


    optimizer = optim.Adam(model.parameters(), lr=args.lr, weight_decay=args.wd)
    # optimizer = adabound.AdaBound(model.parameters(), lr=1e-3, final_lr=0.1)
    criterion = loss_function_vae

    ###############################################################################
    # Training code
    ###############################################################################

    # best_n100 = -np.inf
    best_r30 = -np.inf
    update_count = 0
    early_stopping = 40
    stopping_cnt = 0

    log_dir_name = str(datetime.datetime.now())[0:10] + '_vae'
    log_dir = os.path.join(args.log_dir, log_dir_name)
    # log_dir = increment_path(log_dir)

    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    if not os.path.exists(args.save_dir):
        os.makedirs(args.save_dir)

    # -- wandb initialize with configuration
    # wandb.init(config={"model":'Multi-VAE',
    #                 "batch_size": args.batch_size,
    #                 "lr"        : args.lr,
    #                 "epochs"    : args.n_epochs,
    #                 })

    for epoch in range(1, args.n_epochs + 1):
        epoch_start_time = time.time()
        train(model, criterion, optimizer, is_VAE=True)
        
        
        val_loss, n100, r10, r30 = evaluate(model, criterion, vad_data_tr, vad_data_te, is_VAE=True)
        print('-' * 89)
        print('| end of epoch {:3d}/{:3d} | time: {:4.2f}s | valid loss {:4.4f} | '
                'n100 {:5.4f} | r10 {:5.4f} | r30 {:5.4f}'.format(
                    epoch, args.n_epochs, time.time() - epoch_start_time, val_loss,
                    n100, r10, r30))
        print('-' * 89)

        n_iter = epoch * len(range(0, N, args.batch_size))

        # wandb.log({
        #     "vae_val loss": val_loss,
        #     "vae_n100" : n100,
        #     "vae_r10" : r10,
        #     "vae_r20" : r20})

        if r30 > best_r30:
            with open(os.path.join(log_dir, 'best_vae_' + args.save), 'wb') as f:
                torch.save(model.state_dict(), f)
                print(f"Best model saved! r@30 : {r30:.4f}")
            best_r30 = r30
            stopping_cnt = 0
        else:
            print(f'Stopping Count : {stopping_cnt} / {early_stopping}')
            stopping_cnt += 1

        if stopping_cnt > early_stopping:
            print('*****Early Stopping*****')
            break

    # Load the best saved model.
    with open(os.path.join(log_dir, 'best_vae_' + args.save), 'rb') as f:
        model.load_state_dict(torch.load(f))

    with open(os.path.join(args.save_dir, 'best_vae_' + args.save), 'wb') as f:
        torch.save(model.state_dict(), f)

    # Run on test data.
    test_loss, n100, r10, r30 = evaluate(model, criterion, test_data_tr, test_data_te, is_VAE=True)
    print('=' * 89)
    print('| End of training | test loss {:4.4f} | n100 {:4.4f} | r10 {:4.4f} | '
            'r30 {:4.4f}'.format(test_loss, n100, r10, r30))
    print('=' * 89)

    with open(os.path.join(log_dir, "update_count_vae.txt"), "w", encoding='utf-8') as f:
        f.write(str(update_count))

    pro_dir = os.path.join(args.dataset, 'pro_sg')
#    np.savetxt(pro_dir+'/vae_result.txt', [r10]) # best_recall 저장

 #   df_result = pd.read_csv(pro_dir+'/model_score.csv')
 #   x = pd.DataFrame()
 #   x['model_name'] = 'vae'
 #   x['r10'] = r10
 #   df_result = pd.concat([df_result, x], axis=0)
 #   df_result.to_csv(pro_dir+'/model_score.csv', index=False)

    with open(pro_dir +'/model_score.json', 'r', encoding="utf-8") as f:
        model_score = json.load(f)

    model_score['vae'] = r10
    with open(pro_dir + '/model_score.json', 'w', encoding="utf-8") as f:
        json.dump(model_score, f, ensure_ascii=False, indent="\t")