import json
from typing import Set, Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, Set[WebSocket]] = {}

    async def connect(self, unique_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active.setdefault(unique_id, set()).add(websocket)

    def disconnect(self, unique_id: str, websocket: WebSocket) -> None:
        conns = self.active.get(unique_id)
        if not conns:
            return
        conns.discard(websocket)
        if not conns:
            self.active.pop(unique_id, None)

    async def send_to_user(self, unique_id: str, message: dict) -> None:
        conns = self.active.get(unique_id)
        if not conns:
            return
        dead = []
        text = json.dumps(message)
        for ws in list(conns):
            try:
                await ws.send_text(text)
            except Exception:
                dead.append(ws)
        
        for ws in dead:
            self.disconnect(unique_id, ws)
