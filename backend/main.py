from fastapi import FastAPI
from app.db.database import Base, engine
from app.api.v1 import auth
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Coin Radar Backend!"}