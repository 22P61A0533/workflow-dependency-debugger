import os

from dotenv import load_dotenv
from neo4j import GraphDatabase


load_dotenv()


COGNODB_URI = os.getenv("COGNODB_URI")
COGNODB_USERNAME = os.getenv("COGNODB_USERNAME")
COGNODB_PASSWORD = os.getenv("COGNODB_PASSWORD")


if not COGNODB_URI:
    raise ValueError("COGNODB_URI is not set in the .env file")

if not COGNODB_USERNAME:
    raise ValueError("COGNODB_USERNAME is not set in the .env file")

if not COGNODB_PASSWORD:
    raise ValueError("COGNODB_PASSWORD is not set in the .env file")


driver = GraphDatabase.driver(
    COGNODB_URI,
    auth=(COGNODB_USERNAME, COGNODB_PASSWORD)
)


def verify_connection():
    try:
        driver.verify_connectivity()
        print("Successfully connected to CognoDB.")
        return True
    except Exception as error:
        print(f"Could not connect to CognoDB: {error}")
        return False


def close_connection():
    driver.close()