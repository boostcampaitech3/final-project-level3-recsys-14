from datetime import datetime
from enum import unique
from sqlalchemy import Boolean, Column, ForeignKey, Integer, BigInteger, String, DateTime, Float
from database import Base

# recommend_general_problems table
class RecommendGeneralProblems(Base):
    __tablename__ = "recommend_general_problems"

    id = Column(Integer)
    handle = Column(String(255), primary_key=True)
    rec_problems = Column(String(4294000000), unique=False, index=False, nullable=True)

    def __repr__(self):
        return f"recommend_general_problems('{self.id}', '{self.handle}', '{self.rec_problems}')"


# recommend_rivals table
class RecommendRivals(Base):
    __tablename__ = "recommend_rivals"

    id = Column(Integer)
    handle = Column(String(255), primary_key=True)
    rec_rivals = Column(String(4294000000), unique=False, nullable=True)

    def __repr__(self):
        return f"recommend_rivals('{self.id}', '{self.handle}', '{self.rec_rivals}')"


# recommend_rivals_problems
class RecommendRivalsProblems(Base):
    __tablename__ = "recommend_rivals_problems"

    id = Column(Integer)
    handle = Column(String(255), primary_key=True)
    rec_problems = Column(String(4294000000), unique=False, index=False, nullable=True)

    def __repr__(self):
        return f"recommend_rivals('{self.id}', '{self.handle}', '{self.rec_problems}')"


# problems_class scrapper
class ProblemsClass(Base):
    __tablename__ = "problems_class"

    id = Column(Integer)
    problem_id = Column(Integer, primary_key=True)
    title = Column(String(4294000000), unique=False, index=False, nullable=True)
    accepted_user_count = Column(Integer, unique=False, index=False, nullable=True)
    average_tries = Column(Float, unique=False, index=False, nullable=True)
    class_n = Column(Integer, unique=False, index=False, nullable=True)


    def __repr__(self):
        return f"problems_class('{self.id}', '{self.problem_id}', '{self.title}', '{self.accpeted_user_count}', '{self.average_tries}', '{self.class_n}')"
