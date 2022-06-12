import time
import json
import requests
from .entity import Problems

from .query import get_problem_by_problem_id, update_problem, insert_problem, delete_problem
from sqlalchemy.orm import Session

headers = { "Content-Type": "application/json" }
base_url = "https://solved.ac/api/v3/"
search_problem_url = "search/problem"


def get_id_from_problem(db: Session, problem_id: int):
    problem_found = get_problem_by_problem_id(db, problem_id)
    if isinstance(problem_found, Problems):
        return problem_found.id

    return -1

def scrap_problem_per_page(db: Session, page: int):
    url = base_url + search_problem_url
    querystring = {"query": " ", "page": f"{page}"}

    response = requests.request("GET", url, headers=headers, params=querystring)

    result = dict()
    result["item"] = json.loads(response.text).get("items")
    for item in result["item"]:
        problem = Problems()
        problem.problem_id = int(item.get("problemId"))
        problem.title = item.get("titleKo")
        problem.is_solvable = item.get("isSolvable")
        problem.accepted_user_count = int(item.get("acceptedUserCount"))
        problem.level = int(item.get("level"))
        problem.average_tries = int(item.get("averageTries"))

        tags = []
        tags_data = item.get("tags")

        if tags_data:
            for tag in tags_data:
                tags.append(tag.get("key"))

            problem.tags = ",".join(tags)

        # 이미 존재하면 UPDATE
        id_exist = get_id_from_problem(db, problem.problem_id)
        if id_exist != -1:
            problem.id = id_exist
            update_problem(db, problem)
        # 존재하지 않으면 INSERT
        else:
            insert_problem(db, problem)


def scrap_problem(db: Session, args_time_interval):
    time_interval = args_time_interval
    url = base_url + search_problem_url
    querystring = {"query": " ", "page": "1"}

    try:
        response = requests.request("GET", url, headers=headers, params=querystring)
        num_problem = json.loads(response.text).get("count")
    except:
        print("Connection Failed")
        return

    start_page = 1
    end_page = int(num_problem / 100) + (num_problem % 100 > 0)
    #end_page = 1

    for page in range(start_page, end_page + 1):
        try:
            print(f"Get page {page} now and still {end_page - page} left!")
            scrap_problem_per_page(db, page)
        except:
            print(f"Scraping page {page} failed")
            pass
        time.sleep(time_interval)
