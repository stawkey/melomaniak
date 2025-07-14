from common.scraper import Scraper
from scrapers.krakow_philharmonic.concert import KrakowPhilharmonicConcert
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from utils.logging_config import logger
from utils.html_extractor import safe_find, safe_find_attr
from utils.config import *


class KrakowPhilharmonicScraper(Scraper):
    def __init__(self):
        self.date_from = "2025-07-01"
        self.date_to = "2025-07-10"

        # date_now = datetime.today()
        # self.date_from = date_now.strftime("%Y-%m-%d")
        # self.date_to = date_now.replace(year=date_now.year + 1).strftime("%Y-%m-%d")

    def _create_concert(self):
        return KrakowPhilharmonicConcert()

    def _get_individual_concerts_html(self):
        try:
            pages = self._get_page_count()
            for p in range(1, pages + 1):
                url = f"https://filharmoniakrakow.pl/public/program/{p}?type=pagination&keyword=&fType=&fPerformer=&fComposer=&fInstruments=&fDateFrom={self.date_from}&fDateTo={self.date_to}&fSubscriptions="

                response = requests.get(
                    url=url,
                    headers=headers,
                    timeout=10,
                )
                response.raise_for_status()

                soup = BeautifulSoup(response.text, "lxml")
                concerts = soup.select(".repRow.block-item")

                return concerts

        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting concerts: {str(e)}")
            return []

    def _get_page_count(self):
        try:
            url = f"https://filharmoniakrakow.pl/public/program/?keyword=&fDateFrom={self.date_from}&fDateTo={self.date_to}"
            response = requests.get(url=url, headers=headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")
            page_count = len(soup.select(".pagination-btn:not(.pagination-arrow)"))

            logger.info(f"Found {page_count} pages of concerts")
            return page_count

        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting page count: {str(e)}")
            return 0

    def _get_details_link(self, concert_html):
        date_time = safe_find(
            soup=concert_html,
            selector=".repRow-data-mobile",
            error_msg="Could not find date and time",
        )

        details_href = safe_find_attr(
            soup=concert_html,
            selector=".primary-btn-light",
            attr="href",
            error_msg=f"Could not find details link for concert on {date_time}",
        )

        if not details_href:
            logger.warning(f"Missing details link for concert on {date_time}")
            return None

        details_link = f"https://filharmoniakrakow.pl{details_href}"
        return details_link
