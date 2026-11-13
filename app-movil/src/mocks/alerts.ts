import type { Alert, AlertSummary } from "@/types";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

const box = (label: string) => ({ x: 0.25, y: 0.25, width: 0.5, height: 0.5, label });

export const mockAlerts: AlertSummary[] = [
  {
    id: "alt-001",
    type: "firearm",
    severity: "critical",
    status: "pending_validation",
    confidence: 0.984,
    cameraId: "cam-01",
    cameraName: "Cámara 01",
    location: "Entrada principal",
    detectedAt: minutesAgo(4),
    thumbnailUrl: "",
    boundingBox: box("GUN 96%"),
  },
  {
    id: "alt-002",
    type: "knife",
    severity: "medium",
    status: "pending_validation",
    confidence: 0.921,
    cameraId: "cam-02",
    cameraName: "Cámara 02",
    location: "Aula 01",
    detectedAt: minutesAgo(180),
    thumbnailUrl: "",
    boundingBox: box("KNIFE 92%"),
  },
  {
    id: "alt-003",
    type: "firearm",
    severity: "critical",
    status: "archived",
    confidence: 0.968,
    cameraId: "cam-03",
    cameraName: "Cámara 03",
    location: "Aula 03",
    detectedAt: minutesAgo(60 * 20),
    thumbnailUrl: "",
    boundingBox: box("GUN 96%"),
  },
  {
    id: "alt-004",
    type: "loitering",
    severity: "low",
    status: "pending_validation",
    confidence: 0.845,
    cameraId: "cam-04",
    cameraName: "Cámara 04",
    location: "Estacionamiento",
    detectedAt: minutesAgo(35),
    thumbnailUrl: "",
    boundingBox: box("LOITER 84%"),
  },
];

const frameOffsets = [-0.5, -0.2, -0.1, 0, 0.2, 0.5];

/** Mock de GET /alerts/:id. En el Paso 5 se reemplaza por alerts.api.ts */
export function getMockAlertDetail(id: string): Alert | undefined {
  const s = mockAlerts.find((a) => a.id === id);
  if (!s) return undefined;
  const pending = s.status === "pending_validation";
  return {
    id: s.id,
    type: s.type,
    severity: s.severity,
    status: s.status,
    confidence: s.confidence,
    cameraId: s.cameraId,
    cameraName: s.cameraName,
    location: s.location,
    detectedAt: s.detectedAt,
    evidence: {
      snapshotUrl: "",
      clipUrl: null,
      boundingBox: s.boundingBox,
      frames: frameOffsets.map((o, i) => ({
        id: `F-${String(i + 1).padStart(3, "0")}`,
        offsetSeconds: o,
        imageUrl: "",
      })),
    },
    review: {
      reviewerId: "usr-rossi",
      reviewerName: "Oficial M. Rossi",
      reviewerShift: "Guardia turno 2",
      reviewedAt: pending ? null : s.detectedAt,
      notes:
        "Sujeto con vestimenta oscura detectado desenfundando artefacto con empuñadura metálica en pasillo B-3. Protocolo perimetral activado preventivamente.",
      notesUpdatedAt: minutesAgo(2),
    },
    autoProtocol: s.severity === "critical" ? "Bloqueo de torniquetes" : null,
  };
}
