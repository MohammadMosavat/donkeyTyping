from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class RecordCreate(BaseModel):
    username: str = Field(min_length=1, max_length=30)
    wpm: float = Field(ge=0)
    correct_char: int = Field(ge=0)
    incorrect_char: int = Field(ge=0)
    time: float = Field(gt=0)
    word: Any
    date: datetime
    language: str = Field(min_length=1, max_length=20)


class RecordResponse(RecordCreate):
    id: str

    model_config = ConfigDict(from_attributes=True)
