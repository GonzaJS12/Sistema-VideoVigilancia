import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Calendar, RefreshCw, Zap } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { HistoryItem } from "@/components/history/HistoryItem";
import { Pagination } from "@/components/history/Pagination";
import { Screen } from "@/components/layout/Screen";
import { Select, type SelectOption } from "@/components/ui/Select";
import { palette } from "@/constants/theme";
import { historyService } from "@/services/historyService";
import type { AlertType } from "@/types";

const PAGE_SIZE = 5;

const dateOptions: SelectOption[] = [
  { value: "all", label: "Todas las fechas" },
  { value: "today", label: "Hoy" },
  { value: "week", label: "Últimos 7 días" },
  { value: "older", label: "Más de 7 días" },
];

const typeOptions: SelectOption[] = [
  { value: "all", label: "Todos los tipos" },
  { value: "firearm", label: "Arma de fuego" },
  { value: "knife", label: "Cuchillo" },
  { value: "suspicious_object", label: "Objeto sospechoso" },
  { value: "loitering", label: "Merodeo" },
];

function computeDateBounds(range: string): { dateFrom?: string; dateTo?: string } {
  const now = new Date();
  if (range === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { dateFrom: start.toISOString() };
  }
  if (range === "week") {
    const start = new Date(now.getTime() - 7 * 86_400_000);
    return { dateFrom: start.toISOString() };
  }
  if (range === "older") {
    const end = new Date(now.getTime() - 7 * 86_400_000);
    return { dateTo: end.toISOString() };
  }
  return {};
}

export default function HistoryScreen() {
  const [date, setDate] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);

  const dateBounds = useMemo(() => computeDateBounds(date), [date]);

  const { data, isLoading, isRefetching, isError, error, refetch } = useQuery({
    queryKey: ["history", date, type, page],
    queryFn: () =>
      historyService.list({
        type: type === "all" ? undefined : (type as AlertType),
        dateFrom: dateBounds.dateFrom,
        dateTo: dateBounds.dateTo,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const shown = Math.min(page * PAGE_SIZE, total);

  return (
    <Screen
      refreshing={isRefetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <View className="flex-row items-center gap-2">
        <View className="h-6 w-1 rounded-full bg-primary" />
        <View>
          <Text className="font-sans-bold text-3xl text-foreground">Historial</Text>
        </View>
      </View>
      <Text className="mt-1 text-sm text-muted">Registro de detecciones anteriores</Text>

      <View className="mt-5 flex-row gap-3 rounded-card border border-border bg-surface p-4">
        <Select
          label="Fecha"
          options={dateOptions}
          value={date}
          onChange={(v) => {
            setDate(v);
            setPage(1);
          }}
          icon={<Calendar size={12} color={palette.primary} />}
        />
        <Select
          label="Tipo de objeto"
          options={typeOptions}
          value={type}
          onChange={(v) => {
            setType(v);
            setPage(1);
          }}
          icon={<Zap size={12} color={palette.primary} />}
        />
      </View>

      <View className="mt-4 gap-3">
        {isLoading ? (
          <View className="items-center justify-center rounded-card border border-border bg-surface py-10">
            <ActivityIndicator color={palette.primary} />
            <Text className="mt-2 text-xs text-muted">Cargando historial...</Text>
          </View>
        ) : isError ? (
          <View className="rounded-card border border-danger/50 bg-danger/10 p-4">
            <Text className="text-sm text-danger">
              {error instanceof Error ? error.message : "No se pudo cargar el historial."}
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
            {items.map((e) => (
              <HistoryItem
                key={e.id}
                entry={e}
                onPress={() => router.push({ pathname: "/alerts/[id]", params: { id: e.id } })}
              />
            ))}
            {items.length === 0 && (
              <Text className="py-10 text-center text-sm text-muted">Sin registros para estos filtros</Text>
            )}
          </>
        )}
      </View>

      <View className="mt-5">
        <Pagination
          shown={shown}
          total={total}
          hasPrev={page > 1}
          hasNext={page < pageCount}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      </View>
    </Screen>
  );
}
