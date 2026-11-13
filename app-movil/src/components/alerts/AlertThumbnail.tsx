import { Text, View } from "react-native";

import type { AlertSeverity, BoundingBox } from "@/types";
import { severityStyle } from "@/utils/alerts";

interface AlertThumbnailProps {
  cameraCode: string;
  severity: AlertSeverity;
  boundingBox: BoundingBox | null;
}

/** Miniatura de evidencia. En el Paso 5 usa <Image source={thumbnailUrl} /> de expo-image. */
export function AlertThumbnail({ cameraCode, severity, boundingBox }: AlertThumbnailProps) {
  const s = severityStyle[severity];
  return (
    <View className="h-[88px] w-[84px] overflow-hidden rounded-xl border border-border bg-[#0A1420]">
      <View className="absolute left-1.5 top-1.5 flex-row items-center">
        <View className="h-1.5 w-1.5 rounded-full bg-danger" />
        <Text className="ml-1 font-mono text-[7px] text-white">REC</Text>
      </View>
      <Text className="absolute right-1.5 top-1.5 font-mono text-[7px] text-white/70">
        {cameraCode}
      </Text>
      {boundingBox && (
        <View
          className={`absolute left-[14%] top-[28%] h-[44%] w-[72%] items-center justify-center rounded-sm border border-dashed ${s.border} bg-white/5`}
        >
          <Text className={`font-mono text-[8px] ${s.text}`}>{boundingBox.label}</Text>
        </View>
      )}
    </View>
  );
}
