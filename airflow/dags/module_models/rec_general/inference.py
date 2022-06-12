import time
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pandas as pd
from scipy import sparse
import os
from .dataset import *
from .utils import *
import json
from tqdm import tqdm
from .models import *
import datetime
import warnings
warnings.filterwarnings(action = 'ignore')

import bottleneck as bn

## 각종 파라미터 세팅
from .config import *

seed = args.seed
np.random.seed(seed)
torch.manual_seed(seed)

def infer_all(raw_data, db):
    ## 배치사이즈 포함
    ### 데이터 준비
    # Load Data
    pro_dir = os.path.join(args.dataset, 'pro_sg')

    with open(pro_dir + '/model_score.json', 'r', encoding="utf-8") as f:
        model_score = json.load(f)

    raw_data, _, _ = filter_triplets(raw_data, 5, 10)
    df_problems = pd.read_sql('select * from problems', db)
    df_problems.drop(df_problems[df_problems.average_tries == 7340].index, axis=0, inplace=True)
    # level 0에 해당하는 문제 제거
    df_problems = df_problems[df_problems.level != 0]
    # not_solvable == False만
    df_problems = df_problems[df_problems.is_solvable == True]
    # tag가 nan인 문제 제거
    df_problems = df_problems[~df_problems.tags.isnull()]

    raw_data = raw_data[raw_data['item'].isin(df_problems['problem_id'].values)].reset_index(drop=True)
    
    device = torch.device("cuda")

    # Import Data
    print("Inference Start!!")

    with open(pro_dir + '/item2id.json', 'r', encoding="utf-8") as f:
        show2id = json.load(f)

    with open(pro_dir + '/user2id.json', 'r', encoding="utf-8") as f:
        profile2id = json.load(f)

    infer_df = numerize_for_infer(raw_data, profile2id, show2id)

    loader = DataLoader(args.data)
    n_items = loader.load_n_items()
    n_users = infer_df['uid'].max() + 1

    rows, cols = infer_df['uid'], infer_df['sid']
    data = sparse.csr_matrix((np.ones_like(rows),(rows, cols)), dtype='float64', shape=(n_users, n_items))

    num_data = data.shape[0]
    index_list = list(range(num_data))

    df_users = pd.read_sql('select * from users', db)
    df_users = df_users[['handle', 'tier']] # base_dir 경로를 수정해야 합니다.
    df_user_lv = df_users[df_users['handle'].isin(raw_data['user'].unique())].reset_index(drop=True)

    dict_user_lv = dict()
    for i in range(len(df_user_lv)):
        dict_user_lv[df_user_lv.iloc[i,0]] = df_user_lv.iloc[i, 1]

    dict_item_lv = dict()
    for i in range(len(df_problems)):
        dict_item_lv[df_problems.iloc[i, 1]] = df_problems.iloc[i,6]

    id2profile = dict((int(v), k) for k, v in profile2id.items())
    id2show = dict((int(v), k) for k, v in show2id.items())

    model_kwargs = {
    'hidden_dim': args.hidden_dim,
    'latent_dim': args.latent_dim,
    'input_dim': data.shape[1]
    }

    model_name = ""
    score = 0
    for m, s in model_score.items():
        if s > score:
            model_name = m
            score = s
    print(f"Best Model => {model_name} : {score:.4f}")

    if model_name == 'recvae':        
        model = RecVAE(**model_kwargs)
        model.load_state_dict(torch.load(args.save_dir + '/best_recvae_' + args.save))
        model = model.to(device)
    
    elif model_name == 'vae':
        p_dims = [200, 3000, n_items] # [200, 600, 6807]
        item_tag_emb = pd.read_csv(pro_dir + '/item_tag_emb.csv')

        model = MultiVAE(p_dims, tag_emb=item_tag_emb)

        with open(os.path.join(args.save_dir, 'best_vae_' + args.save), 'rb') as f:
            model.load_state_dict(torch.load(f))
        model = model.to(device)

    elif model_name == 'dae':
        p_dims = [200, 3000, n_items]  # [200, 600, 6807]
        item_tag_emb = pd.read_csv(pro_dir + '/item_tag_emb.csv')

        model = MultiDAE(p_dims, tag_emb=item_tag_emb).to(device)

        with open(os.path.join(args.save_dir, 'best_dae_' + args.save), 'rb') as f:
            model.load_state_dict(torch.load(f))
        model = model.to(device)

    model.eval()

    # Infer
    pred_list = None

    with torch.no_grad():
        for start_index in tqdm(range(0, num_data, args.batch_size)):
            end_index = min(start_index + args.batch_size, num_data)
            data_batch = data[index_list[start_index:end_index]]
            data_tensor = naive_sparse2tensor(data_batch).to(device)

            recon_batch = model(data_tensor, calculate_loss=False)

            recon_batch = recon_batch.cpu().numpy()

            recon_batch[data_batch.nonzero()] = -np.inf

            idx = bn.argpartition(-recon_batch, 500, axis=1)[:, :500]
            out = np.array([])

            for user, item in enumerate(idx):
                user += start_index
                user = id2profile[user]

                infer_out = infer(user, item, dict_user_lv, dict_item_lv, id2show, args.infer_cnt)
                out = np.append(out, infer_out)


            if start_index == 0:
                pred_list = out
            else:
                pred_list = np.append(pred_list, np.array(out))

    user2 = []
    item2 = []

    pred_list = pred_list.reshape(num_data, -1)
    for user_index, pred_item in enumerate(pred_list):
        user2.extend([user_index] * args.infer_cnt)
        item2.extend(pred_item)

    u2 = pd.DataFrame(user2, columns=['user'])
    i2 = pd.DataFrame(item2, columns=['item'])
    all2 = pd.concat([u2, i2], axis=1)

    ans2 = de_numerize(all2, id2profile, id2show)
    ans2.columns = ['user', 'item']
    new_ans2 = ans2.sort_values('user')

    new_ans2.to_csv(os.path.join(args.dataset, 'output.csv'), index=False)
    # print('Output Saved!!')
    return new_ans2