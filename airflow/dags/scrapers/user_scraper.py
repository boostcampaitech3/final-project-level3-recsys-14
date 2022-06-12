import time
import json
import requests
from .entity import Users

from .query import get_user_by_handle, update_user, insert_user, delete_user
from sqlalchemy.orm import Session

headers = { "Content-Type": "application/json" }
base_url = "https://solved.ac/api/v3/"
search_user_url = "ranking/tier"


def get_id_from_user(db: Session, handle: str):
    user_found = get_user_by_handle(db, handle)
    if isinstance(user_found, Users):
        return user_found.id

    return -1

def scrap_user_per_page(db: Session, page: int):
    url = base_url + search_user_url
    querystring = {"page": f"{page}"}

    response = requests.request("GET", url, headers=headers, params=querystring)

    result = dict()
    result["item"] = json.loads(response.text).get("items")

    for index, item in enumerate(result["item"]):
        user = Users()
        user.handle = item.get("handle")
        user.solved_count = int(item.get("solvedCount"))
        user.user_class = int(item.get("class"))
        user.tier = int(item.get("tier"))
        user.rating = int(item.get("rating"))
        user.rating_by_problems_sum = int(item.get("ratingByProblemsSum"))
        user.rating_by_class = int(item.get("ratingByClass"))
        user.rating_by_solved_count = int(item.get("ratingBySolvedCount"))
        user.exp = int(item.get("exp"))
        user.rival_count = int(item.get("rivalCount"))
        user.reverse_rival_count = int(item.get("reverseRivalCount"))
        user.max_streak = int(item.get("maxStreak"))
        user.rank = (page - 1) * 100 + (index + 1)

        organizations = []
        organizations_data = item.get("organizations")

        if organizations_data:
            for organization in organizations_data:
                organizations.append(str(organization.get("organizationId")))

            user.organization = ",".join(organizations)

        # 이미 존재하면 UPDATE
        id_exist = get_id_from_user(db, user.handle)
        if id_exist != -1:
            user.id = id_exist
            update_user(db, user)
        # 존재하지 않으면 INSERT
        else:
            insert_user(db, user)


def scrap_user(db: Session, args_time_interval):
    url = base_url + search_user_url
    querystring = {"page": "1"}

    try:
        response = requests.request("GET", url, headers=headers, params=querystring)
        num_user = json.loads(response.text).get("count")
    except:
        print("Connection Failed")
        return

    start_page = 1
    end_page = int(num_user / 100) + (num_user % 100 > 0)
    #end_page = 1
    time_interval = args_time_interval

    for page in range(start_page, end_page + 1):
        try:
            print(f"Get page {page} now and still {end_page - page} left!")
            scrap_user_per_page(db, page)
        except:
            print(f"Scraping page {page} failed")
            pass
        time.sleep(time_interval)
