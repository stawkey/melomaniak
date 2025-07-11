from abc import ABC, abstractmethod
from typing import Optional
from ..utils.logging_config import logger


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

    def extract_concert_data(self, details_link) -> Optional["Concert"]:
        logger.info("Starting data extraction for: %s", details_link)
        self.details_link = details_link
        try:
            if hasattr(self, "_fetch_concert_details"):
                self._fetch_concert_details()

            self.extract_date()
            self.extract_title()
            self.extract_concert_type()
            self.extract_programme()
            self.extract_composers()
            self.extract_venue()
            self.extract_source()
            logger.info("Successfully finished data extraction for: %s", details_link)
            return self
        except Exception as e:
            logger.error("Error extracting concert data: %s", e)
            return None

    @abstractmethod
    def extract_date(self):
        pass

    @abstractmethod
    def extract_title(self):
        pass

    @abstractmethod
    def extract_concert_type(self):
        pass

    @abstractmethod
    def extract_composers(self):
        pass

    @abstractmethod
    def extract_programme(self):
        pass

    @abstractmethod
    def extract_venue(self):
        pass

    @abstractmethod
    def extract_source(self):
        pass
