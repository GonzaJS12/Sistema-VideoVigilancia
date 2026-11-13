import { useLocalSearchParams } from "expo-router";
import { Check, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AlertCaptureViewer } from "@/components/alerts/AlertCaptureViewer";
import { AlertEvaluation } from "@/components/alerts/AlertEvaluation";
import { AlertInfoTable } from "@/components/alerts/AlertInfoTable";
import { FrameStrip } from "@/components/alerts/FrameStrip";
import { ObservationsCard } from "@/components/alerts/ObservationsCard";
import { Screen } from "@/components/layout/Screen";
import { Badge } from "@/components/ui/Badge";
import { palette } from "@/constants/theme";
import { getMockAlertDetail } from "@/mocks/alerts";
import type { AlertStatus } from "@/types";
import { severityLabel, severityStyle } from "@/utils/alerts";

function SectionLabel({ children, aside }: { children: string; aside?: string }) {
  return (
    <View className="mb-2.5 mt-6 flex-row items-center justify-between">
      <Text className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
        {children}
      </Text>
      {aside ? <Text className="font-mono text-[10px] text-muted">{aside}</Text> : null}
    </View>
  );
}

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const alert = getMockAlertDetail(id);
  const [frameId, setFrameId] = useState("F-001");
  const [status, setStatus] = useState<AlertStatus | null>(null);

  if (!alert) {
    return (
      <Screen back>
        <Text className="text-center text-muted">Alerta no encontrada</Text>
      </Screen>
    );
  }

  const s = severityStyle[alert.severity];
  const currentStatus = status ?? alert.status;
  const resolved = currentStatus === "confirmed" || currentStatus === "false_positive";
  const d = new Date(alert.detectedAt);
  const p = (n: number) => String(n).padStart(2, "0");
  const clock = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;

  return (
    <Screen back>
      <View className="flex-row items-start justify-between">
        <Text className="flex-1 font-sans-bold text-2xl text-foreground">Detalles de alerta</Text>
        <Badge label={severityLabel[alert.severity]} variant={s.variant} />
      </View>
      <Text className="mt-1 text-sm text-muted">
        Todos los detalles de alerta procesados por el motor de inferencia
      </Text>

      <SectionLabel aside={`${alert.cameraName.replace("Cámara ", "CAM-")} • ${clock}`}>
        Captura
      </SectionLabel>
      <AlertCaptureViewer alert={alert} />
      <View className="mt-3">
        <FrameStrip frames={alert.evidence.frames} selectedId={frameId} onSelect={setFrameId} />
      </View>

      <SectionLabel>Información</SectionLabel>
      <AlertInfoTable alert={alert} />

      <SectionLabel>Evaluación</SectionLabel>
      <AlertEvaluation review={alert.review} status={currentStatus} />

      <SectionLabel aside="Registro editable">Observaciones</SectionLabel>
      <ObservationsCard notes={alert.review?.notes ?? ""} updatedAt={alert.review?.notesUpdatedAt ?? null} />

      <View className="mt-6 gap-3">
        <Pressable
          disabled={resolved}
          onPress={() => setStatus("confirmed")}
          className={`h-[52px] flex-row items-center justify-center gap-2 rounded-xl bg-danger active:opacity-80 ${
            resolved ? "opacity-40" : ""
          }`}
        >
          <Check size={18} color="#fff" />
          <Text className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            Confirmar detección
          </Text>
        </Pressable>
        <Pressable
          disabled={resolved}
          onPress={() => setStatus("false_positive")}
          className={`h-[52px] flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface active:opacity-80 ${
            resolved ? "opacity-40" : ""
          }`}
        >
          <X size={18} color={palette.muted} />
          <Text className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
            Falsa detección
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
