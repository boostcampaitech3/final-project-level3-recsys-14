from .preprocessing import preprocessing_all
from .inference import infer_all
from .train_recvae import train_recvae
from .train_vae import train_vae
from .train_dae import train_dae
import pandas as pd
import numpy as np

def make_train_data(df_problems_solved):
    df_problems_solved['problems'] = df_problems_solved['problems'].str.split(',')
    df_problems_solved = df_problems_solved.replace(['', 'null'], [np.nan, np.nan])
    df_problems_solved = df_problems_solved.explode('problems').dropna().reset_index(drop=True)
    df_problems_solved = df_problems_solved.replace(['', 'null'], [np.nan, np.nan])
    df_problems_solved = df_problems_solved.dropna()
    df_problems_solved = df_problems_solved.drop(columns=['id'])
    df_problems_solved = df_problems_solved.astype({'handle':'str', 'problems':'int'})
    df_problems_solved.columns = ['user', 'item']
    return df_problems_solved


def general_problem_preprocessing(db):
    df_problems_solved = pd.read_sql('select * from problems_solved', db)
    raw_data = make_train_data(df_problems_solved)

    print("Preprocessing Start!!")
    preprocessing_all(raw_data, db)


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
    df_problems_solved = pd.read_sql('select * from problems_solved', db)
    raw_data = make_train_data(df_problems_solved)

    print("Inference Start!!")
    output = infer_all(raw_data, db)
    output.item = output.item.astype(str)
    output = output.groupby('user')['item'].apply(lambda x: "%s" % ','.join(x))
    output = pd.DataFrame(output)
    output = output.reset_index()

    return output

#if __name__ == '__main__':
#   df_problems_solved = 데이터 읽기
#   raw_data = make_train_data(df_problems_solved)
#   print(from_pre_to_infer(raw_data))