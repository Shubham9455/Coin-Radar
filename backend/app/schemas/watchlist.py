from pydantic import BaseModel
from datetime import datetime





class WatchListCreate(BaseModel):
    user_id: int
    symbol: str
    note: str | None = None


class WatchListUpdate(BaseModel):
    symbol: str | None = None
    note: str | None = None


class WatchListInDBBase(WatchListCreate):
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        orm_mode = True


class WatchList(WatchListInDBBase):
    pass