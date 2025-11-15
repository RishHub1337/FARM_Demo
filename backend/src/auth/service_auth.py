from typing import Any

from pydantic import EmailStr

from src.redis.redis import get_redis_client
from ..database.utils_database import db_dependency
from pymongo.asynchronous.collection import AsyncCollection
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from .models_auth import OtpVerificationModel, UserAccount
from .utils_auth import AuthUtils
from ..utils.send_otp_utils import send_otp
from ..redis.otp_utils_redis import remove_otp

from redis.asyncio import Redis

class UserServices:
    """
    Contains method realted to user authentication and account creation
    """

    util = AuthUtils()

    async def get_user_by_id(self, id: str, db: db_dependency) -> UserAccount | bool:
        """
        Gets user by it's ID
        Args:
            - id: User's unique Id.
        Returns:
            - user: UserAccount type user data
        """
        users_collection: AsyncCollection = db["users"]

        user_by_id = await users_collection.find_one({"_id": id})
        if user_by_id is not None:
            return user_by_id
        else:
            return False

    async def get_user_by_email(
        self, email: str, db: db_dependency, usage_by_create_account: bool = False
    ) -> UserAccount | bool:
        """
        Gets user by it's ID
        Args:
            - email: User's unique email.
            - usage_by_create_account: when used internally and want to avoid exceptions.
        Returns:
            - user: UserAccount type user data
        """
        users_collection: AsyncCollection = db["users"]

        user_by_email = await users_collection.find_one({"email": email.lower()})
        if user_by_email is not None:
            return user_by_email
        elif usage_by_create_account:
            return False
        else:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User does not exists")

    async def get_user_by_username(
        self, username: str, db: db_dependency, usage_by_create_account: bool = False
    ) -> UserAccount:
        """
        Gets user by it's ID
        Args:
            - username: User's unique username.
            - usage_by_create_account: when used internally and want to avoid exceptions.
        Returns:
            - user: UserAccount type user data
        """
        users_collection: AsyncCollection = db["users"]

        user_by_username = await users_collection.find_one({"username": username.lower()})
        if user_by_username is not None:
            return user_by_username
        elif usage_by_create_account:
            return False
        else:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User does not exists")

    async def check_username_email_existance(self, username: str, email: str, db: db_dependency) -> None:
        """Checks whether email and username for a new account already exists in the DB."""
        user_check = await self.get_user_by_email(email, db, True)

        if user_check:
            raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, detail="Email already exists")
        else:
            pass

        user_check = await self.get_user_by_username(username, db, True)
        if user_check:
            raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, detail="Username already exists")
        else:
            pass

    async def update_user_verification_status(self, email: str, db: db_dependency):
        users_collection: AsyncCollection = db["users"]
        try:
            await users_collection.update_one({"email": email}, {"$set": {"is_verified": True}})
        except Exception as e:
            raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Internal server error")

    async def create_user_account(self, data: UserAccount, db: db_dependency, redis_client: Redis):
        """Method responsible for creating a new user."""
        users_collection: AsyncCollection = db["users"]

        await self.check_username_email_existance(data.username, data.email, db)

        data.password = self.util.generate_passwd_hash(data.password)
        data.is_verified = False  # Intentionally kept False so that account verification could not be bypassed

        try:
            send_email_verifiaction_otp = await self.util.send_otp_for_email_verification(
                data.email, redis_client, db, username=data.username
            )
            if send_email_verifiaction_otp is False:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
            new_user = await users_collection.insert_one(data.model_dump(by_alias=True))
            return new_user
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

    async def verify_otp(self, data: OtpVerificationModel, redis_client: Redis):
        otp_verification = await self.util.verify_otp_for_email_verification(data.email, data.otp, redis_client)
        if otp_verification is False:
            return False
        return True

    async def resend_otp(self, email: EmailStr, redis_client: Redis, db: db_dependency):
        await remove_otp(email, redis_client)
        send_email_verifiaction_otp = await self.util.send_otp_for_email_verification(email, redis_client, db)
        if send_email_verifiaction_otp is False:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

    async def check_user_credentials(self, data: OAuth2PasswordRequestForm, db: db_dependency) -> bool:
        """
        Checks credentials submitted by the user

        Args:
            - data: containing key-value for username and password
            - db: db_dependency
        Returns:
            - bool
        """
        users_collection: AsyncCollection = db["users"]

        try:
            login_user = await users_collection.find_one({"username": data.username.lower()})
        except Exception as e:
            raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
        if login_user is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
        login_user = UserAccount(**login_user)
        user_check = self.util.verify_passwd(data.password, login_user.password)
        if not user_check:
            return False
        return True
