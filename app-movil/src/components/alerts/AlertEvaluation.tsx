import { Text, View } from "react-native";

import type { AlertReview, AlertStatus } from "@/types";

const statusUi: Record<AlertStatus, { label: string; box: string; dot: string; text: string }> = {
  pending_validation: {
    label: "Pendiente de validación",
    box: "border-caution/50 bg-caution/15",
    dot: "bg-caution",
    text: "text-caution",
  },
  confirmed: {
    label: "Confirmada",
    box: "border-primary/50 bg-primary/15",
    dot: "bg-primary",
    text: "text-primary",
  },
  false_positive: {
    label: "Falsa detección",
    box: "border-border bg-surface-alt",
    dot: "bg-muted",
    text: "text-muted",
  },
  archived: {
    label: "Archivada",
    box: "border-border bg-surface-alt",
    dot: "bg-muted",
    text: "text-muted",
  },
};

function initials(name: string) {
  return name
    .replace("Oficial ", "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface AlertEvaluationProps {
  review: AlertReview | null;
  status: AlertStatus;
}

export function AlertEvaluation({ review, status }: AlertEvaluationProps) {
  const ui = statusUi[status];
  return (
    <View className="flex-row items-center justify-between rounded-card border border-border bg-surface p-3.5">
      <View className="flex-row items-center">
        <View className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-alt">
          <Text className="font-mono text-xs text-foreground">{review ? initials(review.reviewerName) : "--"}</Text>
        </View>
        <View className="ml-3">
          <Text className="font-sans-semibold text-sm text-foreground">
            {review?.reviewerName ?? "Sin asignar"}
          </Text>
          <Text className="text-xs text-muted">{review?.reviewerShift ?? ""}</Text>
        </View>
      </View>
      <View className={`flex-row items-center gap-1.5 rounded-md border px-2.5 py-1.5 ${ui.box}`}>
        <View className={`h-1.5 w-1.5 rounded-full ${ui.dot}`} />
        <Text className={`font-mono text-[10px] ${ui.text}`}>{ui.label}</Text>
      </View>
    </View>
  );
}
