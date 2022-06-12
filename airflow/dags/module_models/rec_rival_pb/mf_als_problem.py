from sqlalchemy import create_engine
import os
import pymysql
import numpy as np
import pandas as pd
import random
from scipy import sparse
import bottleneck as bn
import bottleneck as bn
from implicit.evaluation import *
from implicit.als import AlternatingLeastSquares as ALS
import pickle
from .preprocess import load_data, preprocess_rival_prob
from .filtering import filter
import torch

import warnings
warnings.filterwarnings("ignore")

def first_division(num):
    for i in range(2, num+1):
        if num % i == 0:
            return i
    return 1

def numerize_for_profile(x):
    return profile2id[x]
def numerize_for_problem(x):
    return show2id[x]

def main_mf_als(db):
    seed = 0
    global profile2id, show2id
    df_problems_solved, df_problems_class, df_rec_rivals, df_problems= load_data(db)
    print('데이터 로드 완료!')
    lst_rivals= df_rec_rivals['rec_rivals']
    target_users= df_rec_rivals['handle']
    
    data, profile2id, show2id,  df_user_problems= preprocess_rival_prob(df_problems_solved)

    with open('/opt/ml/airflow/dags/module_models/rec_rival_pb/mf_als_prog/show2id.pkl','wb') as f:
        pickle.dump(show2id,f)
    with open('/opt/ml/airflow/dags/module_models/rec_rival_pb/mf_als_prog/profile2id.pkl','wb') as f:
        pickle.dump(profile2id,f)

    print('데이터 전처리 완료!')
    f= filter(lst_rivals,profile2id, show2id) # 라이벌은 풀고 타겟유저는 안푼 문제에 대한 csr matrix
    check, df_only_prob= f.filter_prob(df_problems_solved,target_users)

    # als 모델링
    device= torch.device("cuda" if torch.cuda.is_available() else "cpu") 
    if torch.cuda.is_available():
        use_gpu_value = True
    else:
        use_gpu_value = False
    print('DEVICE: ', device)
    print("use_gpu_value: ", use_gpu_value)

    als_model = ALS(factors=7, regularization=0.01, iterations = 50, random_state=seed, use_gpu=use_gpu_value)
    als_model.fit(data)

    print('모델 학습 완료!')
    
    # 유사도 구할 행렬 
    # df_user_level 유저별로 상위 레벨(+유저가 많이 푼) 30개 문제 추출
    df_user_level= pd.merge(df_user_problems,df_problems[['problem_id','level','accepted_user_count']], right_on='problem_id', left_on='problems', how='left')
    df_user_level.fillna(0, inplace=True)
    df_user_level.drop(['problem_id'], axis=1, inplace=True)

    df_user_level= df_user_level.sort_values(['handle','level','accepted_user_count'], ascending=False)
    df_user_level.reset_index(inplace=True, drop=True)

    df_user_level['handle']= df_user_level['handle'].apply(numerize_for_profile)
    df_user_level['problems']= df_user_level['problems'].apply(numerize_for_problem)

    df_user_level= df_user_level.groupby('handle')[['handle','problems']].head(30)

    df_user_level= df_user_level.groupby('handle')['problems'].agg(list)
    df_user_level= pd.DataFrame(df_user_level)
    df_user_level.reset_index(inplace=True) # 유사도 구할 행렬

    # df_only_prob: 라이벌은 풀었지만 타겟유저는 풀지 않은 문제들
    df_only_prob= df_only_prob.groupby('handle')['problems'].agg(list)
    df_only_prob= pd.DataFrame(df_only_prob)
    df_only_prob.reset_index(inplace=True) # 유사도 구할 행렬

    df_sim= pd.merge(df_user_level, df_only_prob, on='handle')
    df_sim.rename({'problems_x': 'target_prob','problems_y':'rival_prob'}, axis=1, inplace=True)

    # 유사도 구하기
    print('유저에게 적합한 문제 추출 중...')

    item_f= als_model.item_factors
    def recommend_prob(x):
        if len(x['rival_prob']) <= 30:
            return x['rival_prob']
        cos=cosine_similarity(item_f[x['target_prob']],item_f[x['rival_prob']])
        cos= (-cos).argsort()
        col=0
        result= cos[:,col]
        result=list(set(result))
        
        while len(result) <30:
            col+=1
            lst= cos[:,col]
            lst= list(set(lst)-set(result))
            add= 30-len(result)
            try:
                result.extend(lst[:add])
            except:
                result.extend(lst)

        return result
        
    df_sim['rec_problems']= df_sim.apply(lambda x: recommend_prob(x), axis=1)
    # denumerize
    id2profile = dict((int(v), str(k)) for k, v in profile2id.items())
    id2item = dict((int(v), str(k)) for k, v in show2id.items())
    
    df_sim['handle']=df_sim['handle'].apply(lambda x: id2profile[x])
    df_sim['rec_problems']=df_sim['rec_problems'].apply(lambda x: list(map(lambda x: id2item[x], x)))

    result= df_sim[['handle','rec_problems']]
    result.rec_problems= result.rec_problems.apply(lambda x: (',').join(x))

    result.index += 1  #mysql에서 auto increment를 위해 1 추가
    result.index.name='id'

    print('라이벌 기반 문제 추천 완료!')
    result.to_csv('/opt/ml/airflow/dags/module_models/rec_rival_pb/mf_als_prog/rec_rival_pb_mf_als_output.csv')

    return result
