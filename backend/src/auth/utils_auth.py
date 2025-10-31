# from passlib.context import CryptContext
import os
import bcrypt
from datetime import datetime, timezone, timedelta

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from backend import settings
from jose import JWTError, jwt

from backend.src.auth.models_auth import UserAccount, UserLogin

from ..database.utils_database import db_dependency
from ..database.redis_databse import token_in_blocklist


# password_context = CryptContext(["bcrypt"])
class AuthUtils:
    """
    Responsible for handling:
        - Password Hashing
        - Password Verification
        - JWT Generation
        - JWT Verification
    """

    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

    def generate_passwd_hash(self, password: str) -> str:
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode()

    def verify_passwd(self, password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

    def create_access_token(self, data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.TOKEN_EXPIRY_TIME)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET)
        return encoded_jwt

    async def get_current_user(self, db: db_dependency, request: Request) -> UserAccount:
        credential_exception = HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Could not validate token", "resolution": "Please get a new token"},
            headers={"WWW-Authenticate": "Bearer"},
        )
        token = request.cookies.get("access_token")

        print(await token_in_blocklist(token))
        
        if await token_in_blocklist(token):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"error": "This token is invalidor has been revoked", "resolution": "Please get a new token"},
            )

        if not token:
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED, detail="No token found", headers={"WWW-Authenticate": "Bearer"}
            )
        try:
            payload = jwt.decode(token, settings.SECRET)
            username: str = payload.get("username")
            if username is None:
                raise credential_exception
        except JWTError:
            raise credential_exception
        users_collection = db["users"]
        user = await users_collection.find_one({"username": username.lower()})
        if not user:
            raise credential_exception
        return UserAccount(**user)
