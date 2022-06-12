from .preprocess import load_data, preprocess_rival_prob
from .filtering import filter
from scipy import sparse
import pickle
import bottleneck as bn
import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings(action='ignore')
from tqdm import tqdm
import implicit


def processing_tags(df_problems):
    # tag
    tags = ['math', 'implementation', 'greedy', 'string', 'data_structures', 'geometry', 'dp', 'graphs']
    df_problems_tag= df_problems[['problem_id','tags']]
    df_problems_tag.problem_id= df_problems_tag.problem_id.astype('str')
    df_problems_tag.tags= df_problems_tag.tags.apply(lambda x: str(x).split(','))
    df_problems_tag= df_problems_tag.explode('tags').reset_index(drop=True)
    df_problems_tag= df_problems_tag[df_problems_tag.tags.isin(tags)]
    df_problems_tag['values']=1
    df_problems_tag= df_problems_tag.pivot_table(index="problem_id", columns=["tags"],aggfunc=np.sum,values='values', fill_value=0)
    df_problems_tag = df_problems_tag.reset_index()
    return df_problems_tag

def processing_user_probelms(df_problems_solved):
    df_user_problems = df_problems_solved[['handle', 'problems']]
    df_user_problems.problems = df_user_problems.problems.str.split(',')
    df_user_problems = df_user_problems.explode('problems').reset_index(drop=True)
    df_user_problems = df_user_problems.dropna(axis=0)
    df_user_problems = df_user_problems[df_user_problems.problems != '']
    return df_user_problems


def main_item_based_cf(db):
    seed = 0
    df_problems_solved, df_problems_class, df_rec_rivals = load_data(db)
    df_problems = pd.read_sql('select * from problems', db)

    # 유저별 푼 태그와 문제 난이도 구하기
    col_tag = ['data_structures', 'geometry', 'graphs', 'greedy','implementation','math','string', 'dp']
    scaling_cols = ['math', 'implementation', 'greedy', 'string', 'data_structures','geometry','dp','graphs']
    cosin_using_tags = ['level', 'dp', 'geometry', 'graphs', 'greedy', 'implementation', 'math', 'string', 'data_structures']

    df_problems_tag = processing_tags(df_problems)
    df_user_problems = processing_user_probelms(df_problems_solved)

    df = pd.merge(df_user_problems, df_problems_tag, left_on='problems', right_on='problem_id')
    df_users_with_solved_tags = df.groupby('handle')[col_tag].sum()
    df_users_with_solved_tags = df_users_with_solved_tags.reset_index()

    df_problems.problem_id = df_problems.problem_id.astype('str')
    df_user_problems_info = pd.merge(df_user_problems, df_problems, left_on='problems',right_on='problem_id')

    df_user_pb_level = df_user_problems_info.groupby('handle')['level'].mean()
    df_user_pb_level = df_user_pb_level.reset_index()
    df_users_with_solved_tags = pd.merge(df_users_with_solved_tags, df_user_pb_level, left_on='handle', right_on='handle', how='left')
    
    # 추천된 문제들의 태그와 난이도 구하기
    df_problems = pd.read_sql('select * from problems', db)
    df_problems_tag = processing_tags(df_problems)
    df_problems.problem_id = df_problems.problem_id.astype('str')
    df_new_problems = pd.merge(df_problems, df_problems_tag, how='outer', left_on='problem_id', right_on='problem_id')
    df_new_problems.fillna(0, inplace=True)

    # 라이벌은 풀고 내가 안 푼 문제
    df_problems_solved, _, df_rec_rivals= load_data(db)
    print('데이터 로드 완료!')
    lst_rivals= df_rec_rivals['rec_rivals']
    target_users= df_rec_rivals['handle']
        
    data, profile2id, show2id= preprocess_rival_prob(df_problems_solved)
    
    with open('/opt/ml/airflow/dags/module_models/rec_rival_pb/item_based_prog/show2id.pkl','wb') as f:
        pickle.dump(show2id,f)
    with open('/opt/ml/airflow/dags/module_models/rec_rival_pb/item_based_prog/profile2id.pkl','wb') as f:
        pickle.dump(profile2id,f)

    print('데이터 전처리 완료!')
    f= filter(lst_rivals,profile2id, show2id) # 라이벌은 풀고 타겟유저는 안푼 문제에 대한 csr matrix
    check, df_only_prob= f.filter_prob(df_problems_solved,target_users)

    id2profile = dict((int(v), str(k)) for k, v in profile2id.items())
    id2item = dict((int(v), str(k)) for k, v in show2id.items())

    df_only_prob.handle = df_only_prob.handle.apply(lambda x:id2profile[x])
    df_only_prob.problems = df_only_prob.problems.apply(lambda x:id2item[x])
    df_rec_rival_problems = df_only_prob.copy()

    # 적용 시작
    print("적용 시작")
    x = df_users_with_solved_tags.copy()    
    x["sum"] = x[scaling_cols].sum(axis=1)
    x_new = x.loc[:,"data_structures":"dp"].div(x["sum"], axis=0)
    x_new['handle'] = x['handle']
    x_new['level'] = x['level']

    candi_problems_try = df_new_problems[df_new_problems.problem_id.isin(df_rec_rival_problems.problems)]
    candi_problems_try.reset_index(inplace=True, drop=True)
    for_cos2 = candi_problems_try[cosin_using_tags]
    for_cos1 = x_new[cosin_using_tags]

    # 코사인 유사도 구하기
    print("코사인 유사도 구하기")
    x = for_cos1
    y = for_cos2
    norm_x = x / np.linalg.norm(x, axis=1, keepdims=True)
    norm_y = y / np.linalg.norm(y, axis=1, keepdims=True)
    tmp = np.matmul(norm_x, norm_y.T)

    x_new2 = x_new.reset_index(drop=False)
    x_new2 = x_new2[['index', 'handle']]

    for_filter1 = pd.merge(x_new2, df_rec_rival_problems)
    for_filter1.columns = ['index_handle', 'handle', 'problems']
    for_filter2 = candi_problems_try.reset_index(drop=False)
    for_filter2 = for_filter2[['index', 'problem_id']]
    for_filter2.columns = ['index_problem', 'problems']
    
    res_result = pd.merge(for_filter1, for_filter2, left_on='problems', right_on='problems', how='left')
    res_result = res_result.dropna()

    result = []
    print("해당 indices의 값 구하기")
    for x, y in zip(res_result.index_handle.values, res_result.index_problem.values):
        try:
            result.append(tmp.loc[x, y])
        except:
            print("Wrong: ", x, y)

    res_result['cos'] = result
    res_result = res_result.sort_values('cos', ascending=False)
    res_result = res_result.groupby('handle').head(30)
    res_result = res_result.groupby('handle').agg({'problems': lambda x: ','.join(x)})
    res_result = res_result.reset_index()

    res_result.columns = ['handle', 'rec_problems']
    res_result.index += 1  #mysql에서 auto increment를 위해 1 추가
    res_result.index.name='id'
    res_result.to_csv('/opt/ml/airflow/dags/module_models/rec_rival_pb/item_based_prog/rec_rival_pb_item_based_cf_output.csv')

    print('라이벌 기반 문제 추천 완료!')
    return res_result
    
