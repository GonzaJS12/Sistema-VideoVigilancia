import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { AlertCard } from "@/components/alerts/AlertCard";
import { AlertFilters, type AlertFilterOption } from "@/components/alerts/AlertFilters";
import { ResponseProtocolCard } from "@/components/alerts/ResponseProtocolCard";
import { Screen } from "@/components/layout/Screen";
import { mockAlerts } from "@/mocks/alerts";
import type { AlertSummary } from "@/types";

const pad = (n: number) => String(n).padStart(2, "0");

const predicates: Record<string, (a: AlertSummary) => boolean> = {
  all: () => true,
  critical: (a) => a.severity === "critical",
  firearm: (a) => a.type === "firearm",
  knife: (a) => a.type === "knife",
};

export default function AlertsScreen() {
  const [filter, setFilter] = useState("all");

  const options: AlertFilterOption[] = useMemo(
    () => [
      { key: "all", label: `Todas (${pad(mockAlerts.length)})` },
      { key: "critical", label: `Críticas (${mockAlerts.filter(predicates.critical).length})` },
      { key: "firearm", label: "Armas de fuego" },
      { key: "knife", label: "Armas blancas" },
    ],
    [],
  );

  const visible = mockAlerts.filter(predicates[filter]);
  const active = mockAlerts.filter((a) => a.status === "pending_validation").length;

  return (
    <Screen>
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
          <View className="h-1.5 w-1.5 rounded-full bg-primary" />
          <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Auto-sync
          </Text>
        </View>
      </View>

      <View className="mt-5">
        <AlertFilters options={options} selected={filter} onSelect={setFilter} />
      </View>

      <View className="mt-4 gap-3">
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
      </View>

      <View className="mt-5">
        <ResponseProtocolCard code="COD-SEC-9" />
      </View>
    </Screen>
  );
}
