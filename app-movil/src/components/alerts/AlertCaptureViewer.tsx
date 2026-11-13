import { Text, View } from "react-native";

import type { Alert } from "@/types";
import { severityStyle } from "@/utils/alerts";

/** Captura de evidencia con bounding box. En el Paso 5: <Image source={snapshotUrl} />. */
export function AlertCaptureViewer({ alert }: { alert: Alert }) {
  const s = severityStyle[alert.severity];
  const channel = alert.cameraName.replace("Cámara ", "CH-");
  const box = alert.evidence.boundingBox;

  return (
    <View className="aspect-[4/3.3] w-full overflow-hidden rounded-card border border-border bg-[#0A1420]">
      <View className="absolute left-2.5 top-2.5 rounded-sm border border-primary/50 bg-black/60 px-1.5 py-0.5">
        <Text className="font-mono text-[9px] text-primary">LIVE FEED [REC] • 1080p FHD</Text>
      </View>
      <View className="absolute right-2.5 top-2.5 rounded-sm border border-primary/50 bg-black/60 px-1.5 py-0.5">
        <Text className="font-mono text-[9px] text-primary">FPS: 30.0 • {channel}</Text>
      </View>

      {box && (
        <View
          className={`absolute left-[20%] top-[22%] h-[52%] w-[60%] rounded-sm border-2 bg-white/5 ${s.borderSolid}`}
        >
          <View className={`absolute -top-5 left-[-2px] px-1.5 py-0.5 ${s.strip}`}>
            <Text className="font-mono text-[9px] font-bold text-white">
              {box.label} {(alert.confidence * 100).toFixed(1)}%
            </Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <View className="h-px w-8 bg-white/30" />
            <View className="absolute h-8 w-px bg-white/30" />
          </View>
          <Text className="absolute bottom-1 left-1.5 font-mono text-[7px] text-white/60">
            X:412 Y:269 W:94 H:78
          </Text>
        </View>
      )}

      <View className="absolute bottom-2.5 left-2.5 rounded-sm border border-border bg-black/60 px-1.5 py-0.5">
        <Text className="font-mono text-[9px] text-white">OBJ: PISTOLA 9MM</Text>
      </View>
      <View className="absolute bottom-2.5 right-2.5 px-1">
        <Text className={`font-mono text-[9px] font-bold uppercase ${s.text}`}>Alerta disparada</Text>
      </View>
    </View>
  );
}
