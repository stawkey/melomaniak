from common.scraper import Scraper
from scrapers.silesian_opera.concert import SilesianOperaConcert
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from utils.logging_config import logger
from utils.html_extractor import safe_find, safe_find_attr
from utils.config import *
import hashlib


class SilesianOperaScraper(Scraper):
    def __init__(self):
        self.months_to_scrape = 13

    def _create_concert(self, concert_html):
        concert = SilesianOperaConcert()
        concert.concert_html = concert_html
        return concert

    def _scrape_single_page(self, url, concert_type):
        concerts_from_page = []

        try:
            response = requests.get(
                url=url,
                headers=headers,
                timeout=10,
            )
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")
            concerts = soup.select(".repertoire_item")

            logger.info(f"Found {len(concerts)} concerts for {concert_type} on {url}")

            polish_months = {
                "stycznia": "01",
                "lutego": "02",
                "marca": "03",
                "kwietnia": "04",
                "maja": "05",
                "czerwca": "06",
                "lipca": "07",
                "sierpnia": "08",
                "września": "09",
                "października": "10",
                "listopada": "11",
                "grudnia": "12",
            }

            for concert in concerts:
                title_elem = concert.select_one(".repertoire_title")
                title = title_elem.text.strip() if title_elem else "Unknown title"

                hour_elem = concert.select_one(".repertoire_hour .highlight")
                time = hour_elem.text.strip() if hour_elem else "Unknown time"

                date_elem = concert.select_one(".nr")
                date_text = (
                    date_elem.text.strip().split(",")[0]
                    if date_elem
                    else "Unknown date"
                )

                venue_elem = concert.select_one(".repertoire_place .highlight")
                venue = venue_elem.text.strip() if venue_elem else "Unknown venue"

                try:
                    date_parts = date_text.strip().split()
                    if len(date_parts) == 3:
                        day = date_parts[0]
                        month_polish = date_parts[1]
                        year = date_parts[2]

                        month_num = polish_months.get(month_polish.lower(), "01")
                        date_part = f"{day.zfill(2)}-{month_num}-{year}"
                    else:
                        date_part = datetime.now().strftime("%d-%m-%Y")

                    hour_part = time.strip()
                    final_date = f"{date_part} {hour_part}"
                except Exception as e:
                    logger.warning(
                        f"Invalid date/time format: '{date_text} {time}': {e}"
                    )
                    final_date = "Unknown date Unknown time"

                concert["data-concert-type"] = concert_type
                concert["data-title"] = title
                concert["data-date"] = final_date
                concert["data-venue"] = venue
                if concert_type == "Koncert" or concert_type == "Pozostałe":
                    concert["data-programme"] = "None"
                else:
                    concert["data-programme"] = title

                concerts_from_page.append(concert)

            next_link = None
            next_elem = soup.select_one("a.next1")
            if next_elem and next_elem.get("href"):
                next_link = f"https://opera-slaska.pl{next_elem['href']}"

            return concerts_from_page, next_link

        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting concerts from {url}: {str(e)}")
            return concerts_from_page, None

    def _get_individual_concerts_html(self):
        try:
            all_concerts = []
            base_urls = {
                "https://opera-slaska.pl/repertuar/category/1/balet": "Balet",
                "https://opera-slaska.pl/repertuar/category/2/koncert": "Koncert",
                "https://opera-slaska.pl/repertuar/category/3/operetka": "Operetka",
                "https://opera-slaska.pl/repertuar/category/4/opera": "Opera",
                "https://opera-slaska.pl/repertuar/category/5/musical": "Musical",
                "https://opera-slaska.pl/repertuar/category/6/pozostale": "Pozostałe",
            }

            for base_url, concert_type in base_urls.items():
                logger.info(
                    f"Scraping {concert_type} concerts starting from {base_url}"
                )

                current_url = base_url
                months_scraped = 0

                while current_url and months_scraped < self.months_to_scrape:
                    concerts_from_page, next_url = self._scrape_single_page(
                        current_url, concert_type
                    )
                    all_concerts.extend(concerts_from_page)

                    months_scraped += 1
                    current_url = next_url

                logger.info(
                    f"Completed scraping {concert_type} - scraped {months_scraped} months"
                )

            logger.info(
                f"Total concerts found across all categories: {len(all_concerts)}"
            )
            return all_concerts

        except Exception as e:
            logger.error(f"Error in _get_individual_concerts_html: {str(e)}")
            return []

        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting concerts: {str(e)}")
            return []

    def _get_details_link(self, concert_html):
        details_href = safe_find_attr(
            soup=concert_html,
            selector=".repertoire_title",
            attr="href",
            error_msg=f"Could not find details link",
        )

        if not details_href:
            logger.warning(f"Missing details link for concert")
            return None

        base_details_link = f"https://opera-slaska.pl{details_href}"

        date = concert_html.get("data-date", "unknown")
        venue = concert_html.get("data-venue", "unknown")

        unique_suffix = hashlib.md5(f"{date}_{venue}".encode()).hexdigest()[:8]
        unique_details_link = f"{base_details_link}?performance_id={unique_suffix}"

        return unique_details_link
