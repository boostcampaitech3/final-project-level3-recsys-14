import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from database import DB, DB_read
from sqlalchemy.orm import sessionmaker
import pymysql

from scrapers.problem_class_scraper import scraper_problem_class_main
from scrapers.main import scrap_problem_main, scrap_user_main, scrap_problem_solved_main

from module_models.rec_general.recvae.main import from_pre_to_train 
from module_models.rec_general.check_rec_pb_result import check_main_pb

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
from airflow.operators.python import PythonOperator
from airflow.operators.dummy_operator import DummyOperator
from datetime import datetime, timedelta

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

#####################################################
def scraper_problem_class(): #https://desmort68.tistory.com/9
    scraper_problem_class_main()
    return {"result": "problems_class 테이블에 저장 완료!"}

def scraper_problem():
    scrap_problem_main(4)
    return {"result": "scraper_problem 완료!"}

def scraper_user():
    scrap_user_main(4)
    return {"result": "scrap_user 완료!"}

def scraper_problem_solved():
    scrap_problem_solved_main(4)
    return {"result": "scrap_problem_solved 완료!"}



##################################################문제 추천 관련 기능
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



######################################################라이벌 추천 관련 기능
def get_id_from_rec_rivals(db: Session, handle: str):
    handle_found = get_rec_rivals_by_handle(db, handle)
    if isinstance(handle_found, RecommendRivals):
        return handle_found.id
    return -1
    
def rec_rival_knn():    
    db2 = create_db_read()
    output = rival_knn_main(db=db2)
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

    output = check_main_rival(db2)
    output.reset_index(inplace=True, drop=False)

    with session_local() as db:
        for i in range(0, len(output)): # 25분 정도 소요됨.
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

################################################라이벌 문제 추천
def rec_rival_pb_mf():    
    db = create_db_read()
    output = main_mf_als(db=db)
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





default_args = {
    'owner': 'sun',
    'depends_on_past': False,  # 이전 DAG의 Task가 성공, 실패 여부에 따라 현재 DAG 실행 여부가 결정. False는 과거의 실행 결과 상관없이 매일 실행한다
    'start_date': datetime(2022, 6, 7),
    'retires': 3,  # 실패시 재시도 횟수
    'retry_delay': timedelta(minutes=5)  # 만약 실패하면 5분 뒤 재실행
    # 'priority_weight': 10 # DAG의 우선 순위를 설정할 수 있음
    # 'end_date': datetime(2022, 4, 24) # DAG을 마지막으로 실행할 Date
    # 'execution_timeout': timedelta(seconds=300), # 실행 타임아웃 : 300초 넘게 실행되면 종료
    # 'on_failure_callback': some_function # 만약에 Task들이 실패하면 실행할 함수
    # 'on_success_callback': some_other_function
    # 'on_retry_callback': another_function
}

# with 구문으로 DAG 정의
with DAG(
        dag_id='airflow_all',
        default_args=default_args,
        schedule_interval= '@once',#0 14 * * *',#'0 0 */3 * *', # at 00:00 (midnight) every three days.
        tags=['recjoon_my_dags2']
) as dag:
    # PythonOperator 사용
    scrap1 = PythonOperator(
        task_id = 'scraper_problem_class',  # task의 id
        python_callable = scraper_problem_class,  # 실행할 python 함수
        retries = 3
    )
    scrap2 = PythonOperator(
        task_id = 'scraper_problem',  # task의 id
        python_callable = scraper_problem,  # 실행할 python 함수
        retries = 3
    )
    scrap3 = PythonOperator(
        task_id = 'scraper_user',  # task의 id
        python_callable = scraper_user,  # 실행할 python 함수
        retries = 3
    )
    scrap4 = PythonOperator(
        task_id = 'scraper_problem_solved',  # task의 id
        python_callable = scraper_problem_solved,  # 실행할 python 함수
        retries = 3
    )

    general_pb1 = PythonOperator(
        task_id='rec_general_recvae',
        python_callable = rec_general_recvae,  # 실행할 python 함수
        retries = 3
    )
    general_pb_dummy = DummyOperator(
        task_id = 'general_pb_dummy'
    )
    general_pb_check_save = PythonOperator(
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

    scrap1 >> scrap2 >> scrap3 >> scrap4 >> [general_pb1] >> general_pb_dummy >> general_pb_check_save >> [rival1, rival2] >> rival_dummy >> rival_check_save >> [rival_pb1, rival_pb2, rival_pb3] >> rival_pb_dummy >> rival_pb_check 


