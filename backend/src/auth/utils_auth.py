# from passlib.context import CryptContext
import os
import bcrypt
from datetime import datetime, timezone, timedelta

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from redis.asyncio import Redis
from src import settings
from jose import JWTError, jwt
from pymongo.asynchronous.collection import AsyncCollection

from src.auth.models_auth import UserAccount, UserLogin
from src.redis.redis import get_redis_client
from src.utils.send_otp_utils import send_otp

from ..database.utils_database import db_dependency
from ..redis.jwt_utils_redis import token_in_blocklist
from ..redis.otp_utils_redis import store_otp, verify_otp, remove_otp
from .models_auth import UserAccount

class AuthUtils:
    """
    Responsible for handling:
        - Password Hashing
        - Password Verification
        - JWT Generation
        - JWT Verification
    """

    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

    @staticmethod
    async def get_user_by_email(email: str, db: db_dependency):
        users_collection: AsyncCollection = db["users"]

        user_by_email = await users_collection.find_one({"email": email.lower()})
        if user_by_email is not None:
            return user_by_email
        else:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User does not exists")

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

    async def get_current_user(
        self, db: db_dependency, request: Request, redis_client: Redis = Depends(get_redis_client)
    ) -> UserAccount:
        credential_exception = HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Could not validate token", "resolution": "Please get a new token"},
            headers={"WWW-Authenticate": "Bearer"},
        )
        token = request.cookies.get("access_token")

        if await token_in_blocklist(token, redis_client):
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

    async def send_otp_for_email_verification(
        self, email: str, redis_client: Redis, db: db_dependency, username: str | None = None
    ) -> bool:
        """Returns bool so that any exception could lead to return of Internal Server Error"""
        if not username:
            user_to_get_email = await AuthUtils.get_user_by_email(email, db)
            username = user_to_get_email.get("username", "")
        try:
            otp = send_otp(username, email)
            await store_otp(otp, email, redis_client)
            return True
        except Exception as e:
            print("HERE")
            print(e)
            return False

    async def verify_otp_for_email_verification(self, email: str, otp: int, redis_client: Redis) -> bool:
        otp_check = await verify_otp(email, otp, redis_client)
        if not otp_check:
            return False
        await remove_otp(email, redis_client)
        return True
