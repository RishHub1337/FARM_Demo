from pydantic import BaseModel, Field, EmailStr

class CreateUserResponse(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    