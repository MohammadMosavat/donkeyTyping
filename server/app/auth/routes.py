from fastapi import APIRouter, HTTPException, status

from app.auth import service
from app.auth.schemas import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> dict:
    user = service.authenticate_user(str(payload.email), payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return {
        "access_token": service.create_access_token(str(user["_id"])),
        "token_type": "bearer",
        "username": user["username"],
    }
