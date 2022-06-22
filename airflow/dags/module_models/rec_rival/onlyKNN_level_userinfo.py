import pandas as pd
import numpy as np
from sqlalchemy import create_engine
import os
import json
import pymysql
from sklearn.neighbors import NearestNeighbors
from .preprocess import load_data, preprocess_rival
import warnings
warnings.filterwarnings("ignore")


def remove_self(x):
    if x[0] in x[1]:
        return np.delete(x[1],np.where(x[0]==x[1])[0])
    else:
        return x[1][:6]


def rival_knn_main(db):
    df_problems, df_problems_solved, df_users, df_problems_class= load_data(db)
    print('데이터 로드 완료!')
    df_data= preprocess_rival(df_problems_solved,df_problems,df_users)
    print('데이터 전처리 완료!')
    knn = NearestNeighbors(n_neighbors=7, p=1)
    data= np.array(df_data.iloc[:,1:])
    knn.fit(data)
    rival_idx= knn.kneighbors(data, return_distance=False)
    print('knn 학습 수행 완료!')
    result=([[k,v] for k,v in zip(list(range(len(rival_idx))),rival_idx)])
    df_result= pd.DataFrame(result)
    df_result[1]= df_result.apply(remove_self, axis=1)
    df_result= df_result[1]
    lst_rivals= [','.join(list(df_data['handle'].iloc[x].values)) for x in df_result]
    target_users= list(df_data.handle)

    output = pd.DataFrame(target_users, columns=['handle'])
    output['rec_rivals'] = lst_rivals
    output.index += 1  #mysql에서 auto increment를 위해 1 추가
    output.index.name='id'
    output.to_csv('/home/recognizer14/airflow/dags/module_models/rec_rival/knn_prog/rec_rival_knn.csv')

    print('라이벌 추천 완료!')
    return output