from redis.asyncio import Redis
import redis

JTI_EXPIRY = 3600

async def add_jti_to_blocklist(jti: str, redis_client: Redis) -> None:
    await redis_client.set(name=jti, value="", ex=JTI_EXPIRY)


async def token_in_blocklist(jti: str, redis_client: Redis) -> bool:
    try:
        jti = await redis_client.get(jti)
    except redis.DataError:
        pass
    return jti is not None
