from scrapers.main import scrap_problem_main, scrap_user_main, scrap_problem_solved_main


from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta



def scraper_problem():
    scrap_problem_main(4)
    return {"result": "scraper_problem 완료!"}

def scraper_user():
    scrap_user_main(4)
    return {"result": "scrap_user 완료!"}

def scraper_problem_solved():
    scrap_problem_solved_main(4)
    return {"result": "scrap_problem_solved 완료!"}



default_args = {
    'owner': 'sun',
    'depends_on_past': False,  # 이전 DAG의 Task가 성공, 실패 여부에 따라 현재 DAG 실행 여부가 결정. False는 과거의 실행 결과 상관없이 매일 실행한다
    'start_date': datetime(2022, 6, 2),
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
        dag_id='airflow_scrapping2',
        default_args=default_args,
        schedule_interval= '@once', #'*/30 * * * *',#'@once',
        tags=['recjoon_my_dags2']
) as dag:
    # PythonOperator 사용
    task1 = PythonOperator(
        task_id = 'scraper_problem',  # task의 id
        python_callable = scraper_problem,  # 실행할 python 함수
        retries = 3
    )
    
    task2 = PythonOperator(
        task_id = 'scraper_user',  # task의 id
        python_callable = scraper_user,  # 실행할 python 함수
        retries = 3
    )

    task3 = PythonOperator(
        task_id = 'scraper_problem_solved',  # task의 id
        python_callable = scraper_problem_solved,  # 실행할 python 함수
        retries = 3
    )


    task1 >> task2 >> task3  # task1 이후에 task2 실행
    