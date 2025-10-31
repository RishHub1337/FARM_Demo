from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.server_api import ServerApi
from typing import Annotated
from fastapi import Depends
import os

from backend import settings


async def collection_creator(db: AsyncDatabase):
    existing = await db.list_collection_names()
    if "users" not in existing:
        await db.create_collection("users")


async def get_db():
    URI = settings.PYMONGO_URI
    DB_NAME = settings.PYMONGO_DB
    client = AsyncMongoClient(URI, server_api=ServerApi("1"))
    db = client[DB_NAME]

    # Initialize collections
    await collection_creator(db)

    try:
        yield db
    finally:
        await client.close()


db_dependency = Annotated[AsyncDatabase, Depends(get_db)]
