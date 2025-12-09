import { useEffect, useRef, useState } from "react";
import { UNSAFE_useFogOFWarDiscovery } from "react-router-dom";

export default function useNotification() {
  const wsRef = useRef(null);
  const [message, setMessage] = useState([]);

  useEffect(() => {

    const ws = new WebSocket(
      `ws://localhost:8000/ws/`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("ws connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("Received:", msg);
        setMessage((prev) => [...prev, msg]);
      } catch (e) {
        console.error("Invalid WS message", event.data);
      }
    };
    ws.onclose = () => {
      console.log("WS Closed - attempting reconnect in 2s.");
      setTimeout(() => {
        wsRef.current = new WebSocket(
          `ws://localhost:8000/ws/`
        );
      }, 2000);
    };
    return () => ws.close();
  },);
  return message;
}
