import { Image } from "expo-image";
import { Text, View } from "react-native";

import { resolveApiAssetUrl } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import type { AlertSeverity, BoundingBox } from "@/types";
import { severityStyle } from "@/utils/alerts";

interface AlertThumbnailProps {
  cameraCode: string;
  severity: AlertSeverity;
  boundingBox: BoundingBox | null;
  thumbnailUrl?: string | null;
}

export function AlertThumbnail({
  cameraCode,
  severity,
  boundingBox,
  thumbnailUrl,
}: AlertThumbnailProps) {
  const s = severityStyle[severity];
  const { accessToken } = useAuth();
  const resolvedUrl = resolveApiAssetUrl(thumbnailUrl);

  return (
    <View className="h-[88px] w-[84px] overflow-hidden rounded-xl border border-border bg-[#0A1420]">
      {resolvedUrl ? (
        <Image
          source={{
            uri: resolvedUrl,
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
          }}
          contentFit="cover"
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />
      ) : null}
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
