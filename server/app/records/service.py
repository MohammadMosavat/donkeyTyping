from typing import Literal

from app.database import records_collection
from app.records.schemas import RecordCreate

SortOption = Literal["highest", "lowest", "newest", "oldest"]

SORT_OPTIONS: dict[str, tuple[str, int]] = {
    "highest": ("wpm", -1),
    "lowest": ("wpm", 1),
    "newest": ("date", -1),
    "oldest": ("date", 1),
}


def serialize_record(record: dict) -> dict:
    return {
        "id": str(record["_id"]),
        "username": record["username"],
        "wpm": record["wpm"],
        "correct_char": record["correct_char"],
        "incorrect_char": record["incorrect_char"],
        "time": record["time"],
        "word": record.get("word"),
        "date": record["date"],
        "language": record["language"],
    }


def create_record(payload: RecordCreate) -> dict:
    record = payload.model_dump()
    result = records_collection.insert_one(record)
    record["_id"] = result.inserted_id
    return serialize_record(record)


def get_records(username: str | None, sort: SortOption) -> list[dict]:
    query = {"username": username} if username else {}
    field, direction = SORT_OPTIONS[sort]
    cursor = records_collection.find(query).sort(field, direction)
    return [serialize_record(record) for record in cursor]
