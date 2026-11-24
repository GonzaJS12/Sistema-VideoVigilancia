import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { RefreshCw, VideoOff } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";

import { resolveApiAssetUrl } from "@/config/env";
import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { camerasService } from "@/services/camerasService";
import type { Camera } from "@/types";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatLocalTime(date: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())} ${p(
    date.getHours(),
  )}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}

function SignalBars({ online }: { online: boolean }) {
  return (
    <View className="ml-2 flex-row items-end gap-[2px]">
      {[6, 9, 12].map((h) => (
        <View
          key={h}
          style={{ height: h }}
          className={`w-[3px] rounded-sm ${online ? "bg-primary" : "bg-muted/40"}`}
        />
      ))}
    </View>
  );
}

function HlsStreamPlayer({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

interface CameraViewerProps {
  camera: Camera;
}

export function CameraViewer({ camera }: CameraViewerProps) {
  const now = useClock();
  const { accessToken } = useAuth();
  const [tick, setTick] = useState(() => Date.now());
  const [snapshotError, setSnapshotError] = useState(false);

  const { data: streamInfo, isLoading: loadingInfo } = useQuery({
    queryKey: ["camera-stream-info", camera.id],
    queryFn: () => camerasService.getStreamInfo(camera.id),
    refetchInterval: 10_000,
  });

  const isMonitoring = streamInfo?.monitoringStatus === "monitoreando";
  const isOnline = camera.status === "online";
  const isHls = streamInfo?.protocol === "hls" && Boolean(streamInfo.playbackUrl);
  const isWebMjpeg = Platform.OS === "web" && !isHls && (isOnline || isMonitoring);
  const useNativeWsStream = Platform.OS !== "web" && !isHls && (isOnline || isMonitoring) && Boolean(accessToken);

  const [wsFrameUri, setWsFrameUri] = useState<string | null>(null);
  const [prevWsFrameUri, setPrevWsFrameUri] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setSnapshotError(false);
    setWsFrameUri(null);
    setPrevWsFrameUri(null);
    setTick(Date.now());
  }, [camera.id]);

  // Stream continuo por WebSocket de baja latencia para móvil nativo (sin polling HTTP por frame)
  useEffect(() => {
    if (!useNativeWsStream || !accessToken) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    let active = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connectWs = () => {
      if (!active) return;
      const url = camerasService.getWsStreamUrl(camera.id, accessToken);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onmessage = (ev) => {
        if (!active || typeof ev.data !== "string") return;
        if (ev.data.startsWith("data:image/")) {
          setSnapshotError(false);
          setWsFrameUri((current) => {
            if (current) setPrevWsFrameUri(current);
            return ev.data;
          });
        }
      };

      ws.onerror = () => {
        ws.close();
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (!active) return;
        reconnectTimer = setTimeout(connectWs, 800);
      };
    };

    connectWs();

    return () => {
      active = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [useNativeWsStream, accessToken, camera.id, tick]);

  const ackNextWsFrame = () => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("next");
    }
  };

  const code = camera.code ?? camera.name.replace("Cámara ", "CAM-");
  const mjpegUrl = isWebMjpeg
    ? resolveApiAssetUrl(camerasService.getMjpegStreamPath(camera.id, accessToken, tick))
    : null;

  return (
    <View className="overflow-hidden rounded-card border border-border bg-surface">
      <View className="aspect-[4/3.2] w-full items-center justify-center overflow-hidden bg-[#0A1420]">
        {loadingInfo ? (
          <View className="items-center gap-2">
            <ActivityIndicator color={palette.primary} />
            <Text className="font-mono text-[10px] text-muted">Conectando stream...</Text>
          </View>
        ) : isHls && streamInfo?.playbackUrl ? (
          <HlsStreamPlayer url={streamInfo.playbackUrl} />
        ) : mjpegUrl && !snapshotError ? (
          <Image
            source={{ uri: mjpegUrl }}
            contentFit="cover"
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            onError={() => setSnapshotError(true)}
          />
        ) : useNativeWsStream && wsFrameUri ? (
          <>
            {prevWsFrameUri && prevWsFrameUri !== wsFrameUri ? (
              <Image
                source={{ uri: prevWsFrameUri }}
                contentFit="cover"
                transition={0}
                style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
              />
            ) : null}
            <Image
              source={{ uri: wsFrameUri }}
              transition={0}
              contentFit="cover"
              style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
              onLoad={ackNextWsFrame}
            />
          </>
        ) : useNativeWsStream && !snapshotError ? (
          <View className="items-center gap-2">
            <ActivityIndicator color={palette.primary} />
            <Text className="font-mono text-[10px] text-muted">Recibiendo video en tiempo real...</Text>
          </View>
        ) : (
          <View className="items-center px-6 text-center">
            <VideoOff size={28} color={palette.muted} />
            <Text className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
              {isOnline ? "Vista previa no disponible" : "Sin señal"}
            </Text>
            <Text className="mt-1 text-center text-[11px] text-muted/80">
              {camera.lastError ?? streamInfo?.webDeliveryNote ?? "Cámara fuera de línea."}
            </Text>
          </View>
        )}

        {/* Superior izquierda */}
        <View className="absolute left-3 top-3 flex-row items-center rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5">
          {camera.isRecording && (
            <>
              <View className="h-2 w-2 rounded-full bg-danger" />
              <Text className="ml-1.5 font-mono text-[11px] font-bold text-danger">REC</Text>
            </>
          )}
          <Text className="ml-1 font-mono text-[11px] text-white">
            {code} | {camera.fps} FPS
          </Text>
        </View>

        {/* Superior derecha */}
        <View className="absolute right-3 top-3 flex-row items-center rounded-lg border border-primary/40 bg-black/60 px-2.5 py-1.5">
          <Text className="font-mono text-[11px] text-primary">{camera.resolution}</Text>
          <SignalBars online={isOnline} />
        </View>

        {/* Inferior izquierda */}
        <View className="absolute bottom-3 left-3 flex-row items-center rounded-lg border border-primary/30 bg-black/60 px-2.5 py-1.5">
          <Text
            className={`font-mono text-[10px] ${
              isMonitoring ? "text-primary" : "text-warning"
            }`}
          >
            {isMonitoring ? "IA ACTIVA • " : "DETENIDA • "}
          </Text>
          <Text className="font-mono text-[10px] text-white">{formatLocalTime(now)}</Text>
        </View>

        {/* Botón de refresco manual de frame */}
        {!isHls && (
          <Pressable
            onPress={() => {
              setSnapshotError(false);
              setTick(Date.now());
            }}
            hitSlop={8}
            className="absolute bottom-3 right-3 rounded-lg border border-white/10 bg-black/60 p-2 active:opacity-70"
          >
            <RefreshCw size={15} color="#fff" />
          </Pressable>
        )}
      </View>

      <View className="flex-row items-center justify-between border-t border-border px-4 py-3">
        <Text className="flex-1 text-xs text-muted" numberOfLines={1}>
          Ubicación: <Text className="font-sans-medium text-sm text-foreground">{camera.location}</Text>
        </Text>
        {camera.latencyMs !== null && (
          <View className="ml-2 flex-row items-center">
            <View className="h-1.5 w-1.5 rounded-full bg-accent" />
            <Text className="ml-1.5 font-mono text-[10px] uppercase text-accent">
              Latencia {camera.latencyMs}ms
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
