from configparser import ConfigParser
import os


# source: https://neon.com/postgresql/postgresql-python/connect
def load_config(filename="database.ini", section="postgresql"):
    parser = ConfigParser()

    current_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(current_dir, filename)

    parser.read(config_path)

    config = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            config[param[0]] = param[1]
    else:
        raise Exception(
            "Section {0} not found in the {1} file".format(section, filename)
        )

    return config


if __name__ == "__main__":
    config = load_config()
