from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, Request, Response

from src.auth.models_auth import UserAccount
from src.database.utils_database import db_dependency
from src.database.utils_database import lifespan

from src.routes.auth_route import router as auth_router
from src.routes.user_route import router as user_router
from src.routes.websocket_route import router as websocket_router

from src.middleware.autoRefresh_middleware import AutoRefreshSessionMiddleWare
from src.middleware.enforce_auth_middleware import EnforceAuthMiddleware

from src.auth.utils_auth import AuthUtils

from src.redis.redis import redis_client

from fastapi.middleware.cors import CORSMiddleware

# import uvicorn
from dotenv import load_dotenv
import os
from pathlib import Path

util = AuthUtils()

app = FastAPI(title="Crawler backend", lifespan=lifespan)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(websocket_router)
app.add_middleware(EnforceAuthMiddleware, redis_client=redis_client)
app.add_middleware(AutoRefreshSessionMiddleWare)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def hello_server(current_user: UserAccount = Depends(util.get_current_user)):
    return {"msg": "I am live!"}


@app.get("/testPush")
async def test_push(db: db_dependency):
    users_collection = db["users"]
    await users_collection.insert_one({"title": "Ya Ya"})
