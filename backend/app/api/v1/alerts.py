from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.database import get_db
from app.db.models.alerts import Alerts
from app.schemas.alerts import AlertCreate, AlertUpdate, AlertOut
from app.api.deps.auth import get_current_user, verify_role
from app.db.models.user import User


router = APIRouter(prefix="/alerts", tags=["alerts"])


def is_alert_triggered(alert: Alerts, price: float) -> bool:
    upper = alert.upper_trigger
    lower = alert.lower_trigger

    if upper is not None and lower is not None:
        return lower <= price <= upper
    if upper is not None:
        return price >= upper
    if lower is not None:
        return price <= lower
    return False

@router.post("/", response_model=List[AlertOut], status_code=status.HTTP_201_CREATED)
def create_alerts(
    alert_in: List[AlertCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_alerts = []
    for a in alert_in:
        new_alert = Alerts(
            user_id=current_user.id,
            symbol=a.symbol.upper(),   # normalize symbol
            upper_trigger=a.upper_trigger,
            lower_trigger=a.lower_trigger,
            note=a.note,
            source=a.source,
            is_active=a.is_active
        )
        new_alerts.append(new_alert)

    db.add_all(new_alerts)
    db.commit()

    for alert in new_alerts:
        db.refresh(alert)

    return new_alerts


@router.get("/", response_model=List[AlertOut])
def get_my_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Alerts)
        .filter(Alerts.user_id == current_user.id)
        .order_by(Alerts.created_at.desc())
        .all()
    )


@router.get("/all", response_model=List[AlertOut])
def get_all_alerts(
    db: Session = Depends(get_db),
    is_admin: bool = Depends(verify_role("admin"))
):
    return (
        db.query(Alerts)
        .order_by(Alerts.created_at.desc())
        .all()
    )


@router.get("/{alert_id}", response_model=AlertOut)
def get_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = (
        db.query(Alerts)
        .filter(Alerts.id == alert_id, Alerts.user_id == current_user.id)
        .first()
    )
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert




@router.put("/{alert_id}", response_model=AlertOut)
def update_alert(
    alert_id: int,
    alert_in: AlertUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = (
        db.query(Alerts)
        .filter(Alerts.id == alert_id, Alerts.user_id == current_user.id)
        .first()
    )
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    update_data = alert_in.model_dump(exclude_unset=True)
    # normalize symbol if the user updated it (not included here by default)
    for field, value in update_data.items():
        setattr(alert, field, value)

    # If both triggers are now present on the object, ensure ordering (safety)
    if alert.upper_trigger is not None and alert.lower_trigger is not None:
        if alert.upper_trigger <= alert.lower_trigger:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="upper_trigger must be greater than lower_trigger"
            )

    db.commit()
    db.refresh(alert)
    return alert



@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = (
        db.query(Alerts)
        .filter(Alerts.id == alert_id, Alerts.user_id == current_user.id)
        .first()
    )
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    db.delete(alert)
    db.commit()
    return
