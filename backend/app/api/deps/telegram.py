import httpx
import os
from app.core.config import get_settings
settings = get_settings()
TELEGRAM_BOT_TOKEN = settings.TELEGRAM_BOT_TOKEN



def set_chat_id():
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"
    response = httpx.get(url)
    if response.status_code != 200:
        raise Exception(f"Telegram error: {response.text}")
    data = response.json()
    return "Successfully connected to Telegram bot. You can now use the bot to send messages."








def send_telegram_message(message: str, chat_id: str = None):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }

    response = httpx.post(url, data=payload)
    if response.status_code != 200:
        raise Exception(f"Telegram error: {response.text}")
