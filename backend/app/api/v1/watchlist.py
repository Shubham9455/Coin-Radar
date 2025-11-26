from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.watchlist import WatchList
from app.schemas.watchlist import WatchListCreate, WatchListUpdate, WatchListOut
from app.api.deps.auth import get_current_user
from app.db.models.user import User


router = APIRouter(prefix="/watchlist", tags=["watchlist"])


@router.post("/", response_model=WatchListOut, status_code=status.HTTP_201_CREATED)
def create_watchlist(watchlist_in: WatchListCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_watchlist = WatchList(
        user_id=current_user.id,
        symbol=watchlist_in.symbol,
        note=watchlist_in.note
    )
    db.add(new_watchlist)
    db.commit()
    db.refresh(new_watchlist)
    return new_watchlist

@router.get("/", response_model=list[WatchListOut])
def get_my_watchlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(WatchList).filter(WatchList.user_id == current_user.id).order_by(WatchList.created_at.desc()).all()

@router.get("/{watchlist_id}", response_model=WatchListOut)
def get_watchlist(watchlist_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    watchlist = db.query(WatchList).filter(WatchList.id == watchlist_id, WatchList.user_id == current_user.id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    return watchlist

@router.put("/{watchlist_id}", response_model=WatchListOut)
def update_watchlist(watchlist_id: int, watchlist_in: WatchListUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    watchlist = db.query(WatchList).filter(WatchList.id == watchlist_id, WatchList.user_id == current_user.id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    for field, value in watchlist_in.model_dump(exclude_unset=True).items():
        setattr(watchlist, field, value)

    db.commit()
    db.refresh(watchlist)
    return watchlist

@router.delete("/{watchlist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_watchlist(watchlist_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    watchlist = db.query(WatchList).filter(WatchList.id == watchlist_id, WatchList.user_id == current_user.id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    db.delete(watchlist)
    db.commit()
    return {"detail": "Watchlist deleted successfully"}