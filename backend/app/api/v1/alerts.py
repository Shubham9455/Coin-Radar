from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.alerts import Alerts
from app.schemas.alerts import AlertCreate, AlertUpdate, AlertOut
from app.api.deps import get_current_user
from app.db.models.user import User


router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("/", response_model=AlertOut, status_code=status.HTTP_201_CREATED)
def create_alert(alert_in: AlertCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_alert = Alerts(
        user_id=current_user.id,
        symbol=alert_in.symbol,
        upper_trigger=alert_in.upper_trigger,
        lower_trigger=alert_in.lower_trigger,
        note=alert_in.note,
        current_condition=alert_in.current_condition,
        source=alert_in.source,
        is_active=alert_in.is_active
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

@router.get("/", response_model=list[AlertOut])
def get_my_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Alerts).filter(Alerts.user_id == current_user.id).order_by(Alerts.created_at.desc()).all()


@router.get("/{alert_id}", response_model=AlertOut)
def get_alert(alert_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    alert = db.query(Alerts).filter(Alerts.id == alert_id, Alerts.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert




@router.put("/{alert_id}", response_model=AlertOut)
def update_alert(alert_id: int, alert_in: AlertUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    alert = db.query(Alerts).filter(Alerts.id == alert_id, Alerts.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    for field, value in alert_in.model_dump(exclude_unset=True).items():
        setattr(alert, field, value)

    db.commit()
    db.refresh(alert)
    return alert



@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(alert_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    alert = db.query(Alerts).filter(Alerts.id == alert_id, Alerts.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    db.delete(alert)
    db.commit()
    return {"detail": "Alert deleted successfully"}