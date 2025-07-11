from bs4 import BeautifulSoup
from .logging_config import logger


def safe_find(soup, selector, default="", error_msg="Element not found"):
    """Extract text from an element matching CSS selector"""
    try:
        element = soup.select_one(selector)
        return element.text.strip() if element else default
    except Exception as e:
        logger.warning(f"{error_msg}: {str(e)}")
        return default


def safe_find_attr(soup, selector, attr, default="", error_msg="Attribute not found"):
    """Extract attribute from an element matching CSS selector"""
    try:
        element = soup.select_one(selector)
        return element[attr] if element else default
    except Exception as e:
        logger.warning(f"{error_msg}: {str(e)}")
        return default


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
