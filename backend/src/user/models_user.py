from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, Field

class UpdateNameRequest(BaseModel):
    first_name: str = Field(..., min_length=3, max_length=12)
    last_name: str = Field(..., min_length=3, max_length=12)

class UpdatePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class UpdateBio(BaseModel):
    bio: str = Field(..., min_length=3, max_length=225)

class GetUsersListRequest(BaseModel):
    last_unique_id: Optional[str]

# Responses

class GetUserResponse(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    unique_id: str
    bio: str


class GetUsersListResponse(BaseModel):
    unique_id: str
    bio: str

class PaginatedUsersResponse(BaseModel):
    users: list[GetUsersListResponse]
    last_unique_id: str
    has_more: bool
