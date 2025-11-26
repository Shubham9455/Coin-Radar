from pydantic import BaseModel, Field, model_validator
from typing import Optional
from datetime import datetime

class SourceEnum(str):
    binance = "binance"
    # coingecko = "coingecko"
    # coinmarketcap = "coinmarketcap"

class AlertBase(BaseModel):
    symbol: str = Field(..., example="BTC")
    upper_trigger: Optional[float] = Field(None, gt=0, example=100000)
    lower_trigger: Optional[float] = Field(None, gt=0, example=90000)
    note: Optional[str] = Field(None, example="Alert when BTC moves")
    source: str = Field(..., example="binance")
    is_active: bool = True

    @model_validator(mode="after")
    def validate_triggers(self):
        upper = self.upper_trigger
        lower = self.lower_trigger

        if upper is None and lower is None:
            raise ValueError("At least one of upper_trigger or lower_trigger must be provided")

        if upper is not None and lower is not None:
            if upper <= lower:
                raise ValueError("upper_trigger must be greater than lower_trigger")
        return self

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    upper_trigger: Optional[float] = Field(None, gt=0)
    lower_trigger: Optional[float] = Field(None, gt=0)
    note: Optional[str] = None
    source: Optional[str] = None
    is_active: Optional[bool] = None

    @model_validator(mode="after")
    def validate_partial(self):
        upper = self.upper_trigger
        lower = self.lower_trigger
        if upper is not None and lower is not None:
            if upper <= lower:
                raise ValueError("upper_trigger must be greater than lower_trigger")
        return self

class AlertOut(AlertBase):
    id: int
    user_id: int
    created_at: datetime
    last_triggered: Optional[datetime] = None
    model_config = {"from_attributes": True}
