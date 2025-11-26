from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, func, Index
from app.db.database import Base

class Alerts(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    symbol = Column(String(32), nullable=False, index=True)
    upper_trigger = Column(Float, nullable=True, doc="Notify when price >= upper_trigger")
    lower_trigger = Column(Float, nullable=True, doc="Notify when price <= lower_trigger")
    note = Column(String(512), nullable=True)
    source = Column(String(64), nullable=False, default="binance")
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    last_triggered = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    __table_args__ = (
        Index("idx_alerts_symbol_upper_lower", "symbol", "upper_trigger", "lower_trigger"),
    )
    def __repr__(self):
        return f"<Alert id={self.id} symbol={self.symbol} upper={self.upper_trigger} lower={self.lower_trigger} active={self.is_active}>"
