import { ChevronRight } from "lucide-react-native";
import { Text, View } from "react-native";

import { palette } from "@/constants/theme";
import type { Camera } from "@/types";

export function CameraStatusBar({ camera }: { camera: Camera }) {
  const active = camera.status === "online";
  return (
    <View className="flex-row items-center justify-between rounded-card border border-border bg-surface px-4 py-3">
      <View className="flex-row items-center gap-2">
        <Text className="font-mono text-[11px] uppercase tracking-widest text-muted">Estado:</Text>
        <View
          className={`flex-row items-center gap-1.5 rounded-pill px-3 py-1 ${
            active ? "bg-primary/15" : "bg-danger/15"
          }`}
        >
          <View className={`h-2 w-2 rounded-full ${active ? "bg-primary" : "bg-danger"}`} />
          <Text
            className={`font-mono text-[11px] font-bold uppercase ${
              active ? "text-primary" : "text-danger"
            }`}
          >
            {active ? "Activa" : "Inactiva"}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Detecciones:
        </Text>
        <View className="rounded-lg border border-border bg-surface-alt px-2.5 py-1">
          <Text className="font-mono text-sm font-bold text-foreground">{camera.detectionsToday}</Text>
        </View>
        <ChevronRight size={14} color={palette.muted} />
      </View>
    </View>
  );
}
