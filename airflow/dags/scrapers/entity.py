from datetime import datetime
from enum import unique
from sqlalchemy import Boolean, Column, ForeignKey, Integer, BigInteger, String, DateTime, Float
from .database import Base

class Problems(Base):
    __tablename__ = "problems"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    problem_id = Column(Integer, unique=True, index=True)
    title = Column(String(4294000000), unique=False, index=False, nullable=True)
    tags = Column(String(4294000000), unique=False, index=False, nullable=True)
    is_solvable = Column(Boolean, unique=False, index=False)
    accepted_user_count = Column(Integer, unique=False, index=False)
    level = Column(Integer, unique=False, index=False)
    average_tries = Column(Integer, unique=False, index=False)


    def __repr__(self):
        return f"problems('{self.id}', {self.problem_id}', '{self.title}', '{self.tags}'," \
               f"'{self.is_solvable}', '{self.accepted_user_count}', '{self.level}', '{self.average_tries}')"


class ProblemsSolved(Base):
    __tablename__ = "problems_solved"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    handle = Column(String(255), unique=True, index=True)
    problems = Column(String(4294000000), unique=False, index=False, nullable=True)

    def __repr__(self):
        return f"problems_solved('{self.id}', {self.handle}', '{self.problems}')"


class RecordsSolved(Base):
    __tablename__ = "records_solved"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    handle = Column(String(255), unique=True, index=True)
    problem = Column(Integer, unique=False, index=False)
    timestamp = Column(DateTime, unique=False, index=False)

    def __repr__(self):
        return f"records_solved('{self.id}', {self.handle}', '{self.problem}', '{self.timestamp}')"


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    handle = Column(String(255), unique=True, index=True)
    solved_count = Column(Integer, unique=False, index=False)
    user_class = Column(Integer, unique=False, index=False)
    tier = Column(Integer, unique=False, index=False)
    rating = Column(Integer, unique=False, index=False)
    rating_by_problems_sum = Column(Integer, unique=False, index=False)
    rating_by_class = Column(Integer, unique=False, index=False)
    rating_by_solved_count = Column(Integer, unique=False, index=False)
    exp = Column(BigInteger, unique=False, index=False)
    rival_count = Column(Integer, unique=False, index=False)
    reverse_rival_count = Column(Integer, unique=False, index=False)
    max_streak = Column(Integer, unique=False, index=False)
    rank = Column(Integer, unique=False, index=False)
    organization = Column(String(4294000000), unique=False, index=False, nullable=True)

    def __repr__(self):
        return f"users('{self.id}', {self.handle}', '{self.solved_count}', '{self.user_class}'," \
               f"'{self.tier}', '{self.rating}', '{self.rating_by_problems_sum}'" \
               f"'{self.rating_by_class}', '{self.rating_by_solved_count}', '{self.exp}'," \
               f"'{self.rival_count}', '{self.reverse_rival_count}', '{self.max_streak}'," \
               f"'{self.rank}', '{self.organization}')"


# problems_class scrapper
class ProblemsClass(Base):
    __tablename__ = "problems_class"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    problem_id = Column(Integer, unique=True, index=True)
    title = Column(String(4294000000), unique=False, index=False, nullable=True)
    accepted_user_count = Column(Integer, unique=False, index=False, nullable=True)
    average_tries = Column(Float, unique=False, index=False, nullable=True)
    class_n = Column(Integer, unique=False, index=False, nullable=True)


    def __repr__(self):
        return f"problems_class('{self.id}', '{self.problem_id}', '{self.title}', '{self.accpeted_user_count}', '{self.average_tries}', '{self.class_n}')"
