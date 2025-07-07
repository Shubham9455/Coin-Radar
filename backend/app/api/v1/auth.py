from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import httpx
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut, Token
from app.db.models.user import User
from app.db.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.api.deps.auth import get_current_user
from app.core.config import get_settings
from app.api.deps.telegram import send_telegram_message


settings = get_settings()

router = APIRouter(prefix="/auth", tags=["auth"])




@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token_data = {"sub": user.email}
    return {
        "access_token": create_access_token(token_data),
        "token_type": "bearer"
    }




@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/link-telegram")
async def link_telegram(code: str,  db : Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.telegram_chat_id:
        raise HTTPException(status_code=400, detail="Telegram account already linked")
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/getUpdates"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to connect to Telegram API")
    updates = response.json().get("result", [])
    matched_chat_id = None
    for update in updates:
        message = update.get("message")
        if not message:
            continue
        text = message.get("text", "").strip()
        if text == code:
            matched_chat_id = message["chat"]["id"]
            break

    if not matched_chat_id:
        raise HTTPException(status_code=404, detail="Code not found in bot messages")

    # Step 3: Save telegram_chat_id in user model
    current_user.telegram_chat_id = str(matched_chat_id)
    db.commit()
    send_telegram_message(matched_chat_id, f"Hi {current_user.email}, your Telegram account has been linked successfully!")
    return {"message": "Telegram linked successfully"}