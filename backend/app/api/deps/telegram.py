import httpx
from app.core.config import get_settings

settings = get_settings()
TELEGRAM_BOT_TOKEN = settings.TELEGRAM_BOT_TOKEN
BASE_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


def get_updates(limit: int = 10):
    url = f"{BASE_URL}/getUpdates"
    response = httpx.get(url)
    if response.status_code != 200:
        raise Exception(f"Telegram error: {response.text}")
    return response.json().get("result", [])[-limit:]  # Return last `limit` updates


def set_chat_id_message():
    # Optional helper to verify connection
    try:
        get_updates()
        return "Successfully connected to Telegram bot. You can now use the bot to send messages."
    except Exception as e:
        return str(e)


def send_telegram_message(chat_id: str, message: str):
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
