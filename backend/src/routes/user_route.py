import time
from fastapi import APIRouter, Depends, status
from ..database.utils_database import db_dependency

from ..auth.utils_auth import AuthUtils
from ..auth.models_auth import UserAccount

from ..user.models_user import UpdateBio, UpdateNameRequest, UpdatePasswordRequest, GetUsersListResponse, GetUsersListRequest
from ..user.service_user import UserService
from ..user.models_user import GetUserResponse

router = APIRouter(prefix="/user", tags=["User"])
auth_util = AuthUtils()


class UserRoutes:

    user_service = UserService()

    @staticmethod
    @router.post("/update/{key}", status_code=status.HTTP_200_OK)
    async def update(key: str, db: db_dependency, data: UpdateNameRequest | UpdatePasswordRequest, user=Depends(auth_util.get_current_user)):
        if key == "fullName":
            try:
                username: str = user.username
                await UserRoutes.user_service.update_name(data, db, username)
            except Exception as e:
                raise e
        elif key == "password":
            await UserRoutes.user_service.update_password(data, db, user)

    @staticmethod
    @router.get("/get-user", response_model=GetUserResponse)
    async def get_user(user: UserAccount = Depends(auth_util.get_current_user)):
        return user.model_dump()
    
    @staticmethod
    @router.post("/update-bio")
    async def update_bio(data: UpdateBio, db: db_dependency, user: UserAccount = Depends(auth_util.get_current_user)):
        await UserRoutes.user_service.update_bio(data, db, user)

    @staticmethod
    @router.post("/get-users-for-home")
    async def get_users_for_home_page(data: GetUsersListRequest, db: db_dependency, user: UserAccount = Depends(auth_util.get_current_user)):
        return await UserRoutes.user_service.get_unique_id_and_bio(db, user, data)