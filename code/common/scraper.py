from abc import ABC, abstractmethod
from typing import List
from .concert import Concert
from ..utils.logging_config import logger
from random import SystemRandom
import time
from ..utils.db_utils import check_if_concert_exists


class Scraper(ABC):
    def scrape(self) -> List[Concert]:
        cryptogen = SystemRandom()
        concert_list = []
        concerts_html = self.get_individual_concerts_html()
        n = len(concerts_html)
        logger.info("Found %d concerts", n)

        for i, concert_html in enumerate(concerts_html, 1):
            logger.info("Processing concert %d/%d", i, n)
            details_link = self.get_details_link(concert_html)

            if details_link and not check_if_concert_exists(details_link):
                concert = self.create_concert()
                concert_data = concert.extract_concert_data(details_link)
                if concert_data:
                    concert_list.append(concert_data)
            time.sleep(cryptogen.uniform(0.5, 2))

        logger.info("Returning %d new concerts", len(concert_list))
        return concert_list

    @abstractmethod
    def create_concert(self) -> Concert:
        pass

    @abstractmethod
    def get_individual_concerts_html(self) -> List:
        pass

    @abstractmethod
    def get_details_link(self, concert_html) -> str:
        pass
