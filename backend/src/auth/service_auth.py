from typing import Any
from ..database.utils_database import db_dependency
from pymongo.asynchronous.collection import AsyncCollection
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from .models_auth import UserAccount, UserLogin
from .utils_auth import AuthUtils


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

    async def create_user_account(self, data: UserAccount, db: db_dependency):
        users_collection: AsyncCollection = db["users"]

        await self.check_username_email_existance(data.username, data.email, db)

        data.password = self.util.generate_passwd_hash(data.password)

        try:
            new_user = await users_collection.insert_one(data.model_dump(by_alias=True))
            return new_user
        except Exception as e:
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
