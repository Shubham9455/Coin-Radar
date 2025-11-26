import asyncio
import json
import websockets
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.alert import check_price_alerts
from app.utils.logger import price_logger

BINANCE_WS = "wss://fstream.binance.com/ws/btcusdt@ticker"

async def coindata_stream_worker():
    while True:
        try:
            async with websockets.connect(
                BINANCE_WS,
                ping_interval=None,     # We'll handle ping manually
                ping_timeout=None
            ) as ws:

                price_logger.info("Connected to Binance WebSocket")

                db: Session = SessionLocal()

                while True:
                    message = await ws.recv()
                    price_logger.info(message)

                    data = json.loads(message)
                    # Futures/Ticker price => 'c' (last price)
                    price = float(data.get("c"))
                    await check_price_alerts(db, 'BTC',price)

        except Exception as e:
            price_logger.error(f"WebSocket error: {e}")
            await asyncio.sleep(3)