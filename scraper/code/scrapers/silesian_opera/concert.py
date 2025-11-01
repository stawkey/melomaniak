from common.concert import Concert
from utils.logging_config import logger
from utils.html_extractor import safe_find
from utils.config import *


class SilesianOperaConcert(Concert):
    def __init__(self):
        self.concert_html = None

    def _extract_date(self):
        self.date = self.concert_html.get("data-date")

    def _extract_title(self):
        self.title = self.concert_html.get("data-title")

    def _extract_concert_type(self):
        self.concert_type = self.concert_html.get("data-concert-type")

    def _extract_programme(self):
        programme = self.concert_html.get("data-programme")

        if programme != "None":
            self.programme = [programme]
        else:
            self.programme = []

    def _extract_composers(self):
        self.composers = []
        if self.details_soup:
            composer = safe_find(
                soup=self.details_soup,
                selector=".event_author",
                error_msg="Could not find composer",
            )
            if composer:
                self.composers.append(composer)

    def _extract_venue(self):
        self.venue = self.concert_html.get("data-venue")

    def _extract_source(self):
        self.source = "Opera Śląska"
