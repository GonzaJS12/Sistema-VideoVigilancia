import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { WS_URL } from "@/config/env";
import { tokenStorage } from "@/services/tokenStorage";
import type { SocketConnectionState, SocketEvent } from "@/types";

export function useRealtimeSocket(
  isAuthenticated: boolean,
  accessToken: string | null = null,
): SocketConnectionState {
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] = useState<SocketConnectionState>("closed");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let active = true;
    let attempt = 0;

    const cleanupTimers = () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (pingTimerRef.current) {
        clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }
    };

    const closeSocket = () => {
      cleanupTimers();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };

    if (!isAuthenticated) {
      closeSocket();
      setConnectionState("closed");
      return;
    }

    const connect = async () => {
      if (!active || wsRef.current) return;

      const token = accessToken ?? (await tokenStorage.getAccessToken());
      if (!token || !active) {
        setConnectionState("closed");
        return;
      }

      setConnectionState("connecting");
      const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!active) return;
        attempt = 0;
        setConnectionState("open");
        pingTimerRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping");
          }
        }, 30_000);
      };

      ws.onmessage = (event) => {
        if (!active || typeof event.data !== "string") return;
        if (event.data === "pong") return;

        try {
          const parsed = JSON.parse(event.data) as SocketEvent;
          if (parsed.type === "alert.created" || parsed.type === "alert.updated") {
            void queryClient.invalidateQueries({ queryKey: ["alerts"] });
            void queryClient.invalidateQueries({ queryKey: ["alert", parsed.payload.id] });
            void queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
            void queryClient.invalidateQueries({ queryKey: ["history"] });
          } else if (parsed.type === "camera.status") {
            void queryClient.invalidateQueries({ queryKey: ["cameras"] });
            void queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
          }
        } catch {
          // Ignora mensajes no JSON
        }
      };

      ws.onerror = () => {
        if (!active) return;
        setConnectionState("error");
      };

      ws.onclose = () => {
        cleanupTimers();
        wsRef.current = null;
        if (!active) return;
        setConnectionState("closed");

        const delayMs = Math.min(1000 * 2 ** attempt, 30_000);
        attempt += 1;
        reconnectTimerRef.current = setTimeout(() => {
          void connect();
        }, delayMs);
      };
    };

    void connect();

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === "active" && active && !wsRef.current) {
        attempt = 0;
        void connect();
      }
    };
    const subscription = AppState.addEventListener("change", handleAppState);

    return () => {
      active = false;
      subscription.remove();
      closeSocket();
    };
  }, [isAuthenticated, accessToken, queryClient]);

  return connectionState;
}
