import numpy as np
from .recvae.main import recvae_infer
from .recvae.config import *
import os

def check_main_pb(db):
    # 저장된 결과 불러 오기
    # 비교 후 베스트 모델 선정
    # 베스트 모델 기반 inference 진행
    # best model 기반 아웃풋 반환하기
    pro_dir = os.path.join(args.dataset, 'pro_sg')
    recvae_result = np.loadtxt(pro_dir+'/recvae_result.txt', dtype=float)
    print(recvae_result)
    best_score = -1
    if best_score < recvae_result:
        output = recvae_infer(db)
        return output
    