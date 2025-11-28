from fastapi import Depends, HTTPException, status

from ..database.utils_database import db_dependency
from .models_user import (
    GetUsersListRequest,
    UpdateBio,
    UpdateNameRequest,
    UpdatePasswordRequest,
    GetUsersListResponse,
    PaginatedUsersResponse,
)
from pymongo.asynchronous.collection import AsyncCollection
from ..auth.utils_auth import AuthUtils

from ..auth.models_auth import UserAccount

auth_util = AuthUtils()


class UserService:

    def __init__(self):
        pass

    async def update_bio(self, data: UpdateBio, db: db_dependency, user: UserAccount):
        user_collection: AsyncCollection = db.get_collection("users")
        username = user.username

        try:
            await user_collection.update_one({"username": username}, {"$set": {"bio": data.bio}})
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="internal server error")

    async def update_name(self, data: UpdateNameRequest, db: db_dependency, username: str):
        first_name, last_name = (data.first_name, data.last_name)
        user_collection: AsyncCollection = db.get_collection("users")

        try:
            await user_collection.update_one(
                {"username": username}, {"$set": {"first_name": first_name, "last_name": last_name}}
            )
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="internal server error")

    async def update_password(self, data: UpdatePasswordRequest, db: db_dependency, user: UserAccount):
        user_collection: AsyncCollection = db.get_collection("users")

        c_passwd, n_passwd = (data.current_password, data.new_password)

        verify = auth_util.verify_passwd(c_passwd, user.password)
        if not verify:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="wrong current password")

        try:
            await user_collection.update_one(
                {"username": user.username}, {"$set": {"password": auth_util.generate_passwd_hash(n_passwd)}}
            )
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="internal server error")

    async def get_unique_id_and_bio(self, db: db_dependency, user: UserAccount, data: GetUsersListRequest):
        page_size = 20
        user_collection: AsyncCollection = db.get_collection("users")
        query = {}

        query["unique"] = {"$ne": user.unique_id}
        try:
            if data.last_unique_id:
                query = {"unique_id": {"$gt": data.last_unique_id}}

            cursor = user_collection.find(query).sort("unique_id", 1).limit(page_size)
            users = await cursor.to_list(length=page_size)

            users_list = [GetUsersListResponse(unique_id=_user["unique_id"], bio=_user["bio"]) for _user in users]

            last_unique_id = users[-1]["unique_id"] if users else None

            has_more = len(users) == page_size

            return PaginatedUsersResponse(users=users_list, last_unique_id=last_unique_id, has_more=has_more)

        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="internal server error")
