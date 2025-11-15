from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os


class Settings(BaseSettings):
    PYMONGO_URI: str 
    PYMONGO_DB: str 

    SECRET: str 
    TOKEN_EXPIRY_TIME: int 

    REDIS_HOST: str 
    REDIS_PORT: int 
    REDIS_USERNAME: str 
    REDIS_PASSWORD: str 

    SMTP_SERVER: str
    SMTP_PORT: int
    SMTP_PASSWORD: str

    class Config:
        env_file = ".env"
        extra = "ignore"
