import logging
import sys
from datetime import datetime

def setup_logging():
    logger = logging.getLogger("policypulse")
    logger.setLevel(logging.DEBUG)

    if logger.handlers:
        return logger

    detailed_formatter = logging.Formatter(
        fmt='[%(asctime)s] %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    try:
        file_handler = logging.FileHandler('app.log')
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(detailed_formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        print(f"Warning: Could not create file handler: {e}")

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.WARNING)
    console_handler.setFormatter(detailed_formatter)
    logger.addHandler(console_handler)

    return logger

logger = setup_logging()
