import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Check, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert as RNAlert, Pressable, Text, View } from "react-native";

import { AlertCaptureViewer } from "@/components/alerts/AlertCaptureViewer";
import { AlertEvaluation } from "@/components/alerts/AlertEvaluation";
import { AlertInfoTable } from "@/components/alerts/AlertInfoTable";
import { FrameStrip } from "@/components/alerts/FrameStrip";
import { ObservationsCard } from "@/components/alerts/ObservationsCard";
import { Screen } from "@/components/layout/Screen";
import { Badge } from "@/components/ui/Badge";
import { palette } from "@/constants/theme";
import { alertsService } from "@/services/alertsService";
import type { ValidateAlertAction } from "@/types";
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
  const queryClient = useQueryClient();
  const [frameId, setFrameId] = useState("");
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const {
    data: alert,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["alert", id],
    queryFn: () => alertsService.getById(String(id)),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (alert?.evidence.frames.length && !frameId) {
      setFrameId(alert.evidence.frames[0].id);
    }
  }, [alert, frameId]);

  const validateMutation = useMutation({
    mutationFn: (action: ValidateAlertAction) => alertsService.validate(String(id), action),
    onSuccess: (updated) => {
      setFeedbackError(null);
      queryClient.setQueryData(["alert", id], updated);
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      void queryClient.invalidateQueries({ queryKey: ["history"] });
    },
    onError: (err) => {
      setFeedbackError(err instanceof Error ? err.message : "No se pudo validar la alerta.");
    },
  });

  const notesMutation = useMutation({
    mutationFn: (notes: string) => alertsService.updateNotes(String(id), notes),
    onSuccess: (updated) => {
      setFeedbackError(null);
      queryClient.setQueryData(["alert", id], updated);
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (err) => {
      setFeedbackError(err instanceof Error ? err.message : "No se pudieron guardar las notas.");
    },
  });

  const confirmAction = (action: ValidateAlertAction) => {
    const title = action === "confirm" ? "Confirmar detección" : "Marcar falsa detección";
    const msg =
      action === "confirm"
        ? "¿Confirmás que esta alerta corresponde a una amenaza real?"
        : "¿Confirmás marcar esta alerta como falso positivo?";
    RNAlert.alert(title, msg, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Aceptar",
        onPress: () => {
          validateMutation.mutate(action);
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <Screen back>
        <View className="items-center justify-center py-16">
          <ActivityIndicator size="large" color={palette.primary} />
          <Text className="mt-3 text-xs text-muted">Cargando detalle de alerta...</Text>
        </View>
      </Screen>
    );
  }

  if (isError || !alert) {
    return (
      <Screen back>
        <Text className="py-10 text-center text-danger">
          {error instanceof Error ? error.message : "Alerta no encontrada"}
        </Text>
      </Screen>
    );
  }

  const s = severityStyle[alert.severity];
  const resolved = alert.status === "confirmed" || alert.status === "false_positive";
  const d = new Date(alert.detectedAt);
  const p = (n: number) => String(n).padStart(2, "0");
  const clock = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  const selectedFrameUrl =
    alert.evidence.frames.find((f) => f.id === frameId)?.imageUrl ?? alert.evidence.snapshotUrl;

  return (
    <Screen
      back
      refreshing={isRefetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <View className="flex-row items-start justify-between">
        <Text className="flex-1 font-sans-bold text-2xl text-foreground">Detalles de alerta</Text>
        <Badge label={severityLabel[alert.severity]} variant={s.variant} />
      </View>
      <Text className="mt-1 text-sm text-muted">
        Todos los detalles de alerta procesados por el motor de inferencia
      </Text>

      {feedbackError ? (
        <View className="mt-4 rounded-xl border border-danger/50 bg-danger/10 px-3.5 py-2.5">
          <Text className="text-xs text-danger">{feedbackError}</Text>
        </View>
      ) : null}

      <SectionLabel aside={`${alert.cameraName.replace("Cámara ", "CAM-")} • ${clock}`}>
        Captura
      </SectionLabel>
      <AlertCaptureViewer alert={alert} selectedImageUrl={selectedFrameUrl} />
      {alert.evidence.frames.length > 0 ? (
        <View className="mt-3">
          <FrameStrip frames={alert.evidence.frames} selectedId={frameId} onSelect={setFrameId} />
        </View>
      ) : null}

      <SectionLabel>Información</SectionLabel>
      <AlertInfoTable alert={alert} />

      <SectionLabel>Evaluación</SectionLabel>
      <AlertEvaluation review={alert.review} status={alert.status} />

      <SectionLabel aside="Registro editable">Observaciones</SectionLabel>
      <ObservationsCard
        notes={alert.review?.notes ?? ""}
        updatedAt={alert.review?.notesUpdatedAt ?? null}
        saving={notesMutation.isPending}
        onSave={async (notes) => {
          await notesMutation.mutateAsync(notes);
        }}
      />

      {alert.autoProtocol ? (
        <View className="mt-4 rounded-card border border-primary/40 bg-primary/10 px-4 py-3">
          <Text className="font-mono text-[10px] uppercase tracking-widest text-primary">
            Protocolo sugerido
          </Text>
          <Text className="mt-1 text-sm text-foreground">{alert.autoProtocol}</Text>
        </View>
      ) : null}

      {alert.reviewHistory && alert.reviewHistory.length > 0 ? (
        <>
          <SectionLabel aside={`${alert.reviewHistory.length} eventos`}>
            Historial de revisión
          </SectionLabel>
          <View className="gap-2 rounded-card border border-border bg-surface p-3.5">
            {alert.reviewHistory.map((item) => (
              <View key={item.id} className="border-b border-border/60 pb-2 last:border-b-0 last:pb-0">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-medium text-xs text-foreground">{item.actorName}</Text>
                  <Text className="font-mono text-[10px] text-muted">
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
                <Text className="mt-0.5 font-mono text-[10px] uppercase text-primary">
                  {item.decision ?? item.action}
                </Text>
                {item.notes ? <Text className="mt-1 text-xs text-muted">{item.notes}</Text> : null}
              </View>
            ))}
          </View>
        </>
      ) : null}

      <View className="mt-6 gap-3">
        <Pressable
          disabled={resolved || validateMutation.isPending}
          onPress={() => confirmAction("confirm")}
          className={`h-[52px] flex-row items-center justify-center gap-2 rounded-xl bg-danger active:opacity-80 ${
            resolved || validateMutation.isPending ? "opacity-40" : ""
          }`}
        >
          <Check size={18} color="#fff" />
          <Text className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            {validateMutation.isPending ? "Procesando..." : "Confirmar detección"}
          </Text>
        </Pressable>
        <Pressable
          disabled={resolved || validateMutation.isPending}
          onPress={() => confirmAction("false_positive")}
          className={`h-[52px] flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface active:opacity-80 ${
            resolved || validateMutation.isPending ? "opacity-40" : ""
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
