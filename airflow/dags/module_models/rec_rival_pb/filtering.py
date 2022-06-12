import random
import pandas as pd
from scipy import sparse
import numpy as np

import warnings
warnings.filterwarnings("ignore")

class filter:
    def __init__(self,lst_rivals, profile2id, show2id):
        self.lst_rivals= lst_rivals
        self.profile2id= profile2id
        self.show2id= show2id

    def numerize_for_profile(self,x):
        return self.profile2id[x]

    def numerize_for_problem(self,x):
        return self.show2id[x]

    def extract_prob(self,x):
        target=set(x['target_prob'].split(','))
        rival= set(x['rival_prob'].split(','))
        result= rival - target
        if len(result) ==0:
            result= set(self.show2id.keys()) - target
            return random.sample(result, 1) #replace idx에 들어가도록
        return list(result)

    def filter_prob(self,df_problems_solved,target_users):
        tmp= self.lst_rivals.apply(lambda x: x.split(','))
        tmp= pd.DataFrame(tmp)
        tmp= list(tmp.rec_rivals)
        #라이벌 핸들 수치화
        tmp= pd.DataFrame(tmp)
        tmp[0]= tmp[0].apply(self.numerize_for_profile)
        tmp[1]= tmp[1].apply(self.numerize_for_profile)
        tmp[2]= tmp[2].apply(self.numerize_for_profile)
        tmp[3]= tmp[3].apply(self.numerize_for_profile)
        tmp[4]= tmp[4].apply(self.numerize_for_profile)
        # 리스트 값으로 들어가도록 변환
        tmp= pd.DataFrame(tmp[[0,1,2,3,4]].apply(lambda row: list(row), axis=1))
        # 라이벌이 푼 문제들을 전부 합침
        rival_prob= tmp[0].apply(lambda x: ','.join(df_problems_solved.iloc[x]['problems']))
        only_prob= pd.DataFrame({'rival_prob':rival_prob})
        target_users= pd.DataFrame(target_users)
        target_users['handle']= target_users['handle'].apply(self.numerize_for_profile)
        target_prob=pd.DataFrame({'target_prob':df_problems_solved.iloc[target_users['handle']]['problems']})
        only_prob= pd.concat([target_prob, only_prob], axis=1)

        # 30s
        only_prob.dropna(inplace=True)
        only_prob= only_prob.apply(self.extract_prob, axis=1)
        only_prob= pd.DataFrame({'problems':only_prob,'handle':target_users['handle']})
        
        only_prob= only_prob.explode('problems').reset_index(drop=True)
        only_prob.dropna(inplace=True)
        only_prob['problems']= only_prob['problems'].astype('int')
        # problems numerize
        only_prob['problems']= only_prob['problems'].apply(self.numerize_for_problem)

        n_items= len(self.show2id)
        n_users= len(self.profile2id)

        rows, cols = only_prob['handle'], only_prob['problems']
        data = sparse.csr_matrix((np.ones_like(rows),
                                        (rows, cols)), dtype='float16',
                                        shape=(n_users, n_items))

        return data, only_prob