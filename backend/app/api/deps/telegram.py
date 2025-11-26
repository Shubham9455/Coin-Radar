import httpx
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.core.config import get_settings

settings = get_settings()
TELEGRAM_BOT_TOKEN = settings.TELEGRAM_BOT_TOKEN
BASE_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


def send_telegram_message(db: Session, user_id: int, message: str):
    """
    Send Telegram alert to the user by automatically finding their chat_id.
    """
    # 1️⃣ Fetch user from DB
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("User not found.")

    if not user.telegram_chat_id:
        raise Exception("User has not linked Telegram.")

    chat_id = user.telegram_chat_id

    # 2️⃣ Send Telegram message
    url = f"{BASE_URL}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }

    response = httpx.post(url, data=payload)

    if response.status_code != 200:
        raise Exception(f"Telegram error: {response.text}")

    return "Message sent successfully"
