import json
from ..redis.redis import redis_client
import os
from ..websocket.manager_websocket import ConnectionManager

STREAM = "notifications"
GROUP = "ws_consumers"
CONSUMER = os.getenv("CONSUMER_NAME", "ws-1")
manager = ConnectionManager()

async def notification_consumer():
    while True:
        messages = await redis_client.xreadgroup(GROUP, CONSUMER, streams={STREAM: ">"}, count=10, block=5000)

        if not messages:
            continue

        for stream_name, msgs in messages:
            for msg_id, data in msgs:
                try:
                    event = json.loads(data[b"data"].decode())
                    unique_id = event["unique_id"]
                    await manager.send_to_user(unique_id, event)
                finally:
                    await redis_client.xack(STREAM, GROUP, msg_id)
