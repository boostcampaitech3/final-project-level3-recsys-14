import os
from scipy import sparse
import time
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import os
import bottleneck as bn
import numpy as np
import time
from copy import deepcopy
from math import log, floor, ceil


def load_train_data(csv_file, n_items, n_users, global_indexing=False):
    tp = pd.read_csv(csv_file)
    
    n_users = n_users if global_indexing else tp['uid'].max() + 1

    rows, cols = tp['uid'], tp['sid']
    data = sparse.csr_matrix((np.ones_like(rows),
                             (rows, cols)), dtype='float64',
                             shape=(n_users, n_items))
    return data


def load_tr_te_data(csv_file_tr, csv_file_te, n_items, n_users, global_indexing=False):
    tp_tr = pd.read_csv(csv_file_tr)
    tp_te = pd.read_csv(csv_file_te)

    if global_indexing:
        start_idx = 0
        end_idx = len(unique_uid) - 1
    else:
        start_idx = min(tp_tr['uid'].min(), tp_te['uid'].min())
        end_idx = max(tp_tr['uid'].max(), tp_te['uid'].max())

    rows_tr, cols_tr = tp_tr['uid'] - start_idx, tp_tr['sid']
    rows_te, cols_te = tp_te['uid'] - start_idx, tp_te['sid']

    data_tr = sparse.csr_matrix((np.ones_like(rows_tr),
                             (rows_tr, cols_tr)), dtype='float64', shape=(end_idx - start_idx + 1, n_items))
    data_te = sparse.csr_matrix((np.ones_like(rows_te),
                             (rows_te, cols_te)), dtype='float64', shape=(end_idx - start_idx + 1, n_items))
    return data_tr, data_te


def get_data(dataset, global_indexing=False):
    unique_sid = list()
    unique_uid = list()
    with open(os.path.join(dataset, 'unique_sid.txt'), 'r') as f:
        for line in f:
            unique_sid.append(line.strip())

    with open(os.path.join(dataset, 'unique_uid.txt'), 'r') as f:
        for line in f:
            unique_uid.append(line.strip())
    
    # unique_uid = list()
    # with open(os.path.join(dataset, 'unique_uid.txt'), 'r') as f:
    #     for line in f:
    #         unique_uid.append(line.strip())
            
    n_items = len(unique_sid)
    n_users = len(unique_uid)
    
    train_data = load_train_data(os.path.join(dataset, 'train.csv'), n_items, n_users, global_indexing=global_indexing)


    vad_data_tr, vad_data_te = load_tr_te_data(os.path.join(dataset, 'validation_tr.csv'),
                                               os.path.join(dataset, 'validation_te.csv'),
                                               n_items, n_users, 
                                               global_indexing=global_indexing)

    test_data_tr, test_data_te = load_tr_te_data(os.path.join(dataset, 'test_tr.csv'),
                                                 os.path.join(dataset, 'test_te.csv'),
                                                 n_items, n_users, 
                                                 global_indexing=global_indexing)
    
    data = train_data, vad_data_tr, vad_data_te, test_data_tr, test_data_te
    data = (x.astype('float32') for x in data)
    
    return data




def get_count(df, id):
    '''
    df -> DataFrame
    id -> Feature of DataFrame
    '''
    interaction_count_groupby_id = df[[id]].groupby(id, as_index=False)
    grouped_count = interaction_count_groupby_id.size()
    return grouped_count

# 특정한 횟수 이상의 리뷰가 존재하는(사용자의 경우 min_uc 이상, 아이템의 경우 min_sc이상) 
# 데이터만을 추출할 때 사용하는 함수입니다.
# 현재 데이터셋에서는 결과적으로 원본그대로 사용하게 됩니다.
def filter_triplets(df, min_user_interaction, min_problem_interaction):
    user_interaction_count = get_count(df, 'user')
    problem_interaction_count = get_count(df, 'item')

    print(f"Size of Dataframe Before Filtering: {df.size}")

    if min_user_interaction > 0:
        df = df[df['user'].isin(user_interaction_count[user_interaction_count['size'] >= min_user_interaction]['user'])]

    print(f"Size of Dataframe After User Filtering: {df.size}")

    if min_problem_interaction > 0:
        df = df[df['item'].isin(problem_interaction_count[problem_interaction_count['size'] >= min_problem_interaction]['item'])]

    print(f"Size of Dataframe After Problem Filtering: {df.size}")

    return df, user_interaction_count, problem_interaction_count

#훈련된 모델을 이용해 검증할 데이터를 분리하는 함수입니다.
#100개의 액션이 있다면, 그중에 test_prop 비율 만큼을 비워두고, 그것을 모델이 예측할 수 있는지를
#확인하기 위함입니다.
def split_train_test_proportion(data, test_prop=0.2):
    '''
    data -> DataFrame
    
    train과 test를 8:2 비율로 나눠주는 함수.
    '''
    data_grouped_by_user = data.groupby('user')
    tr_list, te_list = list(), list()

    np.random.seed(98765)
    
    for _, group in data_grouped_by_user:
        n_items_u = len(group)
        
        if n_items_u >= 5:
            idx = np.zeros(n_items_u, dtype='bool') # 'False'가 n_items_u개 만큼 채워진 array
            
            # n_items_u개 중에서 20%의 인덱스를 랜덤으로 뽑아서 해당 인덱스를 'True'로 바꿈
            idx[np.random.choice(n_items_u, size=int(test_prop * n_items_u), replace=False).astype('int64')] = True
                    
            tr_list.append(group[np.logical_not(idx)]) # 'False'인 것을 tr_list에 추가
            te_list.append(group[idx]) # 'True'인 것을 te_list에 추가
        
        else:
            tr_list.append(group)
    
    data_tr = pd.concat(tr_list)
    data_te = pd.concat(te_list)

    return data_tr, data_te

