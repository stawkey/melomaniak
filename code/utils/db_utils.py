import psycopg2
from .logging_config import logger
from datetime import datetime
from . import db_config


def check_if_concert_exists(details_link):
    check_query = """
            SELECT EXISTS(SELECT 1
            FROM concerts
            WHERE details_link = %s) \
        """

    try:
        config = db_config.load_config()
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cursor:
                cursor.execute(check_query, (details_link,))
                exists = cursor.fetchone()[0]
                return exists

    except (psycopg2.DatabaseError, Exception) as e:
        logger.error("Error checking if concert %s exists: %s", details_link, e)
        return True


def create_table():
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
        config = db_config.load_config()
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cursor:
                cursor.execute(create_table_query)
                conn.commit()
    except (psycopg2.DatabaseError, Exception) as e:
        logger.error("Error creating table: %s", e)
        raise


def save_to_database(concert_list):
    if not concert_list:
        logger.warning("No concerts to save to database")
        return False

    insert_query = """INSERT INTO concerts (date, title, concert_type, composers, programme, venue, source, details_link)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""

    try:
        config = db_config.load_config()
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cursor:
                cnt = 0
                for concert in concert_list:
                    cnt += 1
                    date = datetime.strptime(concert.date, "%d-%m-%Y %H:%M")

                    cursor.execute(
                        insert_query,
                        (
                            date,
                            concert.title,
                            concert.concert_type,
                            concert.composers,
                            concert.programme,
                            concert.venue,
                            concert.source,
                            concert.details_link,
                        ),
                    )

                conn.commit()
                logger.info("Successfully saved %d concerts", cnt)
                return True
    except (psycopg2.DatabaseError, Exception) as e:
        logger.error("Error saving to database: %s", e)
        return False
