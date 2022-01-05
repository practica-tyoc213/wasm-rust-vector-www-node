from typing import List

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/vectors/", response_model=schemas.Vector2D)
def create_vector_for_user(
    user_id: int, item: schemas.Vector2DModelBaseCreate, db: Session = Depends(get_db)
):
    return crud.create_vector_item(db=db, item=item, user_id=user_id)


@app.get("/users/{user_id}/vectors/", response_model=List[schemas.Vector2D])
def read_vectors(user_id:int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    vectors = crud.get_vectors(db, user_id, skip=skip, limit=limit)
    return vectors

@app.put("/users/{user_id}/vectors/", response_model=schemas.Vector2D)
def put_vector(user_id:int, vector: schemas.UpdateVector2D, db: Session = Depends(get_db)):
    db_vector = crud.get_vector(db, user_id, vector.id)
    if db_vector is None:
        raise HTTPException(status_code=400, detail="vector doesn't exist")
    vector = crud.update_vector(db, vector)
    return vector