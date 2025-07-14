from common.scraper import Scraper
from scrapers.silesian_philharmonic.concert import SilesianPhilharmonicConcert
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from utils.logging_config import logger
from utils.html_extractor import safe_find, safe_find_attr
from utils.config import *


class SilesianPhilharmonicScraper(Scraper):
    def _create_concert(self):
        return SilesianPhilharmonicConcert()

    def _get_individual_concerts_html(self):
        try:
            url = "https://filharmonia-slaska.eu/repertuar/"

            response = requests.get(
                url=url,
                headers=headers,
                timeout=10,
            )
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")
            concerts = soup.select(".concert")

            return concerts

        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting concerts: {str(e)}")
            return []

    def _get_details_link(self, concert_html):
        date = safe_find(
            soup=concert_html, selector=".concert-time", error_msg="Could not find date"
        )

        details_link = safe_find_attr(
            soup=concert_html,
            selector="a",
            attr="href",
            error_msg=f"Could not find details link for concert on {date}",
        )

        if not details_link:
            logger.warning(f"Missing details link for concert on {date}")
            return None

        print(details_link)
        return details_link
