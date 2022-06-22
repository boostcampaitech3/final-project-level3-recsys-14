from typing_extensions import dataclass_transform
import pandas as pd
import numpy as np
import scipy.stats
import seaborn as sns
from sklearn.metrics.pairwise import cosine_similarity
import warnings
warnings.filterwarnings(action='ignore')
import pickle
import torch
from sklearn.preprocessing import MinMaxScaler
from cmfrec import CMF, CMF_implicit
import bottleneck as bn
from .preprocess import load_data, preprocess_rival

#참고: https://cotak.tistory.com/25
from sqlalchemy import create_engine
import os
import json
import pymysql


def numerize_for_infer(tp, profile2id, show2id):
    uid = tp['handle'].apply(lambda x: profile2id[x])
    sid = tp['problems'].apply(lambda x: show2id[x])
    return pd.DataFrame(data={'uid': uid, 'sid': sid}, columns=['uid', 'sid'])


def make_item_attributes(df_problems, df_user_problems, show2id):
    # 문제별 tag 정리
    tags = ['math', 'implementation', 'greedy', 'string', 'data-structures', 'geometry', 'dp', 'graphs']
    df_problems_tag= df_problems[['problem_id','tags']]
    df_problems_tag.problem_id= df_problems_tag.problem_id.astype('str')
    df_problems_tag.tags= df_problems_tag.tags.apply(lambda x: str(x).split(','))
    df_problems_tag= df_problems_tag.explode('tags').reset_index(drop=True)
    df_problems_tag= df_problems_tag[df_problems_tag.tags.isin(tags)]
    df_problems_tag['values']=1
    df_problems_tag= df_problems_tag.pivot_table(index="problem_id", columns=["tags"],aggfunc=np.sum,values='values', fill_value=0)

    # 푼 문제가 고르기
    df_problems_tag.reset_index(inplace=True, drop=False)
    solved_unique = df_user_problems.problems.unique()
    df_solved_problems_tag = df_problems_tag[df_problems_tag.problem_id.isin(solved_unique)]

    #문제 ID 변환
    df_solved_problems_tag.problem_id = df_solved_problems_tag.problem_id.apply(lambda x: show2id[x])

    # 푼 문제 고르기
    df_problems.problem_id = df_problems.problem_id.astype('str')
    solved_unique = df_user_problems.problems.unique()
    df_solved_problems = df_problems[df_problems.problem_id.isin(solved_unique)]

    #문제 ID 변환
    df_solved_problems.problem_id = df_solved_problems.problem_id.apply(lambda x: show2id[x])

    # 두 데이터프레임 합치기
    df_item_attributes = pd.merge(df_solved_problems, df_solved_problems_tag, left_on='problem_id', right_on='problem_id')

    # 불필요한 행 제거
    df_item_attributes.drop('id', axis=1, inplace=True)
    df_item_attributes.drop('tags', axis=1, inplace=True)
    df_item_attributes.drop('title', axis=1, inplace=True)
    df_item_attributes.drop('is_solvable', axis=1, inplace=True)

    # Minmax scaler를 사용하여 scaling 하기
    accepted_user_scaler = MinMaxScaler()
    avg_tries_scaler = MinMaxScaler()

    df_item_attributes.accepted_user_count = accepted_user_scaler.fit_transform(df_item_attributes.accepted_user_count.values.reshape(-1, 1))
    df_item_attributes.average_tries = avg_tries_scaler.fit_transform(df_item_attributes.average_tries.values.reshape(-1, 1))

    return df_item_attributes

def make_user_attributes(df_user_problems, profile2id, df_users):
    # 푼 유저 고르기
    unique_users = df_user_problems.handle.unique()
    df_users = df_users[df_users.handle.isin(unique_users)]

    # 유저 ID 변환
    df_users.handle = df_users.handle.apply(lambda x: profile2id[x])

    # 불필요한 행 지우기
    df_users.drop('id', axis=1, inplace=True)
    df_users.drop('organization', axis=1, inplace=True)
    df_users.drop('rival_count', axis=1, inplace=True)
    df_users.drop('reverse_rival_count', axis=1, inplace=True)
    df_users.drop('rating', axis=1, inplace=True)
    df_users.drop('exp', axis=1, inplace=True)
    df_users.drop('rank', axis=1, inplace=True)
    df_users.drop('max_streak', axis=1, inplace=True)

    # Minmax scaler를 사용하여 scaling 하기
    solved_count_scaler = MinMaxScaler()
    rating_by_problems_sum_scaler = MinMaxScaler()
    rating_by_class_scaler = MinMaxScaler()
    rating_by_solved_count_scaler = MinMaxScaler()

    df_users.solved_count = solved_count_scaler.fit_transform(df_users.solved_count.values.reshape(-1, 1))
    df_users.rating_by_problems_sum = rating_by_problems_sum_scaler.fit_transform(df_users.rating_by_problems_sum.values.reshape(-1, 1))
    df_users.rating_by_class = rating_by_class_scaler.fit_transform(df_users.rating_by_class.values.reshape(-1, 1))
    df_users.rating_by_solved_count = rating_by_solved_count_scaler.fit_transform(df_users.rating_by_solved_count.values.reshape(-1, 1))

    return df_users


def make_lst_rivals(i, df_result):
    return df_result['r1'][i]+','+df_result['r2'][i]+','+df_result['r3'][i]+','+df_result['r4'][i]+','+df_result['r5'][i]+','+df_result['r6'][i]


def first_division(num):
    for i in range(2, num+1):
        if num % i == 0:
            return i
    return 1


