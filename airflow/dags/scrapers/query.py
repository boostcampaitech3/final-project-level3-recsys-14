from sqlalchemy.orm import Session
from .entity import Users, Problems, ProblemsSolved, RecordsSolved, ProblemsClass


# users table

def get_user_by_handle(db: Session, handle: str):
    return db.query(Users).filter(Users.handle == handle).first()

def update_user(db:Session, user:Users):
    db.query(Users).filter(Users.handle == user.handle).update({
        column: getattr(user, column) for column in Users.__table__.columns.keys()
    })
    db.commit()

def insert_user(db:Session, user:Users):
    db.add(user)
    db.commit()

def delete_user(db:Session, handle: str):
    user = db.query(Users).filter(Users.handle == handle).first()
    db.delete(user)
    db.commit()


# problems table

def get_problem_by_problem_id(db: Session, problem_id: int):
    return db.query(Problems).filter(Problems.problem_id == problem_id).first()

def update_problem(db:Session, problem:Problems):
    db.query(Problems).filter(Problems.problem_id == problem.problem_id).update({
        column: getattr(problem, column) for column in Problems.__table__.columns.keys()
    })
    db.commit()

def insert_problem(db:Session, problem:Problems):
    db.add(problem)
    db.commit()

def delete_problem(db:Session, problem_id: int):
    problem = db.query(Problems).filter(Problems.problem_id == problem_id).first()
    db.delete(problem)
    db.commit()

def get_all_handles(db: Session):
    return [handle[0] for handle in db.query(Users.handle).distinct()] #.limit(10).all()]추가함.


# problems_solved table

def get_problem_solved_by_handle(db: Session, handle: str):
    return db.query(ProblemsSolved).filter(ProblemsSolved.handle == handle).first()

def update_problem_solved(db:Session, problem_solved:ProblemsSolved):
    db.query(ProblemsSolved).filter(ProblemsSolved.handle == problem_solved.handle).update({
        column: getattr(problem_solved, column) for column in ProblemsSolved.__table__.columns.keys()
    })
    db.commit()

def insert_problem_solved(db:Session, problem_solved:ProblemsSolved):
    db.add(problem_solved)
    db.commit()

def delete_problem_solved(db:Session, handle:str):
    problem_solved = db.query(ProblemsSolved).filter(ProblemsSolved.handle == handle).first()
    db.delete(problem_solved)
    db.commit()


# records_solved table

def get_record_solved_by_handle(db:Session, handle:str):
    return db.query(RecordsSolved).filter(RecordsSolved.handle == handle).first()

def update_record_solved(db:Session, record_solved:RecordsSolved):
    db.query(RecordsSolved).filter(RecordsSolved.handle == record_solved.handle).update({
        column: getattr(record_solved, column) for column in RecordsSolved.__table__.columns.keys()
    })
    db.commit()

def insert_record_solved(db:Session, record_solved:RecordsSolved):
    db.add(record_solved)
    db.commit()

def delete_record_solved(db:Session, handle:str):
    record_solved = db.query(RecordsSolved).filter(RecordsSolved.handle == handle).first()
    db.delete(record_solved)
    db.commit()


# problems_class scrapper
def get_problems_class_by_problem_id(db: Session, problem_id: int):
    return db.query(ProblemsClass).filter(ProblemsClass.problem_id == problem_id).first()

def update_problems_class(db:Session, problems_class:ProblemsClass):
    db.query(ProblemsClass).filter(ProblemsClass.problem_id == problems_class.problem_id).update({
        column: getattr(problems_class, column) for column in ProblemsClass.__table__.columns.keys()
    })
    db.commit()

def insert_problems_class(db:Session, problems_class:ProblemsClass):
    db.merge(problems_class)
    db.commit()
