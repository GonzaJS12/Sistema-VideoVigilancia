import type { AlertSeverity, AlertType } from "@/types";

export const alertTypeLabel: Record<AlertType, string> = {
  firearm: "Arma de fuego",
  knife: "Cuchillo",
  suspicious_object: "Objeto potencialmente peligroso",
  loitering: "Merodeo detectado",
};

export const severityLabel: Record<AlertSeverity, string> = {
  critical: "Crítico",
  medium: "Alerta media",
  low: "Alerta baja",
};

/** Clases estáticas (Tailwind necesita verlas completas en el código). */
export const severityStyle: Record<
  AlertSeverity,
  {
    variant: "danger" | "warning" | "caution";
    strip: string;
    border: string;
    borderSolid: string;
    bar: string;
    text: string;
  }
> = {
  critical: {
    variant: "danger",
    strip: "bg-danger",
    border: "border-danger/50",
    borderSolid: "border-danger",
    bar: "bg-danger",
    text: "text-danger",
  },
  medium: {
    variant: "warning",
    strip: "bg-warning",
    border: "border-warning/50",
    borderSolid: "border-warning",
    bar: "bg-warning",
    text: "text-warning",
  },
  low: {
    variant: "caution",
    strip: "bg-caution",
    border: "border-caution/50",
    borderSolid: "border-caution",
    bar: "bg-caution",
    text: "text-caution",
  },
};

export function formatConfidence(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function formatRelative(iso: string) {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const sameDay = new Date(iso).toDateString() === new Date().toDateString();
  return sameDay ? "Hoy" : "Ayer";
}
