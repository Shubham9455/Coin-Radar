import datetime
from sqlalchemy.orm import Session
from app.db.models.alerts import Alerts
from app.api.deps.telegram import send_telegram_message


async def check_price_alerts(db: Session, symbol: str, price: float):
    alerts = (
        db.query(Alerts)
        .filter(
            Alerts.symbol == symbol,
            Alerts.is_active == True
        )
        .all()
    )

    for alert in alerts:
        triggered = False

        # Upper trigger
        if alert.upper_trigger and price >= alert.upper_trigger:
            triggered = True

        # Lower trigger
        if alert.lower_trigger and price <= alert.lower_trigger:
            triggered = True

        if triggered:
            alert.is_active = False
            alert.last_triggered = datetime.datetime.utcnow()

            db.commit()
            db.refresh(alert)

            # Send Telegram alert
            message = (
                f"🚨 *Price Alert Triggered!*\n"
                f"*{alert.symbol}* reached *{price}*\n\n"
                f"Upper trigger: {alert.upper_trigger}\n" if alert.upper_trigger and price >= alert.upper_trigger else ""
                f"Lower trigger: {alert.lower_trigger}\n" if alert.lower_trigger and price <= alert.lower_trigger else ""
                f"{'Note: ' + alert.note if alert.note else ''}"
            )
            parts = [
                "🚨 *Price Alert Triggered!*",
                f"*{alert.symbol}* reached *{price}*",
                ""
            ]

            # Add upper trigger message if crossed
            if alert.upper_trigger is not None and price >= alert.upper_trigger:
                parts.append(f"Upper trigger crossed: {alert.upper_trigger}")

            # Add lower trigger message if crossed
            if alert.lower_trigger is not None and price <= alert.lower_trigger:
                parts.append(f"Lower trigger crossed: {alert.lower_trigger}")
            # Add note if available
            if alert.note:
                parts.append(f"Note: {alert.note}")
            message = "\n".join(parts)
            if alert.user_id:
                send_telegram_message(db, alert.user_id, message)
