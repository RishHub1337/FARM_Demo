from redis.asyncio import Redis

OTP_EXPIRY = 180

async def store_otp(otp: int, email: str, redis_client: Redis) -> None:
    key_name = f"otp:{email}"
    await redis_client.set(name=key_name, value=otp, ex=OTP_EXPIRY)

async def get_otp(email: str, redis_client: Redis) -> int:
    key_name = f"otp:{email}"
    otp = await redis_client.get(key_name)
    return otp

async def verify_otp(email: str, submitted_otp: int, redis_client: Redis) -> bool:
    key_name = f"otp:{email}"
    real_otp = await redis_client.get(key_name)
    
    if real_otp is None:
        return False
    
    return int(real_otp) == submitted_otp

async def remove_otp(email: str, redis_client: Redis) -> None:
    key_name = f"otp:{email}"
    await redis_client.delete(key_name)