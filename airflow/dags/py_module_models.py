import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from database import DB, DB_read
from sqlalchemy.orm import sessionmaker
import pymysql

from module_models.rec_general.recvae.main import from_pre_to_train 
from module_models.rec_general.check_rec_pb_result import check_main_pb

from module_models.rec_general.main import general_problem_preprocessing, recvae_train, vae_train, dae_train, general_pb_infer

from module_models.rec_rival.onlyKNN_level_userinfo import rival_knn_main
from module_models.rec_rival.CMF import rival_cmf
from module_models.rec_rival.check_rec_rival_results import check_main_rival

from module_models.rec_rival_pb.mf_als_problem import main_mf_als
from module_models.rec_rival_pb.bpr_problem import main_bpr
from module_models.rec_rival_pb.item_based_cf_problem import main_item_based_cf
from module_models.rec_rival_pb.check_rec_rival_pb_results import check_main_rival_pb

from entity import RecommendGeneralProblems, RecommendRivals, RecommendRivalsProblems
from query import *
from sqlalchemy.orm import Session

from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
from tqdm import tqdm

def create_connection():
    DB_URl = f"mysql+pymysql://{DB['user']}:{DB['password']}@{DB['host']}:{DB['port']}/{DB['database']}"
    engine = create_engine(DB_URl, encoding='utf-8')
    session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return session_local

def create_db_read():
    db = pymysql.connect(host = DB_read['host'],
                     port = DB_read['port'],
                     user = DB_read['user'],
                     password = DB_read['password'],
                     db = DB_read['database'])
    return db


###############################################################문제 추천 관련 기능
def rec_general_recvae(): #학습해서 베스트 score 저장
    db = create_db_read()

    from_pre_to_train(db=db)
    db.close()
    return {"result": "General Problem 추천 모델 훈련 완료"}


def get_id_from_rec_general_problems(db: Session, handle: str):
    handle_found = get_rec_general_problems_by_handle(db, handle)
    if isinstance(handle_found, RecommendGeneralProblems):
        return handle_found.id
    return -1

def rec_general_pb_check_save(): # 저장된 score 비교해서 best 모델 선정 및 디비 저장
    db2 = create_db_read()
    session_local = create_connection()

    with session_local() as db:
        output = check_main_pb(db2)
        output.columns = ['handle', 'rec_problems']
        output.index += 1  #mysql에서 auto increment를 위해 1 추가
        output.index.name='id'
        output.reset_index(inplace=True, drop=False)
        print(output)
    
        # 디비 저장
        # 이미 존재하면 UPDATE
        for i in range(0, len(output)): # 17분 정도 소요됨.
            if i == 0:
                print(output.id[i], output.handle[i])
            rec_gen_pb = RecommendGeneralProblems()
            rec_gen_pb.id = output.id[i]
            rec_gen_pb.handle = output.handle[i]
            rec_gen_pb.rec_problems = output.rec_problems[i]

            id_exist = get_id_from_rec_general_problems(db, rec_gen_pb.handle)
            if id_exist != -1:
                rec_gen_pb.id = id_exist
                update_rec_general_problems(db, rec_gen_pb)
            # 존재하지 않으면 INSERT
            else:
                insert_rec_general_problems(db, rec_gen_pb)
    db2.close()
    return {"result": "모델의 결과를 recommend_general_problems 테이블에 저장 완료!"}


###new
def general_problem_preprocess():
    db2 = create_db_read()
    general_problem_preprocessing(db=db2)
    db2
    return {"result": "General Problem 전처리 완료"}

def rec_general_recvae2(): #학습해서 베스트 score 저장
    recvae_train()
    return {"result": "General Problem 추천 REVAE 모델 훈련 완료"}

def rec_general_vae(): #학습해서 베스트 score 저장
    vae_train()
    return {"result": "General Problem 추천 VAE 모델 훈련 완료"}

def rec_general_dae(): #학습해서 베스트 score 저장
    dae_train()
    return {"result": "General Problem 추천 DAE 모델 훈련 완료"}

def a_rec_general_pb_check(): # 저장된 score 비교해서 best 모델 선정 및 디비 저장
    db2 = create_db_read()
    session_local = create_connection()

    with session_local() as db:
        output = general_pb_infer(db2)
        output.columns = ['handle', 'rec_problems']
        output.index += 1  #mysql에서 auto increment를 위해 1 추가
        output.index.name='id'
        output.reset_index(inplace=True, drop=False)
        print(output)
        print(len(output))
    output.to_csv('py_module_models.csv')
    db2.close()
    return {"result":"완료"}
    
def rec_general_pb_check_save2(): # 저장된 score 비교해서 best 모델 선정 및 디비 저장
    db2 = create_db_read()
    session_local = create_connection()

    with session_local() as db:
        output = general_pb_infer(db2)
        output.columns = ['handle', 'rec_problems']
        output.index += 1  #mysql에서 auto increment를 위해 1 추가
        output.index.name='id'
        output.reset_index(inplace=True, drop=False)
        print(output)
    
        # 디비 저장
        # 이미 존재하면 UPDATE
        for i in range(0, len(output)): # 17분 정도 소요됨.
            if i == 0:
                print(output.id[i], output.handle[i])
            rec_gen_pb = RecommendGeneralProblems()
            rec_gen_pb.id = output.id[i]
            rec_gen_pb.handle = output.handle[i]
            rec_gen_pb.rec_problems = output.rec_problems[i]

            id_exist = get_id_from_rec_general_problems(db, rec_gen_pb.handle)
            if id_exist != -1:
                rec_gen_pb.id = id_exist
                update_rec_general_problems(db, rec_gen_pb)
            # 존재하지 않으면 INSERT
            else:
                insert_rec_general_problems(db, rec_gen_pb)
    db2.close()
    return {"result": "모델의 결과를 recommend_general_problems 테이블에 저장 완료!"}
###############################################################라이벌 추천 관련 기능
def get_id_from_rec_rivals(db: Session, handle: str):
    handle_found = get_rec_rivals_by_handle(db, handle)
    if isinstance(handle_found, RecommendRivals):
        return handle_found.id
    return -1
    
def rec_rival_knn():    
    db2 = create_db_read()
    output = rival_knn_main(db=db2)
    print(output)
    output.to_csv('rec_rival_knn.csv')
    output.reset_index(inplace=True, drop=False)
    db2.close()
    return {"result": "Rival 추천 KNN 완료!"}

def rec_rival_cmf():    
    db = create_db_read()
    output = rival_cmf(db=db)
    db.close()
    return {"result": "Rival 추천 CMF 완료!"}

def rec_rival_check_save():
    db2 = create_db_read()
    session_local = create_connection()

#    output = check_main_rival(db2)
    output = rival_knn_main(db=db2)
    output.reset_index(inplace=True, drop=False)

    with session_local() as db:
        for i in tqdm(range(0, len(output))): # 25분 정도 소요됨.
            rec_rival = RecommendRivals()
            rec_rival.id = output.id[i]
            rec_rival.handle = output.handle[i]
            rec_rival.rec_rivals = output.rec_rivals[i]
            id_exist = get_id_from_rec_rivals(db, rec_rival.handle)
            if id_exist != -1:
                rec_rival.id = id_exist
                update_rec_rivals(db, rec_rival)
            # 존재하지 않으면 INSERT
            else:
                insert_rec_rivals(db, rec_rival)

    # 일단 여기에 디비 저장 만들기
    db2.close()
    return {"result": "모델의 결과를 recommend_rivals 테이블에 저장 완료!"}

###############################################################라이벌 문제 추천
def rec_rival_pb_mf():    
    db = create_db_read()
    output = main_mf_als(db=db)
    print(output)
    db.close()
    return {"result": "Rival Problems 추천 MF-ALS 완료!"}

def rec_rival_pb_bpr():    
    db = create_db_read()
    output = main_bpr(db=db)
    db.close()
    return {"result": "Rival Problems 추천 BPR 완료!"}

def rec_rival_pb_item_based_cf():    
    db = create_db_read()
    output = main_item_based_cf(db=db)
    db.close()
    return {"result": "Rival Problems 추천 Item-Based-CF 완료!"}

def get_id_from_rec_rivals_problems(db: Session, handle: str):
    handle_found = get_rec_rivals_problems_by_handle(db, handle)
    if isinstance(handle_found, RecommendRivalsProblems):
        return handle_found.id
    return -1

# 각 output 성는 비교 후  best 결과를 디비에 저장
def rec_rival_pb_check_save():
    db2 = create_db_read()
    session_local = create_connection()

    output = check_main_rival_pb(db2)
    output.reset_index(inplace=True, drop=False)

    with session_local() as db:
        for i in range(0, len(output)): # 20분 정도 소요됨.
            if i == 0:
                print(output.id[i], output.handle[i])
            rec_rival_problems = RecommendRivalsProblems()
            rec_rival_problems.id = output.id[i]
            rec_rival_problems.handle = output.handle[i]
            rec_rival_problems.rec_problems = output.rec_problems[i]

            id_exist = get_id_from_rec_rivals_problems(db, rec_rival_problems.handle)
            if id_exist != -1:
                rec_rival_problems.id = id_exist
                update_rec_rivals_problems(db, rec_rival_problems)
            # 존재하지 않으면 INSERT
            else:
                insert_rec_rivals_problems(db, rec_rival_problems)

    db2.close()
    return {"result": "모델의 결과를 recommend_rivals_problems 테이블에 저장 완료!"}


if __name__ == "__main__":
    
    #1. rec_rival_knn() 을 실행.
    #2. 1번에서 나온 결과를 디비의 recommend_rivals 테이블에 올리기.
    #3. rec_rival_pb_mf()을 실행. (키 에러 발생 -> rec_rival_knn 결과에서 현재 problems_solved에 푼 문제가 없는 유저가 이름에 들어가 있다. -> rec_rival_knn부터 전처리 수정 필요)
    #4. 3번에서 나온 결과를 디비의 recommend_rivals_problems 테이블에 올리기.

# db 업데이트 >> mf-als >> 디비 업데이트 >> a_rec_general_pb_check
