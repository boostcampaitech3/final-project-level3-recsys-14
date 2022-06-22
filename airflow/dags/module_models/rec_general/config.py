# ====================================================
# CFG
# ====================================================
class args:
    dataset = '/home/recognizer14/airflow/dags/module_models/rec_general'
    hidden_dim = 600
    latent_dim = 200
    batch_size = 500
    beta = None
    gamma = 0.005
    lr = 5e-4
    n_epochs = 10
    n_enc_epochs = 3
    n_dec_epochs = 1
    not_alternating = False
    data = 'data/train/'
    cuda = False
    seed = 1111
    early_stopping = 5
    infer_cnt = 20
    save = 'model.pt'
    total_anneal_steps = 200000
    anneal_cap = 0.2
    log_dir = './logs'
    wd = 0.00
    log_interval = 100
    save_dir = '/home/recognizer14/airflow/dags/module_models/rec_general/best_models'