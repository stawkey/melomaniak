from common.scraper import Scraper
from scrapers.krakow_opera.concert import KrakowOperaConcert
from scrapers.krakow_opera.api_client import KrakowOperaApiClient
from utils.logging_config import logger
from utils.db_utils import check_if_concert_exists
from datetime import datetime
import sys
from random import SystemRandom
import time


class KrakowOperaScraper(Scraper):
    def __init__(self):
        self.api_client = KrakowOperaApiClient()

    def scrape(self):
        try:
            now = datetime.now()
            months_to_fetch = []
            for i in range(13):
                month_num = now.month + i
                year = now.year + (month_num - 1) // 12
                month = ((month_num - 1) % 12) + 1
                months_to_fetch.append((f"{month:02d}", str(year)))

            cryptogen = SystemRandom()
            all_performances = []
            for month, year in months_to_fetch:
                performances = self.api_client.get_performances(month, year)
                all_performances.extend(performances)
                time.sleep(cryptogen.uniform(0.5, 2))

            logger.info("Found %d performances", len(all_performances))
            print(f"Found {len(all_performances)} performances")

            n = len(all_performances)
            concert_list = []
            for i, performance_data in enumerate(all_performances, 1):
                logger.info("Processing performance %d/%d", i, n)
                sys.stdout.write(f"\rProcessing performance {i}/{n}")
                sys.stdout.flush()

                ticket_url = performance_data.get("ticketUrl", "")

                if ticket_url and not check_if_concert_exists(ticket_url):
                    try:
                        concert = KrakowOperaConcert(performance_data)
                        concert_data = concert.extract_concert_data(ticket_url)
                        if concert_data:
                            concert_list.append(concert_data)
                    except Exception as e:
                        logger.error(f"Error processing performance: {e}")

            print()
            return concert_list

        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return []

    def _create_concert(self):
        pass

    def _get_individual_concerts_html(self):
        return []

    def _get_details_link(self, concert_html):
        return ""
