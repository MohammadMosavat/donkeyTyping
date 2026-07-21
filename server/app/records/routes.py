from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.auth.dependencies import get_current_user
from app.records import service
from app.records.schemas import RecordCreate, RecordResponse
from app.records.service import SortOption

router = APIRouter(prefix="/records", tags=["records"])


@router.post("", response_model=RecordResponse, status_code=status.HTTP_201_CREATED)
def create_record(
    payload: RecordCreate,
    current_user: dict = Depends(get_current_user),
) -> dict:
    if payload.username != current_user["username"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Records can only be created for the authenticated user",
        )
    return service.create_record(payload)


@router.get("", response_model=list[RecordResponse])
def get_records(
    username: Annotated[str | None, Query(min_length=1)] = None,
    sort: SortOption = "newest",
) -> list[dict]:
    return service.get_records(username, sort)
