import { ChevronRight, Clock, Video } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { palette } from "@/constants/theme";
import type { AlertSummary } from "@/types";
import {
  alertTypeLabel,
  formatConfidence,
  formatRelative,
  formatTime,
  severityLabel,
  severityStyle,
} from "@/utils/alerts";

import { AlertThumbnail } from "./AlertThumbnail";

interface AlertCardProps {
  alert: AlertSummary;
  onPress?: () => void;
}

export function AlertCard({ alert, onPress }: AlertCardProps) {
  const s = severityStyle[alert.severity];
  const cameraCode = alert.cameraName.replace("Cámara ", "CAM-");
  const archived = alert.status === "archived";
  const timeLabel = formatTime(alert.detectedAt);

  return (
    <Pressable
      onPress={onPress}
      className={`overflow-hidden rounded-card border bg-surface active:opacity-80 ${s.border}`}
    >
      <View className={`absolute bottom-0 left-0 top-0 w-1 ${s.strip}`} />
      <View className="flex-row items-center p-3 pl-4">
        <AlertThumbnail
          cameraCode={cameraCode}
          severity={alert.severity}
          boundingBox={alert.boundingBox}
          thumbnailUrl={alert.thumbnailUrl}
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 font-sans-bold text-base text-foreground" numberOfLines={1}>
              {alertTypeLabel[alert.type].split(" detectado")[0]}
            </Text>
            <Badge label={severityLabel[alert.severity]} variant={s.variant} />
          </View>

          <View className="mt-1.5 flex-row items-center gap-1.5">
            <Video size={13} color={palette.primary} />
            <Text className="flex-1 text-xs text-foreground/90" numberOfLines={1}>
              {alert.cameraName} - {alert.location}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-[11px] text-muted">Confianza IA</Text>
            <Text className={`font-mono text-[11px] font-bold ${s.text}`}>
              {formatConfidence(alert.confidence)}
            </Text>
          </View>
          <View className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-alt">
            <View
              className={`h-full rounded-full ${s.bar}`}
              style={{ width: `${alert.confidence * 100}%` }}
            />
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Clock size={11} color={palette.muted} />
              <Text className="font-mono text-[10px] text-muted">{timeLabel}</Text>
            </View>
            <Text className="font-mono text-[10px] text-muted">
              {archived ? "Archivado" : formatRelative(alert.detectedAt)}
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color={palette.muted} />
      </View>
    </Pressable>
  );
}
