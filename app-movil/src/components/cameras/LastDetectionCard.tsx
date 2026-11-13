import { Check, ShieldCheck } from "lucide-react-native";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { palette } from "@/constants/theme";
import type { Camera } from "@/types";

export function LastDetectionCard({ camera }: { camera: Camera }) {
  const hasDetection = camera.lastDetectionAt !== null;
  return (
    <Card className="p-0">
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-sans-semibold text-base text-foreground">Última detección</Text>
              <View className="rounded-md bg-surface-alt px-1.5 py-0.5">
                <Text className="font-mono text-[10px] text-muted">HOY</Text>
              </View>
            </View>
            <View className="mt-3 flex-row items-center gap-2">
              <ShieldCheck size={16} color={palette.primary} />
              <Text className="text-sm text-muted">
                {hasDetection ? "Detección registrada" : "Sin detecciones registradas"}
              </Text>
            </View>
          </View>
          <View className="h-10 w-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/10">
            <Check size={18} color={palette.primary} />
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-between border-t border-border px-4 py-3">
        <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Filtro IA: {camera.aiFilters.join(" & ")}
        </Text>
        <Text className="font-mono text-[10px] uppercase tracking-widest text-primary">Normal</Text>
      </View>
    </Card>
  );
}
