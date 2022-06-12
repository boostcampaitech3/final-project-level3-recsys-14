import requests
from lxml import etree
from bs4 import BeautifulSoup as bs
import pandas as pd

problem_id = []
title = []
accepted_user_count = []
average_tries = []
class_n = []

class_num = [i for i in range(1, 11)]


def scraper_problem_class_main():
    for i in range(10):
        base_url = "https://solved.ac/class/"+str(class_num[i])
        response = requests.request("GET", base_url)

        page = requests.get(base_url)
        soup = bs(page.text, "html.parser")
        dom = etree.HTML(str(soup))

        # 클래스당 문제 수 확인하기
        text_class = soup.find("tbody", class_="css-1d9xc1d").get_text()
        string = text_class.replace(u'\xa0', u' ')
        number_pbs = len(string.split('.'))
        print(number_pbs)

        # 필요 내용 크롤링
        for j in range(1, number_pbs+1):
            xx = dom.xpath('//*[@id="__next"]/div/div[2]/div[2]/div[1]/table/tbody/tr['+str(j)+']/td[1]/div/div/div/a/span')
            try:
                problem_id.append(int(xx[0].text))

                xx = dom.xpath('//*[@id="__next"]/div/div[2]/div[2]/div[1]/table/tbody/tr['+str(j)+']/td[2]/span/div/div[1]/span/div/a/span')
                title.append(xx[0].text)

                xx = dom.xpath('//*[@id="__next"]/div/div[2]/div[2]/div[1]/table/tbody/tr['+str(j)+']/td[3]/div')
                accepted_user_count.append(int(xx[0].text.replace(',', '')))

                xx = dom.xpath('//*[@id="__next"]/div/div[2]/div[2]/div[1]/table/tbody/tr['+str(j)+']/td[4]/div')
                average_tries.append(float(xx[0].text))

                class_n.append(class_num[i])
            except:
                print(xx)
                break
        print(class_num[i], "완료")


    df = pd.DataFrame(problem_id, columns=['problem_id'])
    df['title'] = title
    df['accepted_user_count'] = accepted_user_count
    df['average_tries'] = average_tries
    df['class_n'] = class_n

    return df
