import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time
from random import SystemRandom
import logging
import re
import copy
import psycopg2
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from config import load_config

BASE_URL = "https://filharmoniakrakow.pl/public/program"
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
        script_dir = os.path.dirname(os.path.abspath(__file__))
        config_path = os.path.join(script_dir, "../database.ini")
        self.db_config = load_config(config_path)

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
            hour = hour.split()[-1].strip()
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
            return None

        details_link = f"https://filharmoniakrakow.pl{details_href}"

        if self.check_if_concert_exists(details_link):
            return None

        # Get concert details
        try:
            details_response = requests.get(
                url=details_link, headers=self.headers, timeout=10
            )
            details_response.raise_for_status()
            details_soup = BeautifulSoup(details_response.text, "lxml")

            # Extract programme
            programme = self.extract_programme(details_soup)

            # Get composers
            composers = self.extract_composers(programme)

            if not programme:
                logger.warning("Programme is empty: %s", details_link)

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
                "date": f"{date} {hour}",
                "title": concert_title,
                "concert_type": concert_type,
                "composers": composers,
                "programme": programme,
                "venue": venue,
                "source": "Filharmonia Krakowska",
                "details_link": details_link,
            }

        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting details for concert {concert_title}: {str(e)}")
            return None

    def extract_programme(self, details_soup):
        """Extract the programme information from concert details"""
        programme = []
        programme_header = details_soup.find("h2", string="Repertuar:")

        if not programme_header:
            logger.warning("Could not find programme header")
            return programme

        paragraph = programme_header.find_next_sibling()
        while paragraph and paragraph.name != "hr":
            p_copy = copy.deepcopy(paragraph)

            for b_tag in p_copy.find_all("b"):
                b_tag.extract()

            if p_copy.find("br"):
                items = []
                for br in p_copy.find_all("br"):
                    br.replace_with("||SPLIT||")

                content = p_copy.get_text()
                for item in content.split("||SPLIT||"):
                    item = " ".join(item.split())
                    if item and not re.match(r"^[*\s]*$", item):
                        programme.append(item)
            else:
                text = p_copy.get_text()
                text = " ".join(text.split())
                if text and not re.match(r"^[*\s]*$", text):
                    programme.append(text)

            paragraph = paragraph.find_next_sibling()

        return programme

    def extract_composers(self, programme):
        composers = []
        for p in programme:
            composer_pattern = re.compile(
                r"^([A-Z][a-zA-ZàáâäãåąćčćęèéêëėįìíîïłńñòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÑÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ\s\.\-\/]+?)(?:\s*[–\-]\s+|\s+[–\-]|:)"
            )
            composer_match = composer_pattern.match(p)
            if composer_match:
                composers.append(composer_match.group(1).strip())

        return composers

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

            time.sleep(cryptogen.uniform(0.5, 2))

        logger.info(f"Scraping complete. Found {len(self.concert_list)} concerts.")
        return self.concert_list

    def check_if_concert_exists(self, details_link):
        """Check if concert already exists in database"""
        check_query = """
            SELECT EXISTS(SELECT 1
            FROM concerts
            WHERE details_link = %s) \
        """

        try:
            with psycopg2.connect(**self.db_config) as conn:
                with conn.cursor() as cursor:
                    cursor.execute(check_query, (details_link,))
                    exists = cursor.fetchone()[0]
                    return exists

        except (psycopg2.DatabaseError, Exception) as e:
            logger.error("Error checking if concert %s exists: %s", details_link, e)
            return True

    def create_table(self):
        """Create concerts table if it doesn't exist"""
        create_table_query = """
            CREATE TABLE IF NOT EXISTS concerts (
            id SERIAL PRIMARY KEY,
            date TIMESTAMP,
            title VARCHAR(300),
            concert_type VARCHAR(200),
            composers VARCHAR(200)[],
            programme VARCHAR(400)[],
            venue VARCHAR(200),
            source VARCHAR(200),
            details_link VARCHAR(500),
            modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """

        try:
            with psycopg2.connect(**self.db_config) as conn:
                with conn.cursor() as cursor:
                    cursor.execute(create_table_query)
                    conn.commit()
        except (psycopg2.DatabaseError, Exception) as e:
            logger.error("Error creating table: %s", e)
            raise

    def save_to_database(self):
        """Save scraped concerts to PostgreSQL database"""
        if not self.concert_list:
            logger.warning("No concerts to save to database")
            return False

        insert_query = """INSERT INTO concerts (date, title, concert_type, composers, programme, venue, source, details_link)
                          VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""

        try:
            with psycopg2.connect(**self.db_config) as conn:
                with conn.cursor() as cursor:
                    for concert in self.concert_list:
                        # Parse date and add Polish timezone offset
                        date = datetime.strptime(concert["date"], "%d-%m-%Y %H:%M")

                        cursor.execute(
                            insert_query,
                            (
                                date,
                                concert["title"],
                                concert["concert_type"],
                                concert["composers"],
                                concert["programme"],
                                concert["venue"],
                                concert["source"],
                                concert["details_link"],
                            ),
                        )

                    conn.commit()
                    logger.info(
                        "Successfully saved %d concerts", len(self.concert_list)
                    )
                    return True
        except (psycopg2.DatabaseError, Exception) as e:
            logger.error("Error saving to database: %s", e)
            return False


def main():
    # date_from = "2025-07-01"
    # date_to = "2025-07-10"

    date_now = datetime.today()
    date_from = date_now.strftime("%Y-%m-%d")
    date_to = date_now.replace(year=date_now.year + 1).strftime("%Y-%m-%d")

    scraper = FilharmoniaKrakowskaScraper(date_from, date_to)
    scraper.create_table()
    scraper.scrape()
    scraper.save_to_database()


if __name__ == "__main__":
    main()
