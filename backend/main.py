from fastapi import FastAPI
from app.db.database import Base, engine
from app.api.v1 import auth, alerts
from fastapi.middleware.cors import CORSMiddleware

from app.api.deps.telegram import send_telegram_message


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # production: specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(alerts.router)





@app.get("/")
def read_root():
    # send_telegram_message("Coin Radar Backend is up and running!", chat_id="1060668181")
    return {"message": "Welcome to Coin Radar Backend!"}