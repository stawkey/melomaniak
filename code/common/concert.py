from abc import ABC, abstractmethod
from typing import Optional
from utils.logging_config import logger
from bs4 import BeautifulSoup
import requests
from utils.config import *


class Concert(ABC):
    def __init__(self):
        self.date = None
        self.title = None
        self.concert_type = None
        self.programme = None
        self.composers = None
        self.venue = None
        self.source = None
        self.details_link = None
        self.details_soup = None

    def extract_concert_data(self, details_link) -> Optional["Concert"]:
        logger.info("Starting data extraction for: %s", details_link)
        self.details_link = details_link
        try:
            if hasattr(self, "_fetch_from_api"):
                self._fetch_from_api()

            self._fetch_concert_details()
            self._extract_date()
            self._extract_title()
            self._extract_concert_type()
            self._extract_programme()
            self._extract_composers()
            self._extract_venue()
            self._extract_source()
            logger.info("Successfully finished data extraction for: %s", details_link)
            return self
        except Exception as e:
            logger.error("Error extracting concert data: %s", e)
            return None

    def _fetch_concert_details(self):
        try:
            details_response = requests.get(
                url=self.details_link, headers=headers, timeout=10
            )
            details_response.raise_for_status()
            self.details_soup = BeautifulSoup(details_response.text, "lxml")
        except requests.exceptions.RequestException as e:
            logger.error("Error getting concert details: %s", e)
            raise

    @abstractmethod
    def _extract_date(self):
        pass

    @abstractmethod
    def _extract_title(self):
        pass

    @abstractmethod
    def _extract_concert_type(self):
        pass

    @abstractmethod
    def _extract_composers(self):
        pass

    @abstractmethod
    def _extract_programme(self):
        pass

    @abstractmethod
    def _extract_venue(self):
        pass

    @abstractmethod
    def _extract_source(self):
        pass
