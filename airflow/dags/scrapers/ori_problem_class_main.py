import sys

from problem_class_scraper import scraper_problem_class_main




def scraper_problem_class_scrap(): #https://desmort68.tistory.com/9
    print("SCRAPPING")
    output = scraper_problem_class_main()
    output.index += 1
    output.index.name = 'id'
    output.reset_index(inplace=True, drop=False)
    output.to_csv('problem_class.csv')



if __name__ == "__main__":
    scraper_problem_class_scrap()
