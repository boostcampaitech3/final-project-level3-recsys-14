#참고: https://cotak.tistory.com/25
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
import json
import pymysql

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SECRET_FILE = os.path.join(BASE_DIR, 'secrets.json')
secrets = json.loads(open(SECRET_FILE).read())

DB = secrets['DB']
DB_read = secrets['DB_read']

#DB_URl = f"mysql+pymysql://{DB['user']}:{DB['password']}@{DB['host']}:{DB['port']}/{DB['database']}"
#engine = create_engine(DB_URl, encoding='utf-8')

#db = pymysql.connect(host = DB['host'],
#                     port = DB['port'],
#                     user = DB['user'],
#                     password = DB['password'],
#                     db = DB['database'])

#session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
