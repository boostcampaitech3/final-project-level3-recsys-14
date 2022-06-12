from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SECRET_FILE = os.path.join(BASE_DIR, 'secrets.json')
secrets = json.loads(open(SECRET_FILE).read())
DB = secrets['DB']
DB_URl = f"mysql+pymysql://{DB['user']}:{DB['password']}@{DB['host']}:{DB['port']}/{DB['database']}"  # ?charset=utf8"
engine = create_engine(DB_URl, encoding='utf-8', echo="debug")
session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

print(DB['user'])