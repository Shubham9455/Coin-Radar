from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import Base
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    telegram_chat_id = Column(String(255), nullable=True)
    role = Column(String(255), nullable=True, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    phone_number = Column(String(15), unique=True, index=True, nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"




