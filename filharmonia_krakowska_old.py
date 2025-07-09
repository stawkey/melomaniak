import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time
from random import SystemRandom
import logging
import csv
import re

BASE_URL = "https://filharmoniakrakow.pl/public/program"
OUTPUT_FILENAME = "filharmonia_krakowska.csv"
LOG_FILENAME = "filharmonia_krakowska.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(filename)s:%(lineno)s - %(message)s",
    handlers=[logging.FileHandler(LOG_FILENAME), logging.StreamHandler()],
)
logger = logging.getLogger()
cryptogen = SystemRandom()


class HTMLExtractor:
    @staticmethod
    def safe_find(soup, selector, default="", error_msg="Element not found"):
        """Extract text from an element matching CSS selector"""
        try:
            element = soup.select_one(selector)
            return element.text.strip() if element else default
        except Exception as e:
            logger.warning(f"{error_msg}: {str(e)}")
            return default

    @staticmethod
    def safe_find_attr(
        soup, selector, attr, default="", error_msg="Attribute not found"
    ):
        """Extract attribute from an element matching CSS selector"""
        try:
            element = soup.select_one(selector)
            return element[attr] if element else default
        except Exception as e:
            logger.warning(f"{error_msg}: {str(e)}")
            return default

    @staticmethod
    def safe_find_by_text(soup, tag, text, default="", error_msg="Element not found"):
        """Find element by text content and return next sibling's text"""
        try:
            element = soup.find(tag, string=text)
            if element and element.find_next(tag):
                return element.find_next(tag).text.strip().title()
            return default
        except Exception as e:
            logger.warning(f"{error_msg}: {str(e)}")
            return default


