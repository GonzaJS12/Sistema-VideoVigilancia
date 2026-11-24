import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { RefreshCw } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { AlertCard } from "@/components/alerts/AlertCard";
import { AlertFilters, type AlertFilterOption } from "@/components/alerts/AlertFilters";
import { Screen } from "@/components/layout/Screen";
import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { alertsService } from "@/services/alertsService";
import type { AlertSummary } from "@/types";

const pad = (n: number) => String(n).padStart(2, "0");

const predicates: Record<string, (a: AlertSummary) => boolean> = {
  all: () => true,
  critical: (a) => a.severity === "critical",
  firearm: (a) => a.type === "firearm",
  knife: (a) => a.type === "knife",
};

export default function AlertsScreen() {
  const { wsState } = useAuth();
  const [filter, setFilter] = useState("all");

  const { data, isLoading, isRefetching, isError, error, refetch } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => alertsService.list({ page: 1, pageSize: 50 }),
  });

  const alerts = data?.items ?? [];

  const options: AlertFilterOption[] = useMemo(
    () => [
      { key: "all", label: `Todas (${pad(alerts.length)})` },
      { key: "critical", label: `Críticas (${alerts.filter(predicates.critical).length})` },
      { key: "firearm", label: "Armas de fuego" },
      { key: "knife", label: "Armas blancas" },
    ],
    [alerts],
  );

  const visible = alerts.filter(predicates[filter]);
  const active = alerts.filter((a) => a.status === "pending_validation").length;

  return (
    <Screen
      refreshing={isRefetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <View className="flex-row items-start justify-between">
        <View>
          <View className="flex-row items-center gap-2">
            <Text className="font-sans-bold text-3xl text-foreground">Alertas</Text>
            <View className="rounded-pill border border-danger/50 bg-danger/15 px-2.5 py-1">
              <Text className="font-mono text-[10px] font-bold uppercase text-danger">
                {active} Activas
              </Text>
            </View>
          </View>
          <Text className="mt-1 text-sm text-muted">Detecciones registradas</Text>
        </View>
        <View className="mt-1 flex-row items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5">
          <View
            className={`h-1.5 w-1.5 rounded-full ${
              wsState === "open" ? "bg-primary" : "bg-warning"
            }`}
          />
          <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {wsState === "open" ? "Auto-sync" : wsState}
          </Text>
        </View>
      </View>

      <View className="mt-5">
        <AlertFilters options={options} selected={filter} onSelect={setFilter} />
      </View>

      <View className="mt-4 gap-3">
        {isLoading ? (
          <View className="items-center justify-center rounded-card border border-border bg-surface py-10">
            <ActivityIndicator color={palette.primary} />
            <Text className="mt-2 text-xs text-muted">Cargando alertas...</Text>
          </View>
        ) : isError ? (
          <View className="rounded-card border border-danger/50 bg-danger/10 p-4">
            <Text className="text-sm text-danger">
              {error instanceof Error ? error.message : "Error al cargar las alertas."}
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
          <>
            {visible.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onPress={() => router.push({ pathname: "/alerts/[id]", params: { id: alert.id } })}
              />
            ))}
            {visible.length === 0 && (
              <Text className="py-10 text-center text-sm text-muted">Sin alertas para este filtro</Text>
            )}
          </>
        )}
      </View>
    </Screen>
  );
}
