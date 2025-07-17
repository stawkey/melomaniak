import logging
import sys
import os
from datetime import datetime


logger = logging.getLogger("scraper_logger")

if not logger.handlers:
    logger.setLevel(logging.WARNING)

    logs_dir = "logs"
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = os.path.join(logs_dir, f"filharmonia_scraper_{timestamp}.log")

    consoleHandler = logging.StreamHandler(stream=sys.stdout)
    fileHandler = logging.FileHandler(log_file)

    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(filename)s:%(lineno)s - %(message)s"
    )

    consoleHandler.setFormatter(formatter)
    fileHandler.setFormatter(formatter)

    logger.addHandler(consoleHandler)
    logger.addHandler(fileHandler)
