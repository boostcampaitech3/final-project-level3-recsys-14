# import streamlit as st
import pandas as pd
from sqlalchemy import create_engine
import pymysql
from scipy import sparse
import numpy as np
import pickle

import warnings
warnings.filterwarnings("ignore")

def rm_comma(x):
    return ''.join(str(x).split(','))

# @st.cache
def load_data(db):
    df_problems = pd.read_sql('select * from problems', db)
    df_problems_solved = pd.read_sql('select * from problems_solved', db)
    df_users= pd.read_sql('select * from users',db)
    df_problems_class= pd.read_sql('select * from problems_class',db)
    df_rec_rivals = pd.read_sql('select * from recommend_rivals',db)

    # 전처리
    df_problems = df_problems[df_problems.is_solvable == True]
    df_problems['tags'].loc[df_problems.tags.isnull()] =''
    df_problems= df_problems[df_problems['level']!=0]

    df_problems_solved.drop(df_problems_solved[df_problems_solved.problems==''].index, axis=0, inplace=True)

    df_users= df_users[df_users.handle.isin(df_problems_solved.handle)]
    df_users= df_users[df_users.handle.isin(df_rec_rivals.handle)]
    df_users.drop(df_users[df_users.handle.isin(list(set(df_users[df_users.solved_count == 0].handle)-set(df_problems_solved.handle)))].index, axis=0, inplace=True)
    df_users= df_users[df_users.handle.isin(df_problems_solved.handle)]
    
    df_problems.reset_index(inplace=True,drop=True)
    df_problems_solved.reset_index(inplace=True,drop=True)
    df_users.reset_index(inplace=True,drop=True)

    return df_problems_solved, df_problems_class, df_rec_rivals, df_problems

def numerize_for_infer(tp, profile2id, show2id):
    uid = tp['handle'].apply(lambda x: profile2id[x])
    sid = tp['problems'].apply(lambda x: show2id[x])
    return pd.DataFrame(data={'uid': uid, 'sid': sid}, columns=['uid', 'sid'])

def preprocess_rival_prob(df_problems_solved):
    ## 문제 id
    df_user_problems = df_problems_solved[['handle', 'problems']]
    df_user_problems.problems = df_user_problems.problems.str.split(',')
    df_user_problems = df_user_problems.explode('problems').reset_index(drop=True)
    df_user_problems['problems']= df_user_problems['problems'].astype('int')
    df_user_problems = df_user_problems.dropna(axis=0)
    df_user_problems = df_user_problems[df_user_problems.problems != '']
    df_user_problems['problems']= df_user_problems['problems'].astype('int')
    df_user_problems = df_user_problems.dropna(axis=0)
    ##아이템 ID
    unique_sid = pd.unique(df_user_problems['problems'])
    show2id = dict((sid, i) for (i, sid) in enumerate(unique_sid))

    # profile id
    unique_uid = df_user_problems.handle.unique()
    profile2id = dict((pid, i) for (i, pid) in enumerate(unique_uid))

    infer_df = numerize_for_infer(df_user_problems, profile2id, show2id)

    n_items = infer_df['sid'].max()+1
    n_users = infer_df['uid'].max() + 1

    rows, cols = infer_df['uid'], infer_df['sid']
    data = sparse.csr_matrix((np.ones_like(rows),
    (rows, cols)), dtype='float64', shape=(n_users, n_items))


    return data, profile2id, show2id, df_user_problems