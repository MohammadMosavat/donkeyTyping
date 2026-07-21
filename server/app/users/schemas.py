from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9]+$")
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    location: str = Field(min_length=3, max_length=100)
    joinedAt: datetime

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).lower()

    @field_validator("password")
    @classmethod
    def validate_bcrypt_length(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value


class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    location: str
    joinedAt: datetime

    model_config = ConfigDict(from_attributes=True)
