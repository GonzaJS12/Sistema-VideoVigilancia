import type { AlertStatus, AlertType, HistoryEntry, RiskLevel } from "@/types";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const box = (label: string) => ({ x: 0.25, y: 0.25, width: 0.5, height: 0.5, label });

function entry(
  n: number,
  type: AlertType,
  risk: RiskLevel,
  status: AlertStatus,
  confidence: number,
  cam: number,
  location: string,
  minutes: number,
  label: string,
): HistoryEntry {
  return {
    id: `hst-${String(n).padStart(3, "0")}`,
    type,
    severity: risk === "high" ? "critical" : risk === "medium" ? "medium" : "low",
    risk,
    status,
    confidence,
    cameraId: `cam-0${cam}`,
    cameraName: `Cámara 0${cam}`,
    location,
    detectedAt: minutesAgo(minutes),
    thumbnailUrl: "",
    boundingBox: box(label),
  };
}

export const mockHistory: HistoryEntry[] = [
  entry(1, "firearm", "high", "confirmed", 0.98, 1, "Aula 1", 60 * 3, "WEAPON"),
  entry(2, "knife", "high", "false_positive", 0.74, 2, "Aula 1", 60 * 30, "BLADE"),
  entry(3, "suspicious_object", "medium", "confirmed", 0.82, 3, "Aula 2", 60 * 24 * 2, "SUSP OBJ"),
  entry(4, "firearm", "high", "confirmed", 0.95, 1, "Acceso Norte", 60 * 24 * 3, "WEAPON"),
  entry(5, "knife", "medium", "confirmed", 0.88, 4, "Estacionamiento", 60 * 24 * 4, "BLADE"),
  entry(6, "suspicious_object", "low", "false_positive", 0.61, 2, "Patio Trasero", 60 * 24 * 6, "SUSP OBJ"),
  entry(7, "firearm", "high", "false_positive", 0.69, 3, "Aula 3", 60 * 24 * 9, "WEAPON"),
];
