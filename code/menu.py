from scrapers.krakow_philharmonic.scraper import KrakowPhilharmonicScraper
from scrapers.silesian_philharmonic.scraper import SilesianPhilharmonicScraper
from utils.db_utils import save_to_database, create_table


class PhilharmonicMenu:
    def __init__(self):
        self.scrapers = {
            "1": ("Krakow Philharmonic", KrakowPhilharmonicScraper),
            "2": ("Silesian Philharmonic", SilesianPhilharmonicScraper),
        }

    def run(self):
        create_table()

        while True:
            self.display_menu()
            choice = input("Select option: ").strip()

            if choice == "q":
                break
            elif choice == "0":
                results = self.scrape_all()
            elif choice in self.scrapers:
                name, scraper_class = self.scrapers[choice]
                print(f"\n--- Scraping {name} ---")
                results = scraper_class().scrape()
            else:
                print("Invalid option, please try again")
                continue

            if not results:
                print("No results to save")
                continue

            print(results)

            print(f"\nFound {len(results)} results")
            save_choice = input("Do you want to save to database? (y/n): ")

            if save_choice.lower() in ["y", "yes", "1"]:
                save_to_database(results)
                print("Results saved to database")
            else:
                print("Results not saved")

    def display_menu(self):
        print("\n=== Philharmonic Scraper ===")
        print("0. Scrape all")
        for key, (name, _) in self.scrapers.items():
            print(f"{key}. {name}")
        print("q. Quit")
        print("=" * 29)

    def scrape_all(self):
        all_results = []
        print("Scraping all...")

        for name, scraper_class in self.scrapers.values():
            try:
                print(f"\n--- Scraping {name} ---")
                result = scraper_class().scrape()
                all_results.extend(result)
            except Exception as e:
                print(f"Error scraping {name}: {e}")

        return all_results
