from common.concert import Concert
from utils.logging_config import logger
from utils.html_extractor import safe_find, safe_find_by_text
import re
import copy
from bs4 import BeautifulSoup
import requests
from utils.config import *
from datetime import datetime


class SilesianPhilharmonicConcert(Concert):
    def _extract_date(self):
        date = safe_find(
            soup=self.details_soup,
            selector=".wp_theatre_event_date.wp_theatre_event_startdate",
            error_msg="Could not find date",
        )
        hour = safe_find(
            soup=self.details_soup,
            selector=".wp_theatre_event_time.wp_theatre_event_starttime",
            error_msg="Could not find hour",
        )

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

        try:
            date_parts = date.strip().split()
            if len(date_parts) == 3:
                day = date_parts[0]
                month_polish = date_parts[1]
                year = date_parts[2]

                month_num = polish_months.get(month_polish.lower(), "01")
                date_part = f"{day.zfill(2)}-{month_num}-{year}"
            else:
                date_part = datetime.strftime("%d-%m-%Y")

            hour_part = hour.strip()

            self.date = f"{date_part} {hour_part}"
        except Exception as e:
            logger.warning(f"Invalid date/time format: '{date} {hour}': {e}")
            self.date = "Unknown date Unknown time"

    def _extract_title(self):
        self.title = (
            safe_find(
                soup=self.details_soup,
                selector=".entry-title",
                error_msg="Could not find title",
            )
            .split("|")[0]
            .strip()
            .title()
        )

    def _extract_concert_type(self):
        self.concert_type = self._help_extract_concert_type()

    def _help_extract_concert_type(self):
        title = safe_find(
            soup=self.details_soup,
            selector=".entry-title",
            error_msg="Could not find title",
        ).split("|")

        types = {
            "Orkiestra Symfoniczna": "Koncerty Symfoniczne",
            "Chór": "Koncerty Chóralne",
            "Orkiestra Kameralna": "Koncerty Kameralne",
            "HoloGramy": "Koncerty Kameralne",
        }

        for k, v in types.items():
            for part in title:
                if k.lower() in part.strip().lower():
                    return v

        return "Inne"

    def _extract_programme(self):
        self.programme = []

        programme_header = None
        for p in self.details_soup.find_all("p"):
            if p.get_text().strip().startswith("Wykonawcy"):
                programme_header = p
                break

        if not programme_header:
            logger.warning("Could not find programme header")
            self.programme = self.programme
            return

        next_element = programme_header.find_next_sibling("ul").find_next_sibling("ul")

        for li in next_element.find_all("li"):
            li_copy = copy.deepcopy(li)

            for em_tag in li_copy.find_all("em"):
                em_tag.unwrap()

            text = li_copy.get_text().strip()
            if text and not re.match(r"^[*\s]*$", text):
                self.programme.append(text)

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
        self.venue = safe_find(
            soup=self.details_soup,
            selector=".wp_theatre_event_venue",
            error_msg="Could not find venue",
        )

    def _extract_source(self):
        self.source = "Filharmonia Śląska"
