from .prob_eval import prob_evaluate_high
import pandas as pd

def check_main_rival_pb(db):
    print("MF-ALS----------------")
    mf_als_output = pd.read_csv('/opt/ml/airflow/dags/module_models/rec_rival_pb/mf_als_prog/rec_rival_pb_mf_als_output.csv')
    mf_als_result = prob_evaluate_high(mf_als_output['handle'], mf_als_output['rec_problems'], db)
    print(mf_als_result)
    
    print("BPR----------------")
    bpr_output = pd.read_csv('/opt/ml/airflow/dags/module_models/rec_rival_pb/bpr_prog/rec_rival_pb_bpr_output.csv')
    bpr_result = prob_evaluate_high(bpr_output['handle'], bpr_output['rec_problems'], db)
    print(bpr_result)
    
    print("Item-based-CF----------------")
    item_based_output = pd.read_csv('/opt/ml/airflow/dags/module_models/rec_rival_pb/item_based_prog/rec_rival_pb_item_based_cf_output.csv')
    item_based_result = prob_evaluate_high(item_based_output['handle'], item_based_output['rec_problems'], db)
    print(item_based_result)


    if (mf_als_result < bpr_result) and (mf_als_result < item_based_result):
        print("BEST MODEL: MF_ALS")
        return mf_als_output
    elif (bpr_result < mf_als_result) and (bpr_result < item_based_result):
        print("BEST MODEL: BPR")
        return bpr_output
    else:
        print("BEST MODEL: ITEM_BASED_CF")
        return item_based_output

