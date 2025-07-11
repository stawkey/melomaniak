import sys
import os
from .scrapers.krakow_philharmonic.scraper import KrakowPhilharmonicScraper
from .utils.db_utils import save_to_database, create_table


def main():
    create_table()
    scraper = KrakowPhilharmonicScraper()
    save_to_database(scraper.scrape())


if __name__ == "__main__":
    main()
