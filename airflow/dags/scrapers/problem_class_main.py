import sys
#sys.path.append(r'/opt/ml/airflow/dags/models/scrapers')

#from .args import parse_args
from sqlalchemy.orm import Session
#from .database import session_local
#from .problem_class_scraper import scraper_problem_class_main
#from .entity import ProblemsClass
#from .query import get_problems_class_by_problem_id, update_problems_class, insert_problems_class
from .database import session_local
from .problem_class_scraper import scraper_problem_class_main
from .entity import ProblemsClass
from .query import get_problems_class_by_problem_id, update_problems_class, insert_problems_class

def get_problems_from_problem_class(db: Session, problem_id: str):
    handle_found = get_problems_class_by_problem_id(db, problem_id)
    if isinstance(handle_found, ProblemsClass):
        return handle_found.id
    return -1

def scraper_problem_class_main(): #https://desmort68.tistory.com/9

    # Insert whole DataFrame into MySQL
    with session_local() as db:
        output = scraper_problem_class_main()
        output.index += 1
        output.index.name = 'id'
        output.reset_index(inplace=True, drop=False)
        print(output)
        
        for i in range(0, len(output)): # 17분 정도 소요됨.
            if i == 0:
                print(output.id[i], output.title[i])

            problems_class = ProblemsClass()
            problems_class.id = output.id[i]
            problems_class.problem_id = output.problem_id[i]
            problems_class.title = output.title[i]
            problems_class.accepted_user_count = output.accepted_user_count[i]
            problems_class.average_tries = output.average_tries[i]
            problems_class.class_n = output.class_n[i]

            id_exist = get_problems_from_problem_class(db, problems_class.problem_id)
            if id_exist != -1:
                problems_class.id = id_exist
                update_problems_class(db, problems_class)
            # 존재하지 않으면 INSERT
            else:
                insert_problems_class(db, problems_class)

    return {"result": "problems_class 테이블에 저장 완료!"}


def scraper_problem_class_scrap(): #https://desmort68.tistory.com/9
    print("SCRAPPING")
    output = scraper_problem_class_main()
    output.reset_index(inplace=True, drop=False)
    output.to_csv('problem_class.csv')



if __name__ == "__main__":
    scraper_problem_class_scrap()
