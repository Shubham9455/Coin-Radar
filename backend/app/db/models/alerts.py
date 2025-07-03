from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class Alerts(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    symbol = Column(String, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    note = Column(String, nullable=True)
    upper_trigger = Column(Float, nullable=True)
    lower_trigger = Column(Float, nullable=True)
    current_condition = Column(String, nullable=True)  # e.g., "above", "below", "between"
    source = Column(String, nullable=True)  # e.g., "Binance", "Coinbase"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_triggered = Column(DateTime(timezone=True), nullable=True)
