from enum import Enum
from pydantic import BaseModel, Field, model_validator, root_validator
from datetime import datetime

class ConditionEnum(str, Enum):
    above = "above"
    below = "below"
    between = "between"

class SourceEnum(str, Enum):
    binance = "binance"
    coingecko = "coingecko"
    coinmarketcap = "coinmarketcap"



# Base schema (shared fields)
class AlertBase(BaseModel):
    symbol: str = Field(..., example="BTC")
    upper_trigger: float | None = Field(None, gt=0, example=100000)
    lower_trigger: float | None = Field(None, gt=0, example=90000)
    note: str | None = Field(None, example="Watch for CPI breakout")
    current_condition: ConditionEnum = Field(..., example="above")
    source: SourceEnum = Field(..., example="binance")
    is_active: bool | None = True


    @model_validator(mode="before")
    @classmethod
    def validate_trigger_bounds(cls, values):
        upper = values.get("upper_trigger")
        lower = values.get("lower_trigger")
        if upper is not None and lower is not None:
            if upper <= lower:
                raise ValueError("upper_trigger must be greater than lower_trigger")
        return values

# Schema for creating a new alert
class AlertCreate(AlertBase):
    pass


# Schema for updating an existing alert
class AlertUpdate(AlertBase):
    is_active: bool | None


# Schema for returning alert data to client
class AlertOut(AlertBase):
    id: int
    user_id: int
    created_at: datetime
    last_triggered: datetime | None = None

    class Config:
        orm_mode = True
