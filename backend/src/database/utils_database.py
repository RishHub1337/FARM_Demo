from contextlib import asynccontextmanager
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.server_api import ServerApi
from typing import Annotated
from fastapi import Depends, FastAPI, Request

from src import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create global Mongo client once
    client = AsyncMongoClient(settings.PYMONGO_URI)
    db = client[settings.PYMONGO_DB]

    app.state.client = client
    app.state.db = db

    print("DB Connected")
    yield
    await client.close()
    print("DB Closed")


# async def collection_creator(db: AsyncDatabase):
#     existing = await db.list_collection_names()
#     if "users" not in existing:
#         await db.create_collection("users")

async def get_db(request: Request):
    return request.app.state.db

db_dependency = Annotated[AsyncDatabase, Depends(get_db)]
