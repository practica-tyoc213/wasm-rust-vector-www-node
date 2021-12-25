from sqlalchemy.orm import Session



from . import models, schemas




def get_user(db: Session, user_id: int):

    return db.query(models.User).filter(models.User.id == user_id).first()




def get_user_by_email(db: Session, email: str):

    return db.query(models.User).filter(models.User.email == email).first()




def get_users(db: Session, skip: int = 0, limit: int = 100):

    return db.query(models.User).offset(skip).limit(limit).all()



def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_vector_item(db: Session, item: schemas.Vector2DModelBaseCreate, user_id: int):
    db_item = models.Vector2DModel(**item.dict(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_vector(db: Session, user_id: int, id: int):
    r = db.query(models.Vector2DModel).filter(models.Vector2DModel.owner_id == user_id, models.Vector2DModel.id == id).first()
    return r

def get_vectors(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    r = db.query(models.Vector2DModel).filter(models.Vector2DModel.owner_id == user_id).offset(skip).limit(limit).all()
    print("{r}")
    return r

def update_vector(db: Session, item: schemas.Vector2D):
    db_vector = db.query(models.Vector2DModel).get(item.id)
    db_vector.x = item.x
    db_vector.y = item.y
    db.add(db_vector)
    db.commit()
    db.refresh(db_vector)
    return db_vector