from typing import List, Optional


from pydantic import BaseModel

class Vector2DModelBase(BaseModel):
    x: int
    y: int


class Vector2DModelBaseCreate(Vector2DModelBase):
    ...


class Vector2D(Vector2DModelBase):
    id: int
    owner_id: int
    class Config:
        orm_mode = True

class UpdateVector2D(Vector2DModelBase):
    id: int
    x: int
    y: int

class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    vectors: List[Vector2D] = []

    class Config:
        orm_mode = True
