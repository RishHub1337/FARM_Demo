from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Cookie

from ..redis.jwt_utils_redis import token_in_blocklist
from ..websocket.manager import manager
from ..redis.redis import redis_client
from jose import JWTError, jwt
from ..auth.service_auth import UserServices
from  src import settings
from ..database.utils_database import db_dependency
from ..auth.models_auth import UserAccount
from ..auth.utils_auth import AuthUtils


util = UserServices()
auth_util = AuthUtils()

router = APIRouter(prefix="/ws", tags=["Websocket"])


@router.websocket("/")
async def websocket_endpoint(
    websocket: WebSocket, access_token: str | None = Cookie(default=None)
):
    # print(">>> WS CONNECTED for unique_id:", unique_id)

    token = access_token
    print(">>> Token received:", token)

    # after JWT decode:
    db = websocket.app.state.db

    if not token or await token_in_blocklist(token, redis_client):
        await websocket.close(code=1008)
        return

    user = jwt.decode(token, settings.SECRET)
    username = user["username"]
    print(">>> Authenticated user:", username)

    user = await util.get_user_by_username(username, db)

    unique_id = user.get("unique_id")
    print(">>> This connection will register under unique_id:", unique_id)

    print(unique_id)

    await manager.connect(unique_id, websocket)
    print(">>> Connection stored in manager:", manager.active)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(unique_id, websocket)
