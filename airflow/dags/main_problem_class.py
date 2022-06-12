from scrapers.problem_class_scraper import scraper_problem_class_main

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta


def scraper_problem_class(): #https://desmort68.tistory.com/9
    scraper_problem_class_main()
    return {"result": "problems_class 테이블에 저장 완료!"}


#if __name__ == "__main__":
    #print(scrapers())
#    print(check())
#    print(save_rec_rivals_problems())

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
        dag_id='airflow_problem_class2',
        default_args=default_args,
        schedule_interval= '@once',#0 14 * * *',#'0 0 */3 * *', # at 00:00 (midnight) every three days.
        tags=['recjoon_my_dags2']
) as dag:
    # PythonOperator 사용
    task1 = PythonOperator(
        task_id = 'scraper_problem_class',  # task의 id
        python_callable = scraper_problem_class,  # 실행할 python 함수
        retries = 3
    )

    task1