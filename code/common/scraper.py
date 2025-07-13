from abc import ABC, abstractmethod
from typing import List
from .concert import Concert
from ..utils.logging_config import logger
from random import SystemRandom
import time
from ..utils.db_utils import check_if_concert_exists


class Scraper(ABC):
    def scrape(self):
        cryptogen = SystemRandom()
        concerts_html = self._get_individual_concerts_html()
        n = 0
        for _ in concerts_html:
            n += 1
        logger.info("Found %d concerts", n)

        for i, concert_html in enumerate(concerts_html, 1):
            logger.info("Processing concert %d/%d", i, n)
            details_link = self._get_details_link(concert_html)

            if details_link and not check_if_concert_exists(details_link):
                concert = self._create_concert()
                concert_data = concert.extract_concert_data(details_link)
                if concert_data:
                    yield concert_data
            time.sleep(cryptogen.uniform(0.5, 2))

    @abstractmethod
    def _create_concert(self) -> Concert:
        pass

    @abstractmethod
    def _get_individual_concerts_html(self) -> List:
        pass

    @abstractmethod
    def _get_details_link(self, concert_html) -> str:
        pass
