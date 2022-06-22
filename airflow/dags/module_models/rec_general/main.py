from .preprocessing import preprocessing_all
from .inference import infer_all
from .train_recvae import train_recvae
from .train_vae import train_vae
from .train_dae import train_dae
import pandas as pd
import numpy as np
from .utils import *
from .config import *
import json

def make_train_data(db):
    df_problems_solved = pd.read_sql('SELECT * FROM problems_solved', db)
    df_problems_solved['problems'] = df_problems_solved['problems'].str.split(',')
    df_problems_solved = df_problems_solved.replace(['', 'null'], [np.nan, np.nan])
    df_problems_solved = df_problems_solved.explode('problems').dropna().reset_index(drop=True)
    df_problems_solved = df_problems_solved.replace(['', 'null'], [np.nan, np.nan])
    df_problems_solved = df_problems_solved.dropna()
    df_problems_solved = df_problems_solved.drop(columns=['id'])
    df_problems_solved = df_problems_solved.astype({'handle':'str', 'problems':'int'})
    df_problems_solved.columns = ['user', 'item']

    raw_data, user_activity, item_popularity = filter_triplets(df_problems_solved, 5, 10)
    #---------------------------
    # 여기에 tag == None인 아이템은 제외
    df_problems = pd.read_sql('select * from problems', db)
    df_problems.drop(df_problems[df_problems.average_tries == 7340].index, axis=0, inplace=True)
    # level 0에 해당하는 문제 제거
    df_problems = df_problems[df_problems.level != 0]
    # not_solvable == False만
    df_problems = df_problems[df_problems.is_solvable == True]
    # tag가 nan인 문제 제거
    df_problems = df_problems[~df_problems.tags.isnull()]

    gudegi = [24900, 24901, 24902, 24903, 24904, 24905, 24906, 24907, 24908, 24909, 24910, 24911, 21292, 21293, 21294, 21295, 21296, 21297, 21298, 21299, 18821, 18822, 18823, 18824, 18825, 18826, 18827, 18828, 18829, 18830, 18831, 18832, 18833, 18834, 18835, 18836, 17106, 17107, 17108, 17109, 17110, 17111, 17112, 17113, 17114, 17115, 17116, 17117, 17118, 17119, 17120, 15629, 15630, 15631, 15632, 15633, 15634, 15635, 15636, 15637, 15638, 15639, 15640, 15641, 15642, 15643]
    df_problems = df_problems[~df_problems['problem_id'].isin(gudegi)].reset_index(drop=True)

    raw_data = raw_data[raw_data['item'].isin(df_problems['problem_id'].values)].reset_index(drop=True)
    #---------------------------

    return raw_data, df_problems


def general_problem_preprocessing(db):
    raw_data, df_problems = make_train_data(db)

    print("Preprocessing Start!!")
    preprocessing_all(raw_data, df_problems, db)


def recvae_train():
    print("Train Start!!")
    train_recvae()

def vae_train():
    print("Train Start!!")
    train_vae()

def dae_train():
    print("Train Start!!")
    train_dae()

def general_pb_infer(db):
    raw_data, df_problems = make_train_data(db)

    print("Inference Start!!")
    output = infer_all(raw_data, df_problems, db)
    output.item = output.item.astype(str)
    output = output.groupby('user')['item'].apply(lambda x: "%s" % ','.join(x))
    output = pd.DataFrame(output)
    output = output.reset_index()

    return output

#if __name__ == '__main__':
#   df_problems_solved = 데이터 읽기
#   raw_data = make_train_data(df_problems_solved)
#   print(from_pre_to_infer(raw_data))