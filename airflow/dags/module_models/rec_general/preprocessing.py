import time
import torch
import numpy as np
from .dataset import *
from .utils import *
import json
import pandas as pd
from torch import nn

import os
import warnings
warnings.filterwarnings(action='ignore')

## 각종 파라미터 세팅
from .config import *

# Set the random seed manually for reproductibility.
torch.manual_seed(args.seed)

def preprocessing_all(raw_data, df_problems, db):
    #만약 GPU가 사용가능한 환경이라면 GPU를 사용
    if torch.cuda.is_available():
        args.cuda = True

    device = torch.device("cuda" if args.cuda else "cpu")

    print("Load and Preprocess BOJ dataset")
    # Load Data
    # Filter Data
#    raw_data, user_activity, item_popularity = filter_triplets(raw_data, 5, 10)
    #---------------------------
    # 여기에 tag == None인 아이템은 제외
#    df_problems = pd.read_sql('select * from problems', db)
#    df_problems.drop(df_problems[df_problems.average_tries == 7340].index, axis=0, inplace=True)
    # level 0에 해당하는 문제 제거
#    df_problems = df_problems[df_problems.level != 0]
    # not_solvable == False만
#    df_problems = df_problems[df_problems.is_solvable == True]
    # tag가 nan인 문제 제거