def numerize(tp, profile2id, show2id):
    '''
    tp -> DataFrame
    user2id, item2id -> dict()
    
    user, item을 reindexing한 df 반환.
    '''
    uid = tp['user'].apply(lambda x: profile2id[x])
    sid = tp['item'].apply(lambda x: show2id[x])
    return pd.DataFrame(data={'uid': uid, 'sid': sid}, columns=['uid', 'sid'])


def sparse2torch_sparse(data):
    """
    Convert scipy sparse matrix to torch sparse tensor with L2 Normalization
    This is much faster than naive use of torch.FloatTensor(data.toarray())
    https://discuss.pytorch.org/t/sparse-tensor-use-cases/22047/2
    """
    samples = data.shape[0]
    features = data.shape[1]
    coo_data = data.tocoo()
    indices = torch.LongTensor([coo_data.row, coo_data.col])
    row_norms_inv = 1 / np.sqrt(data.sum(1))
    row2val = {i : row_norms_inv[i].item() for i in range(samples)}
    values = np.array([row2val[r] for r in coo_data.row])
    t = torch.sparse.FloatTensor(indices, torch.from_numpy(values).float(), [samples, features])
    return t

def naive_sparse2tensor(data):
    return torch.FloatTensor(data.toarray())


def numerize_for_infer(tp, profile2id, show2id):
    uid = tp['user'].apply(lambda x: profile2id[str(x)])
    sid = tp['item'].apply(lambda x: show2id[str(x)])
    return pd.DataFrame(data={'uid': uid, 'sid': sid}, columns=['uid', 'sid'])

def de_numerize(tp, re_p2id, re_s2id):
    uid2 = tp['user'].apply(lambda x: re_p2id[x])
    sid2 = tp['item'].apply(lambda x: re_s2id[x])
    return pd.DataFrame(data={'uid': uid2, 'sid': sid2}, columns=['uid', 'sid'])

def ndcg(X_pred, heldout_batch, k=100):
    '''
    Normalized Discounted Cumulative Gain@k for binary relevance
    ASSUMPTIONS: all the 0's in heldout_data indicate 0 relevance
    '''
    batch_users = X_pred.shape[0]
    idx_topk_part = bn.argpartition(-X_pred, k, axis=1)
    topk_part = X_pred[np.arange(batch_users)[:, np.newaxis],
                       idx_topk_part[:, :k]]
    idx_part = np.argsort(-topk_part, axis=1)

    idx_topk = idx_topk_part[np.arange(batch_users)[:, np.newaxis], idx_part]

    tp = 1. / np.log2(np.arange(2, k + 2))

    e = 0.000001

    DCG = (heldout_batch[np.arange(batch_users)[:, np.newaxis],
                         idx_topk].toarray() * tp).sum(axis=1)
    IDCG = np.array([(tp[:min(n, k)]).sum()
                     for n in heldout_batch.getnnz(axis=1)]) + e
    return DCG / IDCG


def recall(X_pred, heldout_batch, k=100):
    batch_users = X_pred.shape[0]

    idx = bn.argpartition(-X_pred, k, axis=1)
    X_pred_binary = np.zeros_like(X_pred, dtype=bool)
    X_pred_binary[np.arange(batch_users)[:, np.newaxis], idx[:, :k]] = True

    e = 0.000001

    X_true_binary = (heldout_batch > 0).toarray()
    tmp = (np.logical_and(X_true_binary, X_pred_binary).sum(axis=1)).astype(
        np.float32)
    #-------------------------
    # print('tmp :', len(tmp))
    # print('np.minimum(k, X_true_binary.sum(axis=1) :',len(np.minimum(k, X_true_binary.sum(axis=1))))
    #-------------------------
    recall = tmp / np.minimum(k, X_true_binary.sum(axis=1) + e)
    return recall

def min_max(lv):
    if lv <= 5:
        return 0, 7
    elif lv <= 10:
        return 5, 12
    elif lv <= 13:
        return 8, 16
    elif lv <= 15:
        return 11, 18
    else:
        return (floor(lv-log(lv, 2)), ceil(lv+log(lv, 3)))

def infer(user, item, dict_user_lv, dict_item_lv, id2show, infer_cnt):
    pred = np.array([])
    user_lv = dict_user_lv[user]
    cnt = 0
    mini, maxi = min_max(user_lv)
    item = sorted(item, reverse=True)
    for i in item:
        item_lv = dict_item_lv[int(id2show[i])]
        if mini <= item_lv <= maxi:
            pred = np.append(pred, i)
            cnt += 1
    
        if cnt == infer_cnt:
            return pred
    else:
        # print('else user :', user)
        if len(pred) < infer_cnt:
            for i in item:
                if i not in pred:
                    pred = np.append(pred, i)

                if len(pred) == infer_cnt:
                    return np.array(pred)