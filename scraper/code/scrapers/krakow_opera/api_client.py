import json
import requests
from utils.logging_config import logger


class KrakowOperaApiClient:
    def get_performances(self, month, year):
        try:
            url = "https://opera.krakow.pl/ajax/repertuar"
            params = {"month": month, "year": year}
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }

            response = requests.get(url=url, params=params, headers=headers, timeout=10)

            response_text = response.text

            logger.debug(f"Raw response length: {len(response_text)}")
            logger.debug(f"Response starts with: {response_text[:100]}")

            script_end = response_text.find("</script>")
            json_part = response_text[script_end + 9 :].strip()

            text = response_text.strip()
            if "<script" in text:
                text = text[text.find("</script>") + 9 :]
                text = text[: text.find("<script")]

            json_part = text.strip()

            data = json.loads(json_part)
            performances = data.get("performances", [])

            return performances

        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching performances from API: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return []
