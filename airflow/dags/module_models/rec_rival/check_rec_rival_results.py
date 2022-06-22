import pandas as pd
import numpy as np

from .similarity_eval2 import evaluate


def check_main_rival(db):
    print("KNN-------")
    knn_result = pd.read_csv('/home/recognizer14/airflow/dags/module_models/rec_rival/knn_prog/rec_rival_knn.csv')
    knn_diff_s_c, knn_diff_level, knn_diff_class, knn_avg = evaluate(knn_result['handle'], knn_result['rec_rivals'], db)
    
    print('knn_result_diff_solved_count ', knn_diff_s_c)
    print('knn_result_diff_level ', knn_diff_level)
    print('knn_result_diff_class ', knn_diff_class)
    print('knn_result_avg ', knn_avg)

    print("CMF-------")
    cmf_result = pd.read_csv('/home/recognizer14/airflow/dags/module_models/rec_rival/cmf_prog/rec_rival_cmf.csv')
    cmf_diff_s_c, cmf_diff_level, cmf_diff_class, cmf_avg= evaluate(cmf_result['handle'], cmf_result['rec_rivals'], db)

    print('cmf_result_diff_solved_count ', cmf_diff_s_c)
    print('cmf_result_diff_level ', cmf_diff_level)
    print('cmf_result_diff_class ', cmf_diff_class)
    print('cmf_result_avg ', cmf_avg)


    if knn_avg < cmf_avg:
        print("BEST MODEL: KNN")
        return knn_result
    else:
        print("BEST MODEL: CMF")
        return cmf_result
    return cmf_result
