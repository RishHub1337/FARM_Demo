from fastapi import Depends, FastAPI, Request, Response

from src.auth.models_auth import UserAccount
from src.database.utils_database import db_dependency
from src.routes.auth_route import router as auth_router
from src.middleware.autoRefresh_middleware import AutoRefreshSessionMiddleWare
from src.auth.utils_auth import AuthUtils

from fastapi.middleware.cors import CORSMiddleware

# import uvicorn
from dotenv import load_dotenv
import os
from pathlib import Path

util = AuthUtils()

app = FastAPI(title="Crawler backend")
app.include_router(auth_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173/",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AutoRefreshSessionMiddleWare)

@app.get("/")
async def hello_server(current_user: UserAccount = Depends(util.get_current_user)):
    return {"msg": "I am live!"}

@app.get("/testPush")
async def test_push(db: db_dependency):
    users_collection = db['users']
    await users_collection.insert_one({
        'title': "Ya Ya"
    })
