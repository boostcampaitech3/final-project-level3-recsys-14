from sqlalchemy.orm import Session
from entity import RecommendGeneralProblems, RecommendRivals, RecommendRivalsProblems


# recommend_general_problems table
def get_rec_general_problems_by_handle(db: Session, handle: str):
    return db.query(RecommendGeneralProblems).filter(RecommendGeneralProblems.handle == handle).first()

def update_rec_general_problems(db:Session, rec_general_problems:RecommendGeneralProblems):
    db.query(RecommendGeneralProblems).filter(RecommendGeneralProblems.handle == rec_general_problems.handle).update({
        column: getattr(rec_general_problems, column) for column in RecommendGeneralProblems.__table__.columns.keys()
    })
    db.commit()

def insert_rec_general_problems(db:Session, rec_general_problems:RecommendGeneralProblems):
    db.merge(rec_general_problems)
    db.commit()

def delete_rec_general_problems(db:Session, handle: str):
    rec_general_problems = db.query(RecommendGeneralProblems).filter(RecommendGeneralProblems.handle == handle).first()
    db.delete(rec_general_problems)
    db.commit()


# recommend_rivals table
def get_rec_rivals_by_handle(db: Session, handle: str):
    return db.query(RecommendRivals).filter(RecommendRivals.handle == handle).first()

def update_rec_rivals(db:Session, rec_rivals:RecommendRivals):
    db.query(RecommendRivals).filter(RecommendRivals.handle == rec_rivals.handle).update({
        column: getattr(rec_rivals, column) for column in RecommendRivals.__table__.columns.keys()
    })
    db.commit()

def insert_rec_rivals(db:Session, rec_rivals:RecommendRivals):
    #기존: db.add였는데 dupilcated pk 에러가 있어서 merge로 바꿈. (https://stackoverflow.com/questions/10322514/dealing-with-duplicate-primary-keys-on-insert-in-sqlalchemy-declarative-style)
    db.merge(rec_rivals)
    db.commit()

def delete_rec_rivals(db:Session, handle: str):
    rec_rivals = db.query(RecommendRivals).filter(RecommendRivals.handle == handle).first()
    db.delete(rec_rivals)
    db.commit()


# recommend_rivals_problems
def get_rec_rivals_problems_by_handle(db: Session, handle: str):
    return db.query(RecommendRivalsProblems).filter(RecommendRivalsProblems.handle == handle).first()

def update_rec_rivals_problems(db:Session, rec_rivals_problems:RecommendRivalsProblems):
    db.query(RecommendRivalsProblems).filter(RecommendRivalsProblems.handle == rec_rivals_problems.handle).update({
        column: getattr(rec_rivals_problems, column) for column in RecommendRivalsProblems.__table__.columns.keys()
    })
    db.commit()

def insert_rec_rivals_problems(db:Session, rec_rivals_problems:RecommendRivalsProblems):
    db.merge(rec_rivals_problems)
    db.commit()

def delete_rec_rivals_problems(db:Session, handle: str):
    rec_rivals_problems = db.query(RecommendRivalsProblems).filter(RecommendRivalsProblems.handle == handle).first()
    db.delete(rec_rivals_problems)
    db.commit()
