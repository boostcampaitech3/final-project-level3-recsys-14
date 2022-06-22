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
import torch


def first_division(num):
    for i in range(2, num+1):
        if num % i == 0:
            return i
    return 1


def main_bpr(db):
    seed = 0

#    df_problems_solved, df_problems_class, df_rec_rivals = load_data(db)
    df_problems_solved, df_problems_class, df_rec_rivals, df_problems= load_data(db)
    print('데이터 로드 완료!')
    lst_rivals= df_rec_rivals['rec_rivals']
    target_users= df_rec_rivals['handle']
    
#    data, profile2id, show2id= preprocess_rival_prob(df_problems_solved)
    data, profile2id, show2id, df_user_problems= preprocess_rival_prob(df_problems_solved)

    with open('/home/recognizer14/airflow/dags/module_models/rec_rival_pb/bpr_prog/show2id.pkl','wb') as f:
        pickle.dump(show2id,f)
    with open('/home/recognizer14/airflow/dags/module_models/rec_rival_pb/bpr_prog/profile2id.pkl','wb') as f:
        pickle.dump(profile2id,f)

    print('데이터 전처리 완료!')
    f= filter(lst_rivals,profile2id, show2id) # 라이벌은 풀고 타겟유저는 안푼 문제에 대한 csr matrix
    check, df_only_prob= f.filter_prob(df_problems_solved,target_users)    

    # 모델링
    device= torch.device("cuda" if torch.cuda.is_available() else "cpu")
    if torch.cuda.is_available():
        use_gpu_value = True
    else:
        use_gpu_value = False
    #device = "cpu"
    #use_gpu_value = False
    print('DEVICE: ', device)
    print("use_gpu_value: ", use_gpu_value)
    
    model = implicit.bpr.BayesianPersonalizedRanking(factors=50, learning_rate=0.01,
                            regularization=0, iterations=100, use_gpu=use_gpu_value)
    model.fit(data)

    if torch.cuda.is_available():
        predict= np.matmul(model.user_factors.to_numpy(), model.item_factors.to_numpy().T)
    else:
        predict= np.matmul(model.user_factors, model.item_factors.T)
        
    print('모델 학습 완료!')
    filter_prob= predict* check.astype(np.float32).toarray()
    
    # 30개 보다 적은 문제들을 가진 인덱스
    replace_idx= np.where(np.sum(check,axis=1)<30)[0]
    df_low= df_only_prob[df_only_prob.handle.isin(replace_idx)].groupby('handle').agg(list)

    # 0인 값들은 모두 최솟값으로 변환
    filter_prob[filter_prob==0]= filter_prob.min()-1
    print('유저에게 적합한 문제 추출 중...')

    divisor = first_division(len(filter_prob))
    print('갯수:', len(filter_prob))
    print('divisor:', divisor)

    i=0
    for batch in np.split(filter_prob, divisor, axis=0):
        if i==0:
            index_result= bn.argpartition(-batch, 30, axis=1)[:, :30]
        else:
            index_result= np.concatenate((index_result,bn.argpartition(-batch, 30, axis=1)[:, :30]),axis=0) 
        i+=1

    id2item = dict((int(v), str(k)) for k, v in show2id.items())
    lst_probs= [','.join(list(map(lambda x: id2item[x],idx))) for idx in index_result]

    df_low.problems= df_low.problems.apply(lambda x: list(map(lambda x: id2item[x],x)))

    for idx in replace_idx:
        lst= df_low.loc[idx].values[0]
        if len(lst)==1:
            lst_probs[idx]= ''
        lst_probs[idx]= ','.join(df_low.loc[idx].values[0])
    print('문제 추출 완료!')
    
    #id2profile = dict((int(v), str(k)) for k, v in profile2id.items())
    #udf = pd.DataFrame(df_only_prob.handle.unique(), columns=['id'])
    #out = [udf['id'].apply(lambda x: id2profile[x])]
    #target_user = out[0].values
    
    output = pd.DataFrame(target_users, columns=['handle'])
    output['rec_problems'] = lst_probs
    output.index += 1  #mysql에서 auto increment를 위해 1 추가
    output.index.name='id'

    print('라이벌 기반 문제 추천 완료!')
    output.to_csv('/home/recognizer14/airflow/dags/module_models/rec_rival_pb/bpr_prog/rec_rival_pb_bpr_output.csv')

    return output
    
