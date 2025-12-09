from contextlib import asynccontextmanager
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.server_api import ServerApi
from typing import Annotated
from fastapi import Depends, FastAPI, Request
import os
import asyncio

from ..redis.redis import redis_client
from ..user.notification_user import notification_consumer
from src import settings

STREAM = "notifications"
GROUP = "ws_consumers"
CONSUMER = os.getenv("CONSUMER_NAME", "ws-1")
# user_service = UserService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create global Mongo client once
    client = AsyncMongoClient(settings.PYMONGO_URI)
    db = client[settings.PYMONGO_DB]

    app.state.client = client
    app.state.db = db

    # Redis Notification Flow
    try:
        await redis_client.xgroup_create(STREAM, GROUP, mkstream=True)
    except Exception:
        pass
    
    task = asyncio.create_task(notification_consumer())
    
    print("DB Connected")
    print("Notification system started")

    yield
    await client.close()
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass
    await redis_client.close()
    print("DB Closed")


# async def collection_creator(db: AsyncDatabase):
#     existing = await db.list_collection_names()
#     if "users" not in existing:
#         await db.create_collection("users")

async def get_db(request: Request):
    return request.app.state.db

db_dependency = Annotated[AsyncDatabase, Depends(get_db)]
