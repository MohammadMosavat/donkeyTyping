import bcrypt
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from app.database import users_collection
from app.users.schemas import UserCreate


class UserAlreadyExistsError(Exception):
    pass


def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "location": user["location"],
        "joinedAt": user["joinedAt"],
    }


def create_user(payload: UserCreate) -> dict:
    user = payload.model_dump()
    user["password"] = bcrypt.hashpw(
        payload.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    try:
        result = users_collection.insert_one(user)
    except DuplicateKeyError as exc:
        raise UserAlreadyExistsError("Username or email already exists") from exc

    user["_id"] = result.inserted_id
    return serialize_user(user)


def get_users(username: str | None = None) -> list[dict]:
    query = {"username": username} if username else {}
    return [serialize_user(user) for user in users_collection.find(query)]


def delete_user(user_id: str) -> bool:
    if not ObjectId.is_valid(user_id):
        raise ValueError("Invalid user ID")
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count == 1
