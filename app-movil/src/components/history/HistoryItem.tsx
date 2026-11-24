import { Image } from "expo-image";
import { ChevronRight, Video } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { resolveApiAssetUrl } from "@/config/env";
import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import type { AlertStatus, HistoryEntry, RiskLevel } from "@/types";
import { alertTypeLabel } from "@/utils/alerts";

const risk: Record<RiskLevel, { label: string; box: string; text: string; dot: string; border: string }> = {
  high: {
    label: "Alto",
    box: "border-danger/40 bg-danger/10",
    text: "text-danger",
    dot: "bg-danger",
    border: "border-danger/60",
  },
  medium: {
    label: "Medio",
    box: "border-warning/40 bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
    border: "border-warning/60",
  },
  low: {
    label: "Bajo",
    box: "border-caution/40 bg-caution/10",
    text: "text-caution",
    dot: "bg-caution",
    border: "border-caution/60",
  },
};

const statusDisplay: Record<AlertStatus, { label: string; box: string; text: string }> = {
  confirmed: {
    label: "✓ Resultado: Confirmada",
    box: "border-primary/40 bg-primary/10",
    text: "text-primary",
  },
  false_positive: {
    label: "✕ Resultado: Falsa detección",
    box: "border-border bg-surface-alt",
    text: "text-muted",
  },
  pending_validation: {
    label: "• Estado: Pendiente de validación",
    box: "border-warning/40 bg-warning/10",
    text: "text-warning",
  },
  archived: {
    label: "• Estado: Archivado",
    box: "border-border bg-surface-alt",
    text: "text-muted",
  },
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const time = `${p(d.getHours())}:${p(d.getMinutes())}`;
  const days = Math.round(
    (new Date(now.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 86_400_000,
  );
  if (days === 0) return `Hoy, ${time}`;
  if (days === 1) return `Ayer, ${time}`;
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${p(d.getDate())} ${months[d.getMonth()]}, ${time}`;
}

const tag: Record<string, string> = {
  firearm: "WEAPON",
  knife: "BLADE",
  suspicious_object: "SUSP OBJ",
  loitering: "LOITER",
};

export function HistoryItem({ entry, onPress }: { entry: HistoryEntry; onPress?: () => void }) {
  const r = risk[entry.risk];
  const st = statusDisplay[entry.status];
  const cam = entry.cameraName.replace("Cámara ", "CAM-");
  const { accessToken } = useAuth();
  const thumbnailUrl = resolveApiAssetUrl(entry.thumbnailUrl);

  return (
    <Pressable
      onPress={onPress}
      className="rounded-card border border-border bg-surface p-3.5 active:opacity-80"
    >
      <View className="flex-row">
        <View
          className={`h-[96px] w-[92px] overflow-hidden rounded-xl border bg-[#0A1420] ${r.border}`}
        >
          {thumbnailUrl ? (
            <Image
              source={{
                uri: thumbnailUrl,
                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
              }}
              contentFit="cover"
              style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            />
          ) : null}
          <View className={`absolute left-1.5 top-1.5 rounded-sm border px-1 py-0.5 ${r.box}`}>
            <Text className={`font-mono text-[8px] ${r.text}`}>
              AI: {Math.round(entry.confidence * 100)}%
            </Text>
          </View>
          <View className="absolute bottom-1.5 left-1.5 right-1.5 flex-row justify-between rounded-sm bg-black/55 px-1 py-0.5">
            <Text className={`font-mono text-[7px] ${r.text}`}>[{tag[entry.type]}]</Text>
            <Text className="font-mono text-[7px] text-white/90">{cam}</Text>
          </View>
        </View>

        <View className="ml-3 flex-1">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 font-sans-bold text-base leading-5 text-foreground">
              {alertTypeLabel[entry.type].split(" detectado")[0]}
            </Text>
            <View className="ml-2 flex-row items-center gap-1">
              <Text className="font-mono text-[10px] text-muted">{formatWhen(entry.detectedAt)}</Text>
              <ChevronRight size={14} color={palette.muted} />
            </View>
          </View>
          <View className="mt-1.5 flex-row items-center gap-1.5">
            <Video size={12} color={palette.muted} />
            <Text className="flex-1 text-xs text-muted" numberOfLines={2}>
              {entry.cameraName} - {entry.location}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-3 gap-2 border-t border-border pt-3">
        <View className={`flex-row items-center gap-1.5 self-start rounded-md border px-2 py-1 ${r.box}`}>
          <View className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
          <Text className={`font-mono text-[10px] ${r.text}`}>Riesgo: {r.label}</Text>
        </View>
        <View className={`flex-row items-center gap-1.5 self-start rounded-md border px-2 py-1 ${st.box}`}>
          <Text className={`font-mono text-[10px] ${st.text}`}>{st.label}</Text>
        </View>
      </View>
    </Pressable>
  );
}
