# import streamlit as st
import pandas as pd
from sqlalchemy import create_engine
import os
import json
import pymysql

def rm_comma(x):
    return ''.join(str(x).split(','))

# @st.cache
def load_data(db):
    df_problems = pd.read_sql('select * from problems', db)
    df_problems_solved = pd.read_sql('select * from problems_solved', db)
    df_users= pd.read_sql('select * from users',db)
    df_problems_class= pd.read_sql('select * from problems_class',db)
    #df_problems_class = pd.read_csv('/opt/ml/airflow/dags/module_models/rec_rival/problems_class.csv')
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