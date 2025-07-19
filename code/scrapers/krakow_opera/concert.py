from common.concert import Concert
from utils.logging_config import logger
from datetime import datetime
from typing import Dict, Any


class KrakowOperaConcert(Concert):
    def __init__(self, api_data: Dict[str, Any]):
        super().__init__()
        self.api_data = api_data
        self.performance_data = api_data.get("0", {})

    def extract_concert_data(self, details_link=None):
        try:
            self.details_link = "https://opera.krakow.pl/repertuar"

            self._extract_date()
            self._extract_title()
            self._extract_concert_type()
            self._extract_programme()
            self._extract_composers()
            self._extract_venue()
            self._extract_source()

            return self

        except Exception as e:
            logger.error(f"Error extracting concert data from API: {e}")
            raise

    def _extract_date(self):
        try:
            date_data = self.performance_data.get("date", {})
            time_data = self.performance_data.get("time", {})

            date_str = date_data["date"]
            date_obj = datetime.strptime(date_str.split(".")[0], "%Y-%m-%d %H:%M:%S")

            time_str = time_data["date"]
            time_obj = datetime.strptime(time_str.split(".")[0], "%Y-%m-%d %H:%M:%S")
            time_part = time_obj.time()

            combined_datetime = datetime.combine(date_obj.date(), time_part)
            self.date = combined_datetime.strftime("%d-%m-%Y %H:%M")

        except Exception as e:
            logger.warning(f"Error parsing date/time from API data: {e}")

    def _extract_title(self):
        self.title = self.api_data.get("title", "Unknown Title")

    def _extract_concert_type(self):
        self.concert_type = self.api_data.get("type", "Unknown")

    def _extract_programme(self):
        self.programme = []

        title = self.api_data.get("title", "")
        composer = self.api_data.get("composer", "")

        if title and composer:
            self.programme.append(f"{composer} - {title}")
        elif title:
            self.programme.append(title)

    def _extract_composers(self):
        composer = self.api_data.get("composer", "")
        self.composers = [composer] if composer else []

    def _extract_venue(self):
        self.venue = self.api_data.get("place", "Opera Krakowska")

    def _extract_source(self):
        self.source = "Opera Krakowska"
