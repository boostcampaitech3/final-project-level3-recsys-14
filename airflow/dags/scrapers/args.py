import argparse

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--target_data", default='problem', type=str, help="target data")
    parser.add_argument("--time_interval", default=20, type=int, help="time interval")

    args = parser.parse_args()
    return args