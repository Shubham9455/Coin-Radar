from app.core.config import get_settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import Base
from app.api.deps import auth
import app
from main import app as fastapi_app
from app.schemas import user
from fastapi.testclient import TestClient
from app.db.models.user import User


settings = get_settings()
TEST_DATABASE_URL = settings.TEST_DATABASE_URL




engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in TEST_DATABASE_URL else {})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def override_get_current_user():
    return User(
            id=1,
            email="test@test.com",
            hashed_password="fakehashedpassword",
            role="admin"
        )


def override_config():
    print("Overriding config for tests")
    db = next(override_get_db())
    user = override_get_current_user()
    # if user not present in db, add it
    existing_user = db.query(User).filter(User.id == user.id).first()
    if not existing_user:
        db.add(user)
        db.commit()
    fastapi_app.dependency_overrides[app.api.deps.auth.get_current_user] = override_get_current_user
    fastapi_app.dependency_overrides[app.db.database.get_db] = override_get_db


client = TestClient(fastapi_app)
override_config()

