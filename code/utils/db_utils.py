import psycopg2
from utils.logging_config import logger
from datetime import datetime
from utils import db_config


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


def create_tables():
    create_tables_query = """
        CREATE TABLE IF NOT EXISTS concerts (
        id serial PRIMARY KEY,
        date timestamp,
        title varchar(300),
        concert_type varchar(200),
        venue varchar(200),
        source varchar(200),
        details_link varchar(500),
        modified_at timestamp DEFAULT CURRENT_TIMESTAMP,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS composers (
        id serial PRIMARY KEY,
        concert_id integer REFERENCES concerts,
        composer VARCHAR(200)
        );
        
        CREATE TABLE IF NOT EXISTS programmes (
        id serial PRIMARY KEY,
        concert_id integer REFERENCES concerts,
        piece VARCHAR(400)
        );
    """

    try:
        config = db_config.load_config()
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cursor:
                cursor.execute(create_tables_query)
                conn.commit()
    except (psycopg2.DatabaseError, Exception) as e:
        logger.error("Error creating table: %s", e)
        raise


def save_to_database(concert_list):
    if not concert_list:
        logger.warning("No concerts to save to database")
        return False

    concerts_insert_query = """INSERT INTO concerts (date, title, concert_type, venue, source, details_link) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id"""

    composers_insert_query = (
        """INSERT INTO composers (concert_id, composer) VALUES (%s, %s)"""
    )

    programme_insert_query = (
        """INSERT INTO programmes (concert_id, piece) VALUES (%s, %s)"""
    )

    try:
        config = db_config.load_config()
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cursor:
                cnt = 0
                for concert in concert_list:
                    cnt += 1
                    date = datetime.strptime(concert.date, "%d-%m-%Y %H:%M")

                    cursor.execute(
                        concerts_insert_query,
                        (
                            date,
                            concert.title,
                            concert.concert_type,
                            concert.venue,
                            concert.source,
                            concert.details_link,
                        ),
                    )
                    concert_id = cursor.fetchone()[0]

                    for composer in concert.composers:
                        cursor.execute(composers_insert_query, (concert_id, composer))

                    for piece in concert.programme:
                        cursor.execute(programme_insert_query, (concert_id, piece))

                conn.commit()
                logger.info("Successfully saved %d concerts", cnt)
                return True
    except (psycopg2.DatabaseError, Exception) as e:
        logger.error("Error saving to database: %s", e)
        return False
