# 📈 Coin Radar — Crypto Price Alert & Notification System

Coin Radar is a FastAPI-based backend with a React frontend for tracking cryptocurrency prices, setting alerts, and getting notified via Telegram. Users can register/login, set price conditions (above/below/between), and link their Telegram for real-time alerts.


## 🚀 Features

- User Authentication (JWT-based)
- Telegram notifications
- Price Alerts (Upcoming)
- News Alerts (Upcoming)
- Coin live stats from sources like CoinGecko, CoinMarketCap, Binance (Upcoming)
- FastAPI backend with PostgreSQL
- React frontend with modern UI (shadcn/ui)


## 🛠 Tech Stack

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, JWT, Celery 
- **Frontend:** React, Tailwind CSS, Axios, shad-cn
- **Notifications:** Telegram Bot API
- **Others:** dotenv for config, Pydantic for schema validation









## ⚙️ Getting Started

### Backend Setup

1. **Clone Repo & Create Virtualenv**
   ```bash
   git clone https://github.com/yourusername/coin-radar.git
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt

2. **Environment Variables**
   Create a `.env` file:

   ```
   DATABASE_URL=postgresql://user:password@localhost/dbname
   SECRET_KEY=your_secret
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ```

5. **Start Server**

   ```bash
   uvicorn app.main:app --reload --port 9999
   ```

### Frontend Setup

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Start Dev Server**

   ```bash
   npm run dev
   ```

---

## 📬 Linking Telegram

1. Open the bot in Telegram: [t.me/YOUR\_BOT\_USERNAME](https://t.me/YOUR_BOT_USERNAME)
2. On frontend, go to **Telegram Connect**
3. Copy the code and send it to the bot
4. Click “I’ve sent the code” to link your Telegram

---

## 🔐 Auth Flow

* Register → Login → Get JWT token
* Frontend saves token in `localStorage`
* Token is sent in `Authorization: Bearer <token>` for secure API access

---

## 📅 Coming Soon

* Real-time price updates via WebSocket
* Advanced Telegram commands
* Alert history and logs

---