#    df_problems = df_problems[~df_problems.tags.isnull()]

 #   raw_data = raw_data[raw_data['item'].isin(df_problems['problem_id'].values)].reset_index(drop=True)
    #---------------------------


    # Shuffle User Indices
    unique_uid = pd.unique(raw_data['user'])
    print("len(unique_uid): ", len(unique_uid))
    print("(BEFORE) unique_uid:",unique_uid)
    np.random.seed(98765)
    idx_perm = np.random.permutation(unique_uid.size) # 해당 숫자까지의 인덱스를 무작위로 섞은 것을 arr로 반환
    unique_uid = unique_uid[idx_perm]
    print("(AFTER) unique_uid:",unique_uid) # 무작위로 item을 섞음

    n_users = unique_uid.size
    n_heldout_users = 3000

    # Split Train/Validation/Test User Indices
    tr_users = unique_uid[:(n_users - n_heldout_users * 2)]
    vd_users = unique_uid[(n_users - n_heldout_users * 2): (n_users - n_heldout_users)]
    te_users = unique_uid[(n_users - n_heldout_users):]

    #주의: 데이터의 수가 아닌 사용자의 수입니다!
    print("훈련 데이터에 사용될 사용자 수:", len(tr_users))
    print("검증 데이터에 사용될 사용자 수:", len(vd_users))
    print("테스트 데이터에 사용될 사용자 수:", len(te_users))

    ##훈련 데이터에 해당하는 아이템들
    #Train에는 전체 데이터를 사용합니다.
    train_plays = raw_data.loc[raw_data['user'].isin(tr_users)]

    ##아이템 ID
    unique_sid = pd.unique(raw_data['item'])
    pro_dir = os.path.join(args.dataset, 'pro_sg')

    if not os.path.exists(pro_dir):
        os.makedirs(pro_dir)

    item2id = dict((int(sid), int(i)) for (i, sid) in enumerate(unique_sid)) # item2idx dict
    user2id = dict((pid, int(i)) for (i, pid) in enumerate(unique_uid)) # user2idx dict

    with open(os.path.join(pro_dir, 'item2id.json'), 'w', encoding="utf-8") as f:
        json.dump(item2id, f, ensure_ascii=False, indent="\t")
        
    with open(os.path.join(pro_dir, 'user2id.json'), 'w', encoding="utf-8") as f:
        json.dump(user2id, f, ensure_ascii=False, indent="\t")

    with open(os.path.join(pro_dir, 'unique_sid.txt'), 'w') as f:
        for sid in unique_sid:
            f.write('%s\n' % sid)

    with open(os.path.join(pro_dir, 'unique_uid.txt'), 'w') as f:
        for uid in unique_uid:
            f.write('%s\n' % uid)

    #Validation과 Test에는 input으로 사용될 tr 데이터와 정답을 확인하기 위한 te 데이터로 분리되었습니다.
    print('Data Split Start!')
    vad_plays = raw_data.loc[raw_data['user'].isin(vd_users)]
    vad_plays = vad_plays.loc[vad_plays['item'].isin(unique_sid)]
    vad_plays_tr, vad_plays_te = split_train_test_proportion(vad_plays)

    test_plays = raw_data.loc[raw_data['user'].isin(te_users)]
    test_plays = test_plays.loc[test_plays['item'].isin(unique_sid)]
    test_plays_tr, test_plays_te = split_train_test_proportion(test_plays)

    train_data = numerize(train_plays, user2id, item2id)
    train_data.to_csv(os.path.join(pro_dir, 'train.csv'), index=False)

    vad_data_tr = numerize(vad_plays_tr, user2id, item2id)
    vad_data_tr.to_csv(os.path.join(pro_dir, 'validation_tr.csv'), index=False)

    vad_data_te = numerize(vad_plays_te, user2id, item2id)
    vad_data_te.to_csv(os.path.join(pro_dir, 'validation_te.csv'), index=False)

    test_data_tr = numerize(test_plays_tr, user2id, item2id)
    test_data_tr.to_csv(os.path.join(pro_dir, 'test_tr.csv'), index=False)

    test_data_te = numerize(test_plays_te, user2id, item2id)
    test_data_te.to_csv(os.path.join(pro_dir, 'test_te.csv'), index=False)
    print("Data Split Done!")

    # item_tag_emb
    print("Item tag emb start!")
    set_tags = set()
    for tags in df_problems['tags'].dropna().values:
        for tag in tags.split(','):
            set_tags.add(tag)


    df_tags = df_problems[['problem_id', 'tags']]
    df_tags['tags'] = df_tags['tags'].str.split(',')
    # df_tags = df_tags.explode('tags').dropna().reset_index(drop=True)
    df_tags = df_tags.explode('tags').dropna().reset_index(drop=True)
    df_tags = df_tags[df_tags['problem_id'].isin(unique_sid)].reset_index(drop=True)

    temp = nn.Embedding(len(set_tags), 300)
    tag_emb = pd.DataFrame(df_tags['tags'].value_counts().index.values, columns=['tags'])

    dict_tag_idx = dict()
    for i, j in enumerate(df_tags['tags'].value_counts().index.values):
        dict_tag_idx[j] = i

    list_emb = []
    dict_tag_emb = dict()
    for i in df_tags['tags'].value_counts().index.values:
        list_emb.append(temp(torch.tensor(dict_tag_idx[i])).detach().numpy())
        dict_tag_emb[i] = temp(torch.tensor(dict_tag_idx[i])).detach().numpy()

    df_tag_emb = pd.concat([tag_emb, pd.DataFrame(list_emb)], axis=1)
    df_tags2 = pd.merge(df_tags, df_tag_emb, on='tags', how='left')
    tag2emb = df_tags2.iloc[:, 2:].values
    df_tags['emb'] = list(tag2emb) 

    total = []
    def item_genre_emb_mean(i):
        total.append(np.mean(df_tags[df_tags['problem_id'] == i].emb))

    item_genre_emb_idx = pd.DataFrame(list(df_tags['problem_id'].unique()), columns=['item'])
    item_genre_emb_idx.item.apply(lambda x: item_genre_emb_mean(x))
    item_genre_emb = pd.DataFrame(total)
    item_genre_emb.index = df_tags['problem_id'].unique()

    item_genre_emb = item_genre_emb.reset_index()
    item_genre_emb['index'] = item_genre_emb['index'].apply(lambda x : item2id[x])
    item_genre_emb = item_genre_emb.set_index('index')
    item_genre_emb = item_genre_emb.sort_index()

    item_genre_emb = item_genre_emb.T
    print(item_genre_emb.shape)

    item_genre_emb.to_csv(pro_dir + '/item_tag_emb.csv', index=False)
    print('Item tag emb Done!')

    model_score = dict()
    model_score['recvae'] = 0
    model_score['vae'] = 0
    model_score['dae'] = 0
    with open(os.path.join(pro_dir, 'model_score.json'), 'w', encoding="utf-8") as f:
        json.dump(model_score, f, ensure_ascii=False, indent="\t")
    #--------------------------------------------