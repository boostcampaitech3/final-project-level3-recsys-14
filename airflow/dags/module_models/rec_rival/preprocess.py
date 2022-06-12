# import streamlit as st
import pandas as pd
from sqlalchemy import create_engine
import pymysql
from sklearn.preprocessing import MinMaxScaler
import numpy as np

def rm_comma(x):
    return ''.join(str(x).split(','))

# @st.cache
def load_data(db):
    df_problems = pd.read_sql('select * from problems', db)
    df_problems_solved = pd.read_sql('select * from problems_solved', db)
    df_users= pd.read_sql('select * from users',db)
    df_problems_class= pd.read_sql('select * from problems_class',db)

    # 전처리
    df_problems = df_problems[df_problems.is_solvable == True]
    df_problems['tags'].loc[df_problems.tags.isnull()] =''
    df_problems[df_problems['level']!=0]

    df_problems_solved.drop(df_problems_solved[df_problems_solved.problems==''].index, axis=0, inplace=True)

    df_users= df_users[df_users.handle.isin(df_problems_solved.handle)]
    # df_users= df_users[df_users.handle.isin(df_rec_rivals.handle)]
    df_users.drop(df_users[df_users.handle.isin(list(set(df_users[df_users.solved_count == 0].handle)-set(df_problems_solved.handle)))].index, axis=0, inplace=True)
    df_users= df_users[df_users.handle.isin(df_problems_solved.handle)]


    df_problems.reset_index(inplace=True,drop=True)
    df_problems_solved.reset_index(inplace=True,drop=True)
    df_users.reset_index(inplace=True,drop=True)

    return df_problems, df_problems_solved, df_users, df_problems_class


def preprocess_rival(df_problems_solved,df_problems,df_users):
    ## 레벨 별 풀이 수
    ## 레벨 별 풀이 수
    df_user_problems = df_problems_solved[['handle', 'problems']]
    df_user_problems.problems = df_user_problems.problems.str.split(',')
    df_user_problems = df_user_problems.explode('problems').reset_index(drop=True)
    df_user_problems['problems']= df_user_problems['problems'].astype('int')
    df_user_problems = df_user_problems.dropna(axis=0)

    df_user_problems= pd.merge(df_user_problems, df_problems[['problem_id','level']], left_on= 'problems', right_on='problem_id', how='left')
    df_user_problems.fillna(0, inplace=True) # df_problems에 없는 문제를 풀었을 경우 na값이 들어감
    df_user_problems= df_user_problems.groupby(['handle','level'])['problems'].agg('count')
    df_user_problems = pd.DataFrame(df_user_problems)
    df_user_problems.reset_index(inplace=True)
    df_user_problems= df_user_problems.pivot_table(index="handle", columns=["level"],aggfunc=np.sum,values='problems', fill_value=0)
    df_user_problems= pd.DataFrame(df_user_problems)
    df_users_info= df_user_problems.reset_index()
    # level0컬럼 삭제
    df_users_info.drop([0.0],axis=1, inplace=True)
    
    ## 정규화
    # df_users3: 수치형 변수(handle 제외 모든 변수) 정규화
    df_users3= df_users_info

    scaler= MinMaxScaler()
    num_vars= list(df_users3.columns[1:]) # 핸들 제외 레벨 30개
    df_users3[num_vars]= scaler.fit_transform(df_users3[num_vars])

    df_users4= df_users[['id','handle','solved_count','user_class','tier','rating_by_class','rating_by_solved_count','rating_by_problems_sum']]
    scaler= MinMaxScaler()
    num_vars= ['solved_count','user_class','rating_by_class','rating_by_solved_count','rating_by_problems_sum'] #'tier'
    df_users4[num_vars]= scaler.fit_transform(df_users4[num_vars])
    
    df_users4= pd.merge(df_users3, df_users4, on= 'handle')
    df_users4= df_users4.sort_values('id')
    df_users4.reset_index(drop=True, inplace=True)
    df_users4.drop('id', axis=1, inplace=True)
    return df_users4