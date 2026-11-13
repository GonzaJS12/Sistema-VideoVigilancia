import { Calendar, Zap } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { HistoryItem } from "@/components/history/HistoryItem";
import { Pagination } from "@/components/history/Pagination";
import { Screen } from "@/components/layout/Screen";
import { Select, type SelectOption } from "@/components/ui/Select";
import { palette } from "@/constants/theme";
import { mockHistory } from "@/mocks/history";

const PAGE_SIZE = 3;

const dateOptions: SelectOption[] = [
  { value: "all", label: "Todas las fechas" },
  { value: "today", label: "Hoy" },
  { value: "week", label: "Últimos 7 días" },
  { value: "older", label: "Más antiguos" },
];

const typeOptions: SelectOption[] = [
  { value: "all", label: "Todos los tipos" },
  { value: "firearm", label: "Arma de fuego" },
  { value: "knife", label: "Cuchillo" },
  { value: "suspicious_object", label: "Objeto sospechoso" },
];

const daysAgo = (iso: string) => (Date.now() - new Date(iso).getTime()) / 86_400_000;

export default function HistoryScreen() {
  const [date, setDate] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () =>
      mockHistory.filter((e) => {
        const d = daysAgo(e.detectedAt);
        const dateOk =
          date === "all" ||
          (date === "today" && new Date(e.detectedAt).toDateString() === new Date().toDateString()) ||
          (date === "week" && d <= 7) ||
          (date === "older" && d > 7);
        return dateOk && (type === "all" || e.type === type);
      }),
    [date, type],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const items = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const shown = Math.min((current + 1) * PAGE_SIZE, filtered.length);

  return (
    <Screen>
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
            setPage(0);
          }}
          icon={<Calendar size={12} color={palette.primary} />}
        />
        <Select
          label="Tipo de objeto"
          options={typeOptions}
          value={type}
          onChange={(v) => {
            setType(v);
            setPage(0);
          }}
          icon={<Zap size={12} color={palette.primary} />}
        />
      </View>

      <View className="mt-4 gap-3">
        {items.map((e) => (
          <HistoryItem key={e.id} entry={e} />
        ))}
        {items.length === 0 && (
          <Text className="py-10 text-center text-sm text-muted">Sin registros para estos filtros</Text>
        )}
      </View>

      <View className="mt-5">
        <Pagination
          shown={shown}
          total={filtered.length}
          hasPrev={current > 0}
          hasNext={current < pageCount - 1}
          onPrev={() => setPage(current - 1)}
          onNext={() => setPage(current + 1)}
        />
      </View>
    </Screen>
  );
}
