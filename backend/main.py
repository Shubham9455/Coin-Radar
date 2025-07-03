from fastapi import FastAPI
from app.db.database import Base, engine
from app.api.v1 import auth

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Coin Radar Backend!"}