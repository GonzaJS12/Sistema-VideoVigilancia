import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Clock, MonitorPlay, RefreshCw, TriangleAlert, Video } from "lucide-react-native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { QuickAccessItem } from "@/components/home/QuickAccessItem";
import { StatCard } from "@/components/home/StatCard";
import { Screen } from "@/components/layout/Screen";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { dashboardService } from "@/services/dashboardService";

export default function HomeScreen() {
  const { wsState } = useAuth();
  const {
    data: summary,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => dashboardService.getSummary(),
  });

  const activeCameras = summary?.activeCameras ?? 0;
  const connectedCameras = summary?.connectedCameras ?? 0;
  const totalCameras = summary?.totalCameras ?? 0;
  const pendingAlerts = summary?.pendingAlerts ?? 0;
  const detectionsToday = summary?.detectionsToday ?? 0;
  const online = summary?.online ?? false;
  const hasAlerts = pendingAlerts > 0;

  return (
    <Screen
      refreshing={isRefetching}
      onRefresh={() => {
        void refetch();
      }}
    >
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="font-sans-bold text-3xl text-foreground">Inicio</Text>
          <Text className="mt-1 text-sm text-muted">Resumen del sistema</Text>
        </View>
        <View className="items-end">
          <Text
            className={`mt-2 font-mono text-[11px] uppercase tracking-widest ${
              isError ? "text-danger" : online ? "text-primary" : "text-warning"
            }`}
          >
            {isError ? "Sin conexión" : online ? "Online" : "En espera"}
          </Text>
          <Text className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted">
            WS: {wsState}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="mt-6 items-center justify-center rounded-card border border-border bg-surface py-10">
          <ActivityIndicator color={palette.primary} />
          <Text className="mt-2 text-xs text-muted">Cargando resumen operativo...</Text>
        </View>
      ) : isError ? (
        <View className="mt-6 rounded-card border border-danger/50 bg-danger/10 p-4">
          <Text className="text-sm text-danger">
            {error instanceof Error ? error.message : "No se pudo obtener el resumen del sistema."}
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
      ) : (
        <View className="mt-6 flex-row gap-3">
          <StatCard
            badge={`● ${connectedCameras}/${totalCameras} Online`}
            badgeVariant={connectedCameras > 0 ? "success" : "info"}
            icon={<Video size={16} color={palette.muted} />}
            value={activeCameras}
            label="Cámaras"
            caption={`${detectionsToday} detecciones hoy`}
          />
          <StatCard
            badge={hasAlerts ? "! Pendientes" : "✓ Seguro"}
            badgeVariant={hasAlerts ? "danger" : "info"}
            icon={<TriangleAlert size={16} color={palette.muted} />}
            value={pendingAlerts}
            label="Alertas pendientes"
            caption={hasAlerts ? "Requieren validación" : "Sin incidentes críticos"}
          />
        </View>
      )}

      <View className="mt-8">
        <SectionTitle title="Accesos rápidos" aside="Módulos principales" />
        <View className="mt-4 gap-3">
          <QuickAccessItem
            icon={<MonitorPlay size={22} color={palette.primary} />}
            title="Monitoreo"
            subtitle="Transmisión en tiempo real"
            onPress={() => router.push("/monitoring")}
          />
          <QuickAccessItem
            icon={<TriangleAlert size={22} color={palette.primary} />}
            title="Alertas"
            subtitle="Detección y registros de IA"
            onPress={() => router.push("/alerts")}
          />
          <QuickAccessItem
            icon={<Clock size={22} color={palette.primary} />}
            title="Historial"
            subtitle="Grabaciones y eventos pasados"
            onPress={() => router.push("/history")}
          />
        </View>
      </View>
    </Screen>
  );
}
