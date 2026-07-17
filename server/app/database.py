from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from app.config import settings


client: MongoClient = MongoClient(settings.mongodb_url)
database: Database = client[settings.mongodb_database]

users_collection: Collection = database["users"]
records_collection: Collection = database["wpm_records"]


def create_indexes() -> None:
    users_collection.create_index("username", unique=True)
    users_collection.create_index("email", unique=True)
    records_collection.create_index(
        [("username", ASCENDING), ("date", DESCENDING)]
    )


def close_database() -> None:
    client.close()
