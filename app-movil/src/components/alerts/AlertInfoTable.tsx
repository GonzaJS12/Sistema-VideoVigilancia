import type { ReactNode } from "react";
import { Text, View } from "react-native";

import type { Alert } from "@/types";
import { alertTypeLabel, formatConfidence, severityStyle } from "@/utils/alerts";

function Row({ label, children, last }: { label: string; children: ReactNode; last?: boolean }) {
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3.5 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <Text className="text-sm text-muted">{label}</Text>
      <View className="ml-4 flex-1 items-end">{children}</View>
    </View>
  );
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  const sameDay = d.toDateString() === new Date().toDateString();
  const day = sameDay ? "Hoy" : `${p(d.getDate())}/${p(d.getMonth() + 1)}`;
  return `${day}, ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} UTC-3`;
}

export function AlertInfoTable({ alert }: { alert: Alert }) {
  const s = severityStyle[alert.severity];
  return (
    <View className="overflow-hidden rounded-card border border-border bg-surface">
      <Row label="Tipo de amenaza">
        <View className="flex-row items-center gap-2">
          <View className={`h-2 w-2 rounded-full ${s.strip}`} />
          <Text className="font-sans-semibold text-sm text-foreground">
            {alertTypeLabel[alert.type].split(" detectado")[0]}
          </Text>
        </View>
      </Row>
      <Row label="Ubicación">
        <Text className="font-mono text-xs text-foreground">
          {alert.cameraName} - {alert.location}
        </Text>
      </Row>
      <Row label="Confianza IA">
        <View className="flex-row items-center gap-2">
          <View className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-alt">
            <View className="h-full rounded-full bg-primary" style={{ width: `${alert.confidence * 100}%` }} />
          </View>
          <Text className="font-mono text-xs font-bold text-primary">
            {formatConfidence(alert.confidence)}
          </Text>
        </View>
      </Row>
      <Row label="Fecha y hora">
        <Text className="font-mono text-xs text-foreground">{formatDateTime(alert.detectedAt)}</Text>
      </Row>
      <Row label="Protocolo automático" last>
        {alert.autoProtocol ? (
          <View className="rounded-md border border-caution/50 bg-caution/15 px-2 py-1">
            <Text className="font-mono text-[11px] text-caution">{alert.autoProtocol}</Text>
          </View>
        ) : (
          <Text className="font-mono text-xs text-muted">Ninguno</Text>
        )}
      </Row>
    </View>
  );
}
