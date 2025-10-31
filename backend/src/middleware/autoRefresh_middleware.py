from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

from backend import settings
from ..auth.utils_auth import AuthUtils
from jose import jwt


class AutoRefreshSessionMiddleWare(BaseHTTPMiddleware):
    util = AuthUtils()

    async def dispatch(self, request: Request, call_next):
        access_token = request.cookies.get("access_token")
        response: Response = await call_next(request)

        if access_token:
            try:
                if response.body == {"message": "Logged out successfully"}:
                    pass
                else:
                    payload = jwt.decode(access_token, settings.SECRET)
                    username = payload.get("username")
                    if username:
                        new_token = self.util.create_access_token({"username": username})
                        response.set_cookie(
                            "access_token",
                            new_token,
                            httponly=True,
                            secure=True,
                            samesite="lax",
                            max_age=settings.TOKEN_EXPIRY_TIME * 60,
                        )
            except Exception:
                pass

        return response
