from datetime import timedelta
import os
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from backend import settings

from ..database.utils_database import db_dependency
from ..auth.models_auth import UserAccount, UserLogin
from .models_route import CreateUserResponse
from ..auth.service_auth import UserServices
from ..auth.utils_auth import AuthUtils
from ..database.redis_databse import add_jti_to_blocklist

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class Authentication:

    user_service = UserServices()
    util = AuthUtils()

    @staticmethod
    @router.post("/create_user", response_model=CreateUserResponse)
    async def create_user(data: UserAccount, db: db_dependency):
        new_user = await Authentication.user_service.create_user_account(data=data, db=db)
        new_user = await Authentication.user_service.get_user_by_id(new_user.inserted_id, db)
        return new_user

    @staticmethod
    @router.post("/login")
    async def user_login(db: db_dependency, response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
        login_user = await Authentication.user_service.check_user_credentials(form_data, db)

        if login_user:
            access_token = Authentication.util.create_access_token(
                {"username": form_data.username},
                expires_delta=timedelta(minutes=settings.TOKEN_EXPIRY_TIME),
            )
            response.set_cookie(
                "access_token",
                access_token,
                httponly=True,
                secure=True,
                samesite="lax",
                max_age=settings.TOKEN_EXPIRY_TIME * 60,
            )

        else:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Invalid credentials")

    @staticmethod
    @router.get("/logout")
    async def revoke_token(request: Request):
        access_token = request.cookies.get("access_token")
        if not access_token:
            pass
        else:
            await add_jti_to_blocklist(access_token)
            
            return JSONResponse(
                content={
                    "message": "Logged out successfully"
                },
                status_code=status.HTTP_200_OK
            )