def rival_cmf(db):
    df_problems, df_problems_solved, df_users, df_problems_class = load_data(db)

    df_user_problems = df_problems_solved[['handle', 'problems']]
    df_user_problems.problems = df_user_problems.problems.str.split(',')
    df_user_problems = df_user_problems.explode('problems').reset_index(drop=True)
    df_user_problems = df_user_problems.dropna(axis=0)
    
    # change id
    ## profile id
    df_user_problems = df_user_problems[df_user_problems.problems != '']
    unique_uid = df_user_problems.handle.unique()
    profile2id = dict((pid, i) for (i, pid) in enumerate(unique_uid))
    ## item ID
    unique_sid = pd.unique(df_user_problems['problems'])
    show2id = dict((sid, i) for (i, sid) in enumerate(unique_sid))
    with open('/home/recognizer14/airflow/dags/module_models/rec_rival/cmf_prog/unique_sid.txt', 'w') as f:
        for sid in unique_sid:
            f.write('%s\n' % sid)
    with open('/home/recognizer14/airflow/dags/module_models/rec_rival/cmf_prog/show2id.pkl','wb') as f:
        pickle.dump(show2id,f)
    with open('/home/recognizer14/airflow/dags/module_models/rec_rival/cmf_prog/profile2id.pkl','wb') as f:
        pickle.dump(profile2id,f)
    print("Done Preprocessing")

    # 데이터 준비 
    infer_df = numerize_for_infer(df_user_problems, profile2id, show2id)
    ## ratings data
    infer_df.columns = ['UserId', 'ItemId']
    infer_df['Rating'] = 1
    ## item attributes
    df_item_attributes = make_item_attributes(df_problems, df_user_problems, show2id)
    ## user attirubtes
    df_users = make_user_attributes(df_user_problems, profile2id, df_users)

    ratings = infer_df.copy() ## item attributes
    ratings = ratings[ratings.UserId.isin(df_users.handle.values)]
    ratings.reset_index(drop=True, inplace=True)
    df_item_attributes = df_item_attributes.rename(columns={"problem_id": "ItemId"})
    item_sideinfo = df_item_attributes.copy()
    item_sideinfo = item_sideinfo.sort_values('ItemId').reset_index(drop=True)
    
    df_users = df_users.rename(columns={"handle": "UserId"}) ##user attributes
    user_side_info = df_users.copy()
    user_side_info = user_side_info.sort_values('UserId').reset_index(drop=True)
    print("Done making side info")

    # 모델링
    model_with_sideinfo = CMF_implicit(k=100, lambda_=1e+1, w_main=0.5, w_user=0.5, w_item=0.25)
    model_with_sideinfo.fit(X=ratings, U=user_side_info, I=item_sideinfo)
    print("Done modeling")

    # 비슷한 유저 추천
    tmp_user = np.dot(model_with_sideinfo.A_, model_with_sideinfo.C_.T)
    emb_user = tmp_user

    #유저간 유사도 구하기
    #device= torch.device("cuda" if torch.cuda.is_available() else "cpu")
    device = "cpu"
    print("DEVICE: ", device)
    df_for_cos= torch.tensor(emb_user, dtype=torch.float16)
    print("torch로 변환  완료")
    df_for_cos= df_for_cos.to(device)
    print("matmul 시작")
    dot_result= torch.matmul(df_for_cos, df_for_cos.T)
    print(df_for_cos.dtype)
    #https://discuss.pytorch.org/t/runtimeerror-lu-cuda-not-implemented-for-half/110389
    df_for_cos = df_for_cos.type(torch.float32)
    print(df_for_cos.dtype)
    print("size_result 계산 중 ")
    size_result= torch.sqrt(torch.sum(df_for_cos**2,axis=1)) * torch.sqrt(torch.sum(df_for_cos.T**2,axis=0))
    dot_result /= (size_result+np.finfo('float16').eps)
    del size_result
    dot_result= dot_result.cpu().numpy()
    
    print("Start computation")
    divisor = first_division(len(dot_result))
    print('갯수:', len(dot_result))
    print('divisor:', divisor)
    i=0
    for batch in np.split(dot_result, divisor, axis=0):
        if i==0:
            index_result= bn.argpartition(-batch, 6, axis=1)[:, :6]
        else:
            index_result= np.concatenate((index_result,bn.argpartition(-batch, 6, axis=1)[:, :6]),axis=0) 
        i+=1
    print("Done finding similar users")

    target_users= list(df_users.UserId.values)

    df_result = pd.DataFrame(index_result)
    df_result.columns = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6']
    df_result['target'] = target_users
    
    id2profile = dict((v,k) for k,v in profile2id.items())
    df_result['target'] = df_result['target'].apply(lambda x: id2profile[x])
    df_result['r1'] = df_result['r1'].apply(lambda x: id2profile[x])
    df_result['r2'] = df_result['r2'].apply(lambda x: id2profile[x])
    df_result['r3'] = df_result['r3'].apply(lambda x: id2profile[x])
    df_result['r4'] = df_result['r4'].apply(lambda x: id2profile[x])
    df_result['r5'] = df_result['r5'].apply(lambda x: id2profile[x])
    df_result['r6'] = df_result['r6'].apply(lambda x: id2profile[x])

    df_result['rec_rivals'] = [make_lst_rivals(i, df_result) for i in range(len(df_result))]
    
    output = pd.DataFrame(df_result.target.values, columns=['handle'])
    output['rec_rivals'] = df_result.rec_rivals
    output.index += 1  #mysql에서 auto increment를 위해 1 추가
    output.index.name='id'
    output.to_csv('/home/recognizer14/airflow/dags/module_models/rec_rival/cmf_prog/rec_rival_cmf.csv')

    return output

