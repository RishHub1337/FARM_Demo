from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
import uuid

class UserAuthBase(BaseModel):

    @field_validator("email", mode="before", check_fields=False)
    def normalize_email(cls, value: str):
        return value.lower().strip()

    @field_validator("username", mode="before", check_fields=False)
    def normalize_username(cls, value: str):
        return value.lower().strip()


class UserAccount(UserAuthBase):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    username: str
    password: str
    first_name: str
    last_name: str
    email: EmailStr
    is_verified: bool = Field(default=False)
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    unique_id: Optional[str] = Field(default=None)
    bio: Optional[str] = Field(default=None)


class UserLogin(UserAuthBase):
    username: str
    password: str

class OtpVerificationModel(UserAuthBase):
    otp: int
    email: EmailStr

class ResendOtpModel(UserAuthBase):
    email: EmailStr