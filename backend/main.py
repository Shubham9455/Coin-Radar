import asyncio
from fastapi import FastAPI
from app.db.database import Base, engine
from app.api.v1 import auth, alerts
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.deps.telegram import send_telegram_message
from app.worker.coindata import coindata_stream_worker




@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start WebSocket worker
    worker_task = asyncio.create_task(coindata_stream_worker())
    print("Price worker started.")
    yield  # App runs here
    worker_task.cancel()
    print("Price worker stopped.")


app = FastAPI(lifespan=lifespan)
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





@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/")
def read_root():
    # send_telegram_message("Coin Radar Backend is up and running!", chat_id="1060668181")
    return {"message": "Welcome to Coin Radar Backend!"}