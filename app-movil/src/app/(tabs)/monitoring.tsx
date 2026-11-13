import { RefreshCw } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { CameraSelector } from "@/components/cameras/CameraSelector";
import { CameraStatusBar } from "@/components/cameras/CameraStatusBar";
import { CameraViewer } from "@/components/cameras/CameraViewer";
import { LastDetectionCard } from "@/components/cameras/LastDetectionCard";
import { Screen } from "@/components/layout/Screen";
import { palette } from "@/constants/theme";
import { mockCameras } from "@/mocks/cameras";

export default function MonitoringScreen() {
  const [selectedId, setSelectedId] = useState(mockCameras[0].id);
  const camera = mockCameras.find((c) => c.id === selectedId) ?? mockCameras[0];

  return (
    <Screen>
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="font-sans-bold text-3xl text-foreground">Monitoreo</Text>
          <Text className="mt-1 text-sm text-muted">Seleccioná una cámara para visualizarla</Text>
        </View>
        <Pressable className="h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 active:opacity-70">
          <RefreshCw size={18} color={palette.primary} />
        </Pressable>
      </View>

      <View className="mt-5 gap-4">
        <CameraViewer camera={camera} />
        <CameraSelector cameras={mockCameras} selectedId={selectedId} onSelect={setSelectedId} />
        <CameraStatusBar camera={camera} />
        <LastDetectionCard camera={camera} />
      </View>
    </Screen>
  );
}
