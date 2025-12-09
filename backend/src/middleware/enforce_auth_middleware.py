from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from redis.asyncio import Redis

from src.redis.jwt_utils_redis import token_in_blocklist

PUBLIC_ROUTES = {
    "/auth/create-user",
    "/auth/resend-otp",
    "/auth/verify-user",
    "/auth/login",
    "/auth/logout",
    "/user/update-bio",
    "/docs",
    "/openapi.json",
}


class EnforceAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, redis_client: Redis):
        super().__init__(app)
        self.redis = redis_client

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        if path in PUBLIC_ROUTES:
            return await call_next(request)

        token = request.cookies.get("access_token")

        if not token:
            return JSONResponse(content={"msg": "unauthorized"}, status_code=401)

        if await token_in_blocklist(token, self.redis):
            return JSONResponse(content={"msg": "unauthorized"}, status_code=401)

        return await call_next(request)