class FilharmoniaKrakowskaScraper:
    def __init__(self, date_from, date_to):
        self.date_from = date_from
        self.date_to = date_to
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br, zstd",
        }
        self.concert_list = []

    def get_page_count(self):
        """Get total number of pages with concert listings"""
        try:
            url = f"{BASE_URL}/?keyword=&fDateFrom={self.date_from}&fDateTo={self.date_to}"
            response = requests.get(url=url, headers=self.headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")
            page_count = len(soup.select(".pagination-btn:not(.pagination-arrow)"))

            logger.info(f"Found {page_count} pages of concerts")
            return page_count

        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting page count: {str(e)}")
            return 0

    def get_page_url(self, page_number):
        """Generate URL for a specific page of results"""
        if page_number == 1:
            return f"{BASE_URL}/?keyword=&fDateFrom={self.date_from}&fDateTo={self.date_to}"
        else:
            return f"{BASE_URL}/{page_number}?type=pagination&keyword=&fType=&fPerformer=&fComposer=&fInstruments=&fDateFrom={self.date_from}&fDateTo={self.date_to}&fSubscriptions="

    def extract_concert_listings(self, page_number):
        """Extract all concert listings from a page"""
        try:
            url = self.get_page_url(page_number)
            response = requests.get(url=url, headers=self.headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")
            concerts = soup.select(".repRow.block-item")

            logger.info(f"Found {len(concerts)} concerts on page {page_number}")
            return concerts

        except requests.exceptions.RequestException as e:
            logger.error(
                f"Error getting concert listings for page {page_number}: {str(e)}"
            )
            return []

    def extract_concert_details(self, concert_html):
        """Extract all details for a single concert"""
        # Extract basic info from listing
        date_time = HTMLExtractor.safe_find(
            concert_html, ".repRow-data-mobile", "", "Could not find date and time"
        )

        try:
            date, hour = date_time.split(",")
            date = date.strip()
            hour = hour.strip()
        except ValueError:
            logger.warning(f"Invalid date/time format: '{date_time}'")
            date, hour = "Unknown date", "Unknown time"

        concert_title = HTMLExtractor.safe_find(
            concert_html,
            ".repRow-title",
            "Unknown Title",
            f"Could not find title for concert on {date} {hour}",
        ).title()

        # Get details link
        details_href = HTMLExtractor.safe_find_attr(
            concert_html,
            ".primary-btn-light",
            "href",
            "",
            f"Could not find details link for concert on {date} {hour}",
        )

        if not details_href:
            logger.warning(f"Missing details link for concert: {concert_title}")
            return {
                "date": f"{date};{hour}",
                "title": concert_title,
                "concert_type": "Unknown",
                "composers": [],
                "programme": [],
                "venue": "Unknown",
                "source": "Filharmonia Krakowska",
                "details_link": "",
                "scraped_at": datetime.now().strftime("%Y-%m-%d;%H:%M:%S"),
            }

        details_link = f"https://filharmoniakrakow.pl{details_href}"

        # Get concert details
        try:
            details_response = requests.get(
                url=details_link, headers=self.headers, timeout=10
            )
            details_response.raise_for_status()
            details_soup = BeautifulSoup(details_response.text, "lxml")

            # Extract programme
            programme = self.extract_programme(details_soup)

            # Extract venue and concert type
            venue = HTMLExtractor.safe_find_by_text(
                details_soup,
                "span",
                "Miejsce",
                "Unknown Venue",
                f"Could not find venue for concert: {concert_title}",
            )

            concert_type = HTMLExtractor.safe_find_by_text(
                details_soup,
                "span",
                "Rodzaj koncertu",
                "Regular Concert",
                f"Could not find concert type for: {concert_title}",
            )

            return {
                "date": f"{date};{hour}",
                "title": concert_title,
                "concert_type": concert_type,
                "programme": programme,
                "venue": venue,
                "source": "Filharmonia Krakowska",
                "details_link": details_link,
                "scraped_at": datetime.now().strftime("%Y-%m-%d;%H:%M:%S"),
            }

        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting details for concert {concert_title}: {str(e)}")
            return None

    def is_valid_programme_piece(piece):
        pattern = r""
        return bool(re.match(pattern, piece))

    def extract_programme(self, details_soup):
        """Extract the programme information from concert details"""
        programme = []
        programme_header = details_soup.find("h2", string="Repertuar:")

        if not programme_header:
            logger.warning("Could not find programme header")
            return programme

        paragraph = programme_header.find_next_sibling()
        while paragraph.name != "hr":
            text = paragraph.get_text()
            text = " ".join(text.split())
            if text:
                programme.append(text)
            paragraph = paragraph.find_next_sibling()

        if not programme:
            logger.warning("Programme is empty")

        return programme

    def scrape(self):
        """Main scraping method that orchestrates the process"""
        page_count = self.get_page_count()

        for page in range(1, page_count + 1):
            logger.info(f"Processing page {page}/{page_count}")
            concerts = self.extract_concert_listings(page)

            for concert_html in concerts:
                concert_data = self.extract_concert_details(concert_html)
                if concert_data:
                    self.concert_list.append(concert_data)

            time.sleep(cryptogen.uniform(1, 3))

        logger.info(f"Scraping complete. Found {len(self.concert_list)} concerts.")
        return self.concert_list

    def save_to_csv(self, filename):
        """Save scraped concerts to CSV file"""
        try:
            with open(filename, "w", newline="", encoding="utf-8") as csvfile:
                fieldnames = [
                    "date",
                    "title",
                    "concert_type",
                    "composers",
                    "programme",
                    "venue",
                    "source",
                    "details_link",
                    "scraped_at",
                ]
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()

                for concert in self.concert_list:
                    concert_copy = concert.copy()
                    if isinstance(concert_copy["programme"], list):
                        concert_copy["programme"] = "|".join(concert_copy["programme"])
                    writer.writerow(concert_copy)

            logger.info(
                f"Successfully saved {len(self.concert_list)} concerts to {filename}"
            )
            return True

        except Exception as e:
            logger.error(f"Error saving to CSV: {str(e)}")
            return False


def main():
    date_from = "2025-07-10"
    date_to = "2025-10-10"

    # date_now = datetime.today()
    # date_from = date_now.strftime("%Y-%m-%d")
    # date_to = date_now.replace(year=date_now.year + 1).strftime("%Y-%m-%d")

    scraper = FilharmoniaKrakowskaScraper(date_from, date_to)
    scraper.scrape()
    # scraper.save_to_csv(OUTPUT_FILENAME)

    logger.info(f"Saved {len(scraper.concert_list)} concerts")


if __name__ == "__main__":
    main()
