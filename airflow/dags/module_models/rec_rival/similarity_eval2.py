import pandas as pd
import numpy as np
from .preprocess_for_eval import load_data  
pd.set_option('mode.chained_assignment',  None) 
import warnings
warnings.filterwarnings("ignore")

def make_dataframe(user):
    # if type(user)==str:
    #     user=[user]
    tmp= df_problems_solved[df_problems_solved['handle'].isin(user)]
    tmp.problems= tmp.problems.apply(lambda x: str(x).split(','))
    tmp= tmp.explode('problems')
    tmp.problems= tmp.problems.astype('int')
    tmp= pd.merge(df_problems_class[['problem_id','class_n']], tmp, how='right', left_on='problem_id', right_on='problems')
    tmp.fillna(0, inplace=True)
    tmp.drop(['problem_id'], axis=1, inplace=True)
    tmp= pd.merge(df_problems[['problem_id','level']], tmp, how='right', left_on='problem_id', right_on='problems')
    tmp.fillna(0, inplace=True)
    tmp.drop(['problems'], axis=1, inplace=True)
    print('평가용 데이터프레임 생성 완료!')
    return tmp

def _possible_bonus_class(x):
    cnt= x.count()
    if cnt>=20:
        return 1
    return 0


def _cut_100(df):
    tmp_level= df.sort_values(['handle','level'], ascending=False)
    d= pd.DataFrame(tmp_level.groupby('handle')['problem_id'].count() >=100)
    idx= d[d.problem_id==True].index
    result= tmp_level[tmp_level.handle.isin(idx)].groupby('handle').head(100)
    result= pd.concat([result,tmp_level[~tmp_level.handle.isin(idx)]], axis=0)

    return result

def _give_bonus_class(x):
    if x==0:
        return 0
    elif x== 1 or x==2:
        return 25 # bonus_class
    elif x >=3 and x<=5:
        return 50
    else:
        return 10

def _give_bonus_solved_count(x):
    return  175*(1-0.995**(x))

def bonus_class(tmp):
    # 클래스 문제 풀이 수
    # 문제풀이 데이터셋 생성
    tmp_class= tmp.groupby(['handle','class_n'])['problem_id'].agg([_possible_bonus_class])
    tmp_class.reset_index(inplace=True)
    # tmp_class.drop(tmp_class[tmp_class['class']==0].index, axis=0, inplace=True)
    # tmp_class.reset_index(inplace=True,drop=True)
    tmp_class['bonus_class']= tmp_class['class_n'].apply(_give_bonus_class)
    # _possible_bonus_class가 0인 행들은 보너스 점수 0으로
    tmp_class['bonus_class'].iloc[tmp_class[tmp_class._possible_bonus_class==0].index]=0
    tmp_class= tmp_class.groupby('handle')['bonus_class'].sum()
    if len(tmp_class)==0:
        return [0]
    tmp_class= pd.DataFrame(tmp_class).reset_index()
    return tmp_class

def score_level(tmp):
    # 푼 문제 난이도 합
    tmp_level= tmp.sort_values(['handle','level'], ascending=False)

    tmp_level= _cut_100(tmp_level)
    tmp_level= tmp_level.groupby('handle')['level'].sum()
    tmp_level= pd.DataFrame(tmp_level).reset_index()
    return tmp_level


def bonus_solved_count(user):
    # 푼 문제 수
    # if type(user)==str:
    #     user=[user]
    tmp_cnt= df_users[df_users.handle.isin(user)][['handle','solved_count']]
    tmp_cnt.solved_count= tmp_cnt.solved_count.apply(_give_bonus_solved_count)
    return tmp_cnt


def diff(rival, target, max_score, num_rival=6):
    return np.average(np.sum(abs(target-rival)/max_score,axis=1)/num_rival)

def evaluate(target_user,lst_rivals, db):
    def convert_solved_count(x):
        return list(tmp_solved_count[tmp_solved_count.handle.isin(x)]['solved_count'].values)
    def convert_class(x):
        return list(tmp_class[tmp_class.handle.isin(x)]['bonus_class'].values)
    def convert_level(x):
        return list(tmp_level[tmp_level.handle.isin(x)]['level'].values)

    global df_problems, df_problems_solved, df_users, df_problems_class
    df_problems, df_problems_solved, df_users, df_problems_class = load_data(db)

    lst_rivals= list(lst_rivals.apply(lambda x: x.split(',')).values)
    df_target= make_dataframe(target_user)
    print("dataframe 만들기 완료")
    tmp_level= score_level(df_target)
    rivals_level= list(map(convert_level, lst_rivals))
    print("score level 적용 완료")
    rivals_level=np.array(rivals_level)
    target_level= tmp_level.level.values
    target_level=np.expand_dims(target_level,1)
    print('target_level 평가 완료!')

    tmp_class= bonus_class(df_target)
    print("bonus_class 적용 완료")
    rivals_class= list(map(convert_class, lst_rivals))
    print("convert_class 적용 완료")
    rivals_class=np.array(rivals_class)
    target_class= tmp_class.bonus_class.values
    target_class=np.expand_dims(target_class,1)
    print('target_class 평가 완료!')

    tmp_solved_count= bonus_solved_count(target_user)
    print("bonus_solved_count 적용 완료")
    rivals_solved_count= list(map(convert_solved_count, lst_rivals))
    print("convert_solved_count 적용 완료")
    rivals_solved_count=np.array(rivals_solved_count)
    target_solved_count= tmp_solved_count.solved_count.values
    target_solved_count=np.expand_dims(target_solved_count,1)
    print('target_solved_count 평가 완료!')

    diff_solved_count= diff(rivals_solved_count,target_solved_count, 175)
    diff_level= diff(rivals_level, target_level, 3000)
    diff_class= diff(rivals_class, target_class, 250)

    return [diff_solved_count, diff_level, diff_class, (diff_solved_count + diff_level + diff_class)/3]

# def evaluate(target_users, lst_rivals):
#     leng= len(target_users)
#     result= [evaluate_inference(target_users[idx], lst_rivals[idx]) for idx in range(leng)]
#     result= np.array(result)
#     diff_solved_count, diff_level, diff_class, diff_avg= np.average(result, axis=0)
#     return diff_solved_count, diff_level, diff_class, diff_avg
