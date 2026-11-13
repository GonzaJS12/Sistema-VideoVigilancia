import { LinearGradient } from "expo-linear-gradient";
import { Camera as CameraIcon, Maximize, Mic } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { Camera } from "@/types";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatUtc(date: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${p(date.getUTCMonth() + 1)}-${p(date.getUTCDate())} ${p(
    date.getUTCHours(),
  )}:${p(date.getUTCMinutes())}:${p(date.getUTCSeconds())} UTC`;
}

function SignalBars() {
  return (
    <View className="ml-2 flex-row items-end gap-[2px]">
      {[6, 9, 12].map((h) => (
        <View key={h} style={{ height: h }} className="w-[3px] rounded-sm bg-primary" />
      ))}
    </View>
  );
}

interface CameraViewerProps {
  camera: Camera;
}

/**
 * Visor de cámara. En el Paso 5 el placeholder se reemplaza por <VideoPlayer />
 * (expo-video) manteniendo los overlays encima.
 */
export function CameraViewer({ camera }: CameraViewerProps) {
  const now = useClock();
  const code = camera.name.replace("Cámara ", "CAM-");

  return (
    <View className="overflow-hidden rounded-card border border-border bg-surface">
      <View className="aspect-[4/3.2] w-full overflow-hidden bg-[#0A1420]">
        <LinearGradient
          colors={["#0A1420", "#0F1C2B", "#0B141F"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Zona de detección (mock) */}
        <View className="absolute left-[18%] top-[28%] h-[44%] w-[62%] items-center justify-center rounded-sm border border-dashed border-primary/60 bg-primary/5">
          <View className="h-6 w-10 border border-primary/30" />
        </View>
        <View className="absolute left-[18%] top-[24%] rounded-sm bg-primary px-1.5 py-0.5">
          <Text className="font-mono text-[9px] text-[#0B0F17]">ZONA SEGURA • 98.4%</Text>
        </View>

        {/* Superior izquierda */}
        <View className="absolute left-3 top-3 flex-row items-center rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5">
          {camera.isRecording && (
            <>
              <View className="h-2 w-2 rounded-full bg-danger" />
              <Text className="ml-1.5 font-mono text-[11px] font-bold text-danger">REC</Text>
            </>
          )}
          <Text className="ml-2 font-mono text-[11px] text-white">
            {code} | {camera.fps} FPS
          </Text>
        </View>

        {/* Superior derecha */}
        <View className="absolute right-3 top-3 flex-row items-center rounded-lg border border-primary/40 bg-black/60 px-2.5 py-1.5">
          <Text className="font-mono text-[11px] text-primary">{camera.resolution}</Text>
          <SignalBars />
        </View>

        {/* Inferior izquierda */}
        <View className="absolute bottom-3 left-3 flex-row items-center rounded-lg border border-primary/30 bg-black/60 px-2.5 py-1.5">
          <Text className="font-mono text-[10px] text-primary">IA ACTIVA • </Text>
          <Text className="font-mono text-[10px] text-white">{formatUtc(now)}</Text>
        </View>

        {/* Controles */}
        <View className="absolute bottom-3 right-3 flex-row gap-4 rounded-lg border border-white/10 bg-black/60 px-3 py-2">
          <Pressable hitSlop={8}>
            <Mic size={16} color="#fff" />
          </Pressable>
          <Pressable hitSlop={8}>
            <CameraIcon size={16} color="#fff" />
          </Pressable>
          <Pressable hitSlop={8}>
            <Maximize size={16} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-border px-4 py-3">
        <Text className="text-xs text-muted">
          Ubicación: <Text className="font-sans-medium text-sm text-foreground">{camera.location}</Text>
        </Text>
        {camera.latencyMs !== null && (
          <View className="flex-row items-center">
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