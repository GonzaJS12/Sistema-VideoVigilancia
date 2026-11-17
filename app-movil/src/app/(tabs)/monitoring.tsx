import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { CameraSelector } from "@/components/cameras/CameraSelector";
import { CameraStatusBar } from "@/components/cameras/CameraStatusBar";
import { CameraViewer } from "@/components/cameras/CameraViewer";
import { LastDetectionCard } from "@/components/cameras/LastDetectionCard";
import { Screen } from "@/components/layout/Screen";
import { palette } from "@/constants/theme";
import { camerasService } from "@/services/camerasService";

export default function MonitoringScreen() {
  const {
    data: cameras = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cameras"],
    queryFn: () => camerasService.list(),
  });

  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    if (cameras.length > 0 && !cameras.some((c) => c.id === selectedId)) {
      setSelectedId(cameras[0].id);
    }
  }, [cameras, selectedId]);

  const camera = cameras.find((c) => c.id === selectedId) ?? cameras[0] ?? null;

  return (
    <Screen
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="font-sans-bold text-3xl text-foreground">Monitoreo</Text>
          <Text className="mt-1 text-sm text-muted">Seleccioná una cámara para visualizarla</Text>
        </View>
        <Pressable
          onPress={() => {
            void refetch();
          }}
          disabled={isFetching}
          className="h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 active:opacity-70"
        >
          {isFetching ? (
            <ActivityIndicator size="small" color={palette.primary} />
          ) : (
            <RefreshCw size={18} color={palette.primary} />
          )}
        </Pressable>
      </View>

      {isLoading ? (
        <View className="mt-8 items-center justify-center rounded-card border border-border bg-surface py-12">
          <ActivityIndicator color={palette.primary} />
          <Text className="mt-2 text-xs text-muted">Cargando cámaras...</Text>
        </View>
      ) : isError ? (
        <View className="mt-6 rounded-card border border-danger/50 bg-danger/10 p-4">
          <Text className="text-sm text-danger">
            {error instanceof Error ? error.message : "No se pudieron cargar las cámaras."}
          </Text>
          <Pressable
            onPress={() => {
              void refetch();
            }}
            className="mt-3 flex-row items-center gap-1.5 self-start rounded-lg border border-danger/40 bg-surface px-3 py-1.5"
          >
            <RefreshCw size={14} color={palette.danger} />
            <Text className="font-mono text-[11px] text-danger">Reintentar</Text>
          </Pressable>
        </View>
      ) : !camera ? (
        <View className="mt-8 items-center justify-center rounded-card border border-border bg-surface p-6">
          <Text className="text-sm text-muted">No hay cámaras registradas en el backend.</Text>
        </View>
      ) : (
        <View className="mt-5 gap-4">
          <CameraViewer camera={camera} />
          <CameraSelector cameras={cameras} selectedId={camera.id} onSelect={setSelectedId} />
          <CameraStatusBar camera={camera} />
          <LastDetectionCard camera={camera} />
        </View>
      )}
    </Screen>
  );
}
