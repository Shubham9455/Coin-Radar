from pydantic import BaseModel, EmailStr
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str



# For user registration input
class UserCreate(BaseModel):
    email: EmailStr
    password: str


# For user login input
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# For outputting user info safely (no password)
class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True
