import { router } from "expo-router";
import { Clock, MonitorPlay, TriangleAlert, Video } from "lucide-react-native";
import { Text, View } from "react-native";

import { QuickAccessItem } from "@/components/home/QuickAccessItem";
import { StatCard } from "@/components/home/StatCard";
import { Screen } from "@/components/layout/Screen";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { palette } from "@/constants/theme";
import { mockCameras, mockSystemSummary } from "@/mocks/cameras";

export default function HomeScreen() {
  const activeCameras = mockCameras.filter((c) => c.status === "online").length;
  const { pendingAlerts, online } = mockSystemSummary;
  const hasAlerts = pendingAlerts > 0;

  return (
    <Screen>
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="font-sans-bold text-3xl text-foreground">Inicio</Text>
          <Text className="mt-1 text-sm text-muted">Resumen del sistema</Text>
        </View>
        <Text
          className={`mt-2 font-mono text-[11px] uppercase tracking-widest ${
            online ? "text-primary" : "text-danger"
          }`}
        >
          {online ? "Online" : "Offline"}
        </Text>
      </View>

      <View className="mt-6 flex-row gap-3">
        <StatCard
          badge="● Activas"
          badgeVariant="success"
          icon={<Video size={16} color={palette.muted} />}
          value={activeCameras}
          label="Cámaras"
          caption="Transmisión HD fluida"
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
