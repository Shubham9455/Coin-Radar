from pydantic_settings import BaseSettings

from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    TELEGRAM_BOT_TOKEN: str = None

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
