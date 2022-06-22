from abc import abstractproperty
import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from database import DB, DB_read
from sqlalchemy.orm import sessionmaker
import pymysql

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
    print("~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    print(DB['user'])
    print(DB['password'])
    print("~~~~~~~~~~~~~~~~~~~~~~~~~~~")

    db = pymysql.connect(host = DB['host'],
                     port = DB['port'],
                     user = DB['user'],
                     password = DB['password'],
                     db = DB['database'])
    return db


###############################################################문제 추천 관련 기능
def general_problem_preprocess():
    db2 = create_db_read()
    general_problem_preprocessing(db=db2)
    db2.close()
    return {"result": "General Problem 전처리 완료"}

def rec_general_recvae(): #학습해서 베스트 score 저장
    recvae_train()
    return {"result": "General Problem 추천 REVAE 모델 훈련 완료"}

def rec_general_vae(): #학습해서 베스트 score 저장
    vae_train()
    return {"result": "General Problem 추천 VAE 모델 훈련 완료"}

def rec_general_dae(): #학습해서 베스트 score 저장
    dae_train()
    return {"result": "General Problem 추천 DAE 모델 훈련 완료"}

def get_id_from_rec_general_problems(db: Session, handle: str):
    handle_found = get_rec_general_problems_by_handle(db, handle)
    if isinstance(handle_found, RecommendGeneralProblems):
        return handle_found.id
    return -1

def rec_general_pb_check_save(): # 저장된 score 비교해서 best 모델 선정 및 디비 저장
    db2 = create_db_read()
    session_local = create_connection()
   
    output = general_pb_infer(db2)
    output.columns = ['handle', 'rec_problems']
    output.index += 1  #mysql에서 auto increment를 위해 1 추가
    output.index.name='id'
    output.reset_index(inplace=True, drop=False)

    with session_local() as db:
        for i in tqdm(range(0, len(output))): # 17분 정도 소요됨.
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
def rec_rival_knn():    
    db2 = create_db_read()
    output = rival_knn_main(db=db2)
    output.to_csv('rec_rival_knn.csv')
    output.reset_index(inplace=True, drop=False)
    db2.close()
    print('--------KNN output: ', len(output))
    return {"result": "Rival 추천 KNN 완료!"}

def rec_rival_cmf():    
    db = create_db_read()
    output = rival_cmf(db=db)
    print('--------CMF output: ', len(output))
    db.close()
    return {"result": "Rival 추천 CMF 완료!"}

    
def rec_rival_check_save():
    db2 = create_db_read()
    session_local = create_connection()

    output = check_main_rival(db = db2)
    #output = pd.read_csv('/opt/ml/airflow/dags/module_models/rec_rival/knn_prog/rec_rival_knn.csv')
    output.reset_index(inplace=True, drop=False)
    print(output)

    df_rec_rivals = pd.read_sql('select * from recommend_rivals',db2)
    out_list = set(df_rec_rivals.handle.values) - set(output.handle.values) 
    out_list = list(out_list)

    print("지우기--------")
    with session_local() as db:      
        # 기존 테이블에 있지만, 새로운 output에 없는 유저들은 테이블에서 지우기
        for out_handle in out_list:
            print(out_handle)
            delete_rec_rivals(db, out_handle)     
        print("지우기 완료--------")

    
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

def get_id_from_rec_rivals(db: Session, handle: str):
    handle_found = get_rec_rivals_by_handle(db, handle)
    if isinstance(handle_found, RecommendRivals):
        return handle_found.id
    return -1

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
    print(output)
    db.close()
    return {"result": "Rival Problems 추천 BPR 완료!"}

def rec_rival_pb_item_based_cf():    
    db = create_db_read()
    output = main_item_based_cf(db=db)
    print(output)
    db.close()
    return {"result": "Rival Problems 추천 Item-Based-CF 완료!"}

def get_id_from_rec_rivals_problems(db: Session, handle: str):
    handle_found = get_rec_rivals_problems_by_handle(db, handle)
    if isinstance(handle_found, RecommendRivalsProblems):
        return handle_found.id
    return -1

def rec_rival_pb_check():
    db2 = create_db_read()
    session_local = create_connection()

    output = check_main_rival_pb(db2)
    #output = main_mf_als(db2)
    #print(output)
    output.reset_index(inplace=True, drop=False)
    print(output)
    db2.close()


# 각 output 성는 비교 후  best 결과를 디비에 저장
def rec_rival_pb_check_save():
    db2 = create_db_read()
    session_local = create_connection()

    output = check_main_rival_pb(db2)
    #output = main_mf_als(db2)
    output.reset_index(inplace=True, drop=False)

    df_rec_rivals_pbs = pd.read_sql('select * from recommend_rivals_problems',db2)
    out_list = set(df_rec_rivals_pbs.handle.values) - set(output.handle.values) 
    out_list = list(out_list)
    print("지우기--------")
    with session_local() as db:        
        for out_handle in out_list:
            print(out_handle)
            delete_rec_rivals_problems(db, out_handle)
    print("지우기 완료--------")

    with session_local() as db:
        for i in tqdm(range(0, len(output))): # 20분 정도 소요됨.
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


default_args = {
    'owner': 'sun',
    'depends_on_past': False,  # 이전 DAG의 Task가 성공, 실패 여부에 따라 현재 DAG 실행 여부가 결정. False는 과거의 실행 결과 상관없이 매일 실행한다
    'start_date': datetime(2022, 6, 8),
    'retires': 3,  # 실패시 재시도 횟수
    'retry_delay': timedelta(minutes=5)  # 만약 실패하면 5분 뒤 재실행
}

# with 구문으로 DAG 정의
with DAG(
        dag_id='fin_airflow_moduel_models',
        default_args=default_args,
        schedule_interval= '@once',#0 0 */3 * *',#15 * * * *',#0 0 */3 * *', # at 00:00 (midnight) every three days.
        tags=['recjoon_my_dags2']
) as dag:

    g0= PythonOperator(
        task_id='general_problem_preprocess',
        python_callable = general_problem_preprocess,  # 실행할 python 함수
        retries = 3
    )
    g1= PythonOperator(
        task_id='rec_general_recvae',
        python_callable = rec_general_recvae,  # 실행할 python 함수
        retries = 3
    )
    g2 = PythonOperator(
        task_id='rec_general_vae',
        python_callable = rec_general_vae,  # 실행할 python 함수
        retries = 3
    )
    g3 = PythonOperator(
        task_id='rec_general_dae',
        python_callable = rec_general_dae,  # 실행할 python 함수
        retries = 3
    )
    g4 = DummyOperator(
        task_id = 'general_pb_dummy2'
    )
    g5 = PythonOperator(
        task_id='rec_general_pb_check_save',
        python_callable = rec_general_pb_check_save,  # 실행할 python 함수
        retries = 3
    )

    rival1 = PythonOperator(
        task_id='rec_rival_knn',
        python_callable = rec_rival_knn,  # 실행할 python 함수
        retries = 3
    )
    rival2 = PythonOperator(
        task_id='rec_rival_cmf',
        python_callable = rec_rival_cmf,  # 실행할 python 함수
        retries = 3
    )
    rival_dummy = DummyOperator(
        task_id = 'rival_dummy'
    )
    rival_check_save = PythonOperator(
        task_id='rec_rival_check_save',
        python_callable = rec_rival_check_save,  # 실행할 python 함수
        retries = 3
    )


    rival_pb1 = PythonOperator(
        task_id='rec_rival_pb_mf',
        python_callable = rec_rival_pb_mf,  # 실행할 python 함수
        retries = 3
    )
    rival_pb2 = PythonOperator(
        task_id='rec_rival_pb_bpr',
        python_callable = rec_rival_pb_bpr,  # 실행할 python 함수
        retries = 3
    )
    rival_pb3 = PythonOperator(
        task_id='rec_rival_pb_item_based_cf',
        python_callable = rec_rival_pb_item_based_cf,  # 실행할 python 함수
        retries = 3
    )
    rival_pb_dummy = DummyOperator(
        task_id = 'rec_ribal_pb_dummy'
    )
    rival_pb_check = PythonOperator(
        task_id='rec_rival_pb_check_save',
        python_callable = rec_rival_pb_check_save,  # 실행할 python 함수
        retries = 3
    )

g0 >> [g1, g2, g3] >> g4 >> g5 >> [rival1, rival2] >> rival_dummy >> rival_check_save >> [rival_pb1, rival_pb2, rival_pb3] >> rival_pb_dummy >> rival_pb_check 

#if __name__ == "__main__":
    #rec_rival_check_save()
    #rint("--------------MF")
    #rec_rival_pb_mf()
#    print("--------------BPR")
#    rec_rival_pb_bpr()
#    print("--------------Item based")
#    rec_rival_pb_item_based_cf()
#    print("--------------Check")
#    rec_rival_pb_check()

#rec_rival_pb_mf openblas 에러 >> cpu로 돌리기 >> airflow 돌리기