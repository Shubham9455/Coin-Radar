from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import get_settings
settings = get_settings()

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL,connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
'''
check_same_thread is needed only for sqlite. It allows the database connection to be shared across multiple threads.
'''
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
