from ...common.concert import Concert
from ...utils.logging_config import logger
from ...utils.html_extractor import safe_find, safe_find_by_text
import re
import copy
from bs4 import BeautifulSoup
import requests


class KrakowPhilharmonicConcert(Concert):
    def __init__(self):
        super().__init__()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br, zstd",
        }
        self.details_soup = None

    def _fetch_concert_details(self):
        try:
            details_response = requests.get(
                url=self.details_link, headers=self.headers, timeout=10
            )
            details_response.raise_for_status()
            self.details_soup = BeautifulSoup(details_response.text, "lxml")
        except requests.exceptions.RequestException as e:
            logger.error("Error getting concert details: %s", e)
            raise

    def _extract_date(self):
        day = safe_find(
            soup=self.details_soup,
            selector=".card-day",
            error_msg="Could not find day",
        )
        month_year = safe_find(
            soup=self.details_soup,
            selector=".card-week",
            error_msg="Could not find month/year",
        )
        hour = safe_find(
            soup=self.details_soup,
            selector=".card-hours",
            error_msg="Could not find hour",
        )

        try:
            date_part = f"{day}-{month_year}".strip()
            hour_part = hour.split()[-1].strip() if hour else "Unknown time"

            self.date = f"{date_part} {hour_part}"
        except Exception as e:
            logger.warning(
                f"Invalid date/time format: '{day} {month_year} {hour}' - {e}"
            )
            self.date = "Unknown date Unknown time"

    def _extract_title(self):
        self.title = safe_find(
            soup=self.details_soup,
            selector=".section-title-upper",
            error_msg="Could not find title",
        ).title()

    def _extract_concert_type(self):
        self.concert_type = safe_find_by_text(
            soup=self.details_soup,
            tag="span",
            text="Rodzaj koncertu",
            error_msg="Could not find concert type",
        )

    def _extract_programme(self):
        programme = []
        programme_header = self.details_soup.find("h2", string="Repertuar:")

        if not programme_header:
            logger.warning("Could not find programme header")
            self.programme = programme
            return

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

        self.programme = programme

    def _extract_composers(self):
        self.composers = []
        for p in self.programme:
            composer_pattern = re.compile(
                r"^([A-Z][a-zA-ZàáâäãåąćčćęèéêëėįìíîïłńñòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÑÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ\s\.\-\/]+?)(?:\s*[–\-]\s+|\s+[–\-]|:)"
            )
            composer_match = composer_pattern.match(p)
            if composer_match:
                self.composers.append(composer_match.group(1).strip())

    def _extract_venue(self):
        self.venue = safe_find_by_text(
            soup=self.details_soup,
            tag="span",
            text="Miejsce",
            error_msg="Could not find venue",
        )

    def _extract_source(self):
        self.source = "Filharmonia Krakowska"
