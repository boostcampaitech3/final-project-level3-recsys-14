import pandas as pd
from .preprocess_for_eval import load_data
import warnings
warnings.filterwarnings("ignore")

# 유저가 푼 상위 레벨 문제 100개 추출
def user_level(user):
    tmp= df_problems_solved[df_problems_solved['handle'].isin(user)]
    tmp.problems= tmp.problems.apply(lambda x: str(x).split(','))
    tmp= tmp.explode('problems')
    tmp.problems= tmp.problems.astype('int')
    tmp.fillna(0, inplace=True)
    tmp= pd.merge(df_problems[['problem_id','level']], tmp, how='right', left_on='problem_id', right_on='problems')
    tmp.fillna(0, inplace=True)
    tmp.drop(['problems'], axis=1, inplace=True)
    tmp= tmp.sort_values(['handle','level'], ascending=False)
    tmp=tmp.groupby('handle')[['handle','level','problem_id']].head(100)
    user_level= tmp.groupby(['handle'])['level'].agg('mean')
    print('타겟 유저가 푼 문제레벨 테이블 생성완료!')
    return user_level

def rec_level(user, lst_probs):
    tmp= pd.DataFrame(lst_probs)
    tmp['handle']=user
    tmp[0]= tmp[0].apply(lambda x: str(x).split(','))
    tmp= tmp.explode(0)
    tmp[0]=tmp[0].astype('int')
    tmp= pd.merge(df_problems[['problem_id','level']], tmp, how='right', left_on='problem_id', right_on=0)
    tmp.fillna(0, inplace=True)
    tmp.drop([0], axis=1, inplace=True)
    prob_level= tmp.groupby(['handle'])['level'].agg('mean')
    print('평가용 데이터프레임 생성 완료!')
    return prob_level

def prob_evaluate_high(target_user, lst_probs, db):
    lst_probs= list(lst_probs)
    target_user= list(target_user)
    global df_problems, df_problems_solved, df_users,df_problems_class
    df_problems, df_problems_solved, df_users, df_problems_class = load_data(db)
    
    user_avg= user_level(target_user)
    user_avg= pd.DataFrame(target_user)[0].apply(lambda x: user_avg[x])
    prob_avg= rec_level(target_user, lst_probs)
    prob_avg= pd.DataFrame(target_user)[0].apply(lambda x: prob_avg[x])

    return sum(abs(prob_avg - user_avg))/len(prob_avg)

