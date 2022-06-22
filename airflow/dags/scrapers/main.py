import sys
#sys.path.append(r'/opt/ml/airflow/dags/models/scrapers')

#from .args import parse_args
from .database import session_local
from .problem_scraper import scrap_problem
from .user_scraper import scrap_user
from .problem_solved_scraper import scrap_problem_solved

def main(args):
    with session_local() as db:
        target_data = args.target_data
        if target_data == 'problem':
            scrap_problem(db, args)
        elif target_data == 'user':
            scrap_user(db, args)
        elif target_data == 'problem_solved':
            scrap_problem_solved(db, args)


def scrap_problem_main(args_time_interval):
    with session_local() as db:
        scrap_problem(db, args_time_interval)

def scrap_user_main(args_time_interval):
    with session_local() as db:
        scrap_user(db, args_time_interval)
        
def scrap_problem_solved_main(args_time_interval):
    with session_local() as db:
        scrap_problem_solved(db, args_time_interval)


#if __name__ == "__main__":
#    args = parse_args()
#    main(args)


