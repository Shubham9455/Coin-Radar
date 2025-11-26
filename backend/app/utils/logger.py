# app/utils/logger.py

import logging
from logging.handlers import RotatingFileHandler
import os

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

price_logger = logging.getLogger("price_log")
price_logger.setLevel(logging.INFO)

handler = RotatingFileHandler(
    f"{LOG_DIR}/price.log",
    maxBytes=5_000_000,   # 5 MB
    backupCount=5         # keep 5 old logs
)
formatter = logging.Formatter(
    "%(asctime)s - %(message)s"
)
handler.setFormatter(formatter)

price_logger.addHandler(handler)
