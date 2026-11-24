import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { Film, Image as ImageIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { resolveApiAssetUrl } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import type { Alert } from "@/types";
import { alertTypeLabel, severityStyle } from "@/utils/alerts";

function ClipPlayer({ uri, headers }: { uri: string; headers?: Record<string, string> }) {
  const player = useVideoPlayer({ uri, headers }, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      contentFit="contain"
      nativeControls
    />
  );
}

export function AlertCaptureViewer({
  alert,
  selectedImageUrl,
}: {
  alert: Alert;
  selectedImageUrl?: string | null;
}) {
  const s = severityStyle[alert.severity];
  const channel = alert.cameraName.replace("Cámara ", "CH-");
  const box = alert.evidence.boundingBox;
  const { accessToken } = useAuth();
  const resolvedImageUrl = resolveApiAssetUrl(selectedImageUrl ?? alert.evidence.snapshotUrl);
  const resolvedClipUrl = resolveApiAssetUrl(alert.evidence.clipUrl);
  const [mode, setMode] = useState<"image" | "clip">("image");
  const authHeaders = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

  return (
    <View className="gap-2">
      {resolvedClipUrl ? (
        <View className="flex-row gap-2 self-end">
          <Pressable
            onPress={() => setMode("image")}
            className={`flex-row items-center gap-1.5 rounded-lg border px-2.5 py-1 ${
              mode === "image" ? "border-primary bg-primary/15" : "border-border bg-surface"
            }`}
          >
            <ImageIcon size={12} color={mode === "image" ? "#00D68F" : "#64748B"} />
            <Text className={`font-mono text-[10px] ${mode === "image" ? "text-primary" : "text-muted"}`}>
              Captura
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("clip")}
            className={`flex-row items-center gap-1.5 rounded-lg border px-2.5 py-1 ${
              mode === "clip" ? "border-primary bg-primary/15" : "border-border bg-surface"
            }`}
          >
            <Film size={12} color={mode === "clip" ? "#00D68F" : "#64748B"} />
            <Text className={`font-mono text-[10px] ${mode === "clip" ? "text-primary" : "text-muted"}`}>
              Video
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View className="aspect-[4/3.3] w-full overflow-hidden rounded-card border border-border bg-[#0A1420]">
        {mode === "clip" && resolvedClipUrl ? (
          <ClipPlayer uri={resolvedClipUrl} headers={authHeaders} />
        ) : (
          <>
            {resolvedImageUrl ? (
              <Image
                source={{ uri: resolvedImageUrl, headers: authHeaders }}
                contentFit="cover"
                style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
              />
            ) : null}

            <View className="absolute left-2.5 top-2.5 rounded-sm border border-primary/50 bg-black/60 px-1.5 py-0.5">
              <Text className="font-mono text-[9px] text-primary">EVIDENCIA [REC]</Text>
            </View>
            <View className="absolute right-2.5 top-2.5 rounded-sm border border-primary/50 bg-black/60 px-1.5 py-0.5">
              <Text className="font-mono text-[9px] text-primary">{channel}</Text>
            </View>

            {box && (
              <View
                className={`absolute rounded-sm border-2 bg-white/5 ${s.borderSolid}`}
                style={{
                  left: `${Math.max(0, Math.min(90, box.x * 100))}%`,
                  top: `${Math.max(0, Math.min(90, box.y * 100))}%`,
                  width: `${Math.max(10, Math.min(100, box.width * 100))}%`,
                  height: `${Math.max(10, Math.min(100, box.height * 100))}%`,
                }}
              >
                <View className={`absolute -top-5 left-[-2px] px-1.5 py-0.5 ${s.strip}`}>
                  <Text className="font-mono text-[9px] font-bold text-white">
                    {box.label} {(alert.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            )}

            <View className="absolute bottom-2.5 left-2.5 rounded-sm border border-border bg-black/60 px-1.5 py-0.5">
              <Text className="font-mono text-[9px] text-white">
                {alertTypeLabel[alert.type].toUpperCase()}
              </Text>
            </View>
            <View className="absolute bottom-2.5 right-2.5 px-1">
              <Text className={`font-mono text-[9px] font-bold uppercase ${s.text}`}>Alerta disparada</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
