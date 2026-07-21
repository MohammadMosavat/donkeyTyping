from datetime import UTC, datetime, timedelta

import bcrypt
import jwt

from app.config import settings
from app.database import users_collection


def authenticate_user(email: str, password: str) -> dict | None:
    user = users_collection.find_one({"email": email.lower()})
    if user is None:
        return None

    password_matches = bcrypt.checkpw(
        password.encode("utf-8"), user["password"].encode("utf-8")
    )
    return user if password_matches else None


def create_access_token(user_id: str) -> str:
    expires_at = datetime.now(UTC) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    return jwt.encode(
        {"sub": user_id, "exp": expires_at},
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
