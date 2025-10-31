import redis.asyncio as redis
from backend import settings
from redis.exceptions import DataError

JTI_EXPIRY = 3600

token_blocklist = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0, decode_responses=True, username=settings.REDIS_USERNAME, password=settings.REDIS_PASSWORD)


async def add_jti_to_blocklist(jti: str) -> None:
    await token_blocklist.set(name=jti, value="", ex=JTI_EXPIRY)

async def token_in_blocklist(jti: str) -> bool:
    try:
        jti = await token_blocklist.get(jti)    
    except DataError:
        pass
    return jti is not None
