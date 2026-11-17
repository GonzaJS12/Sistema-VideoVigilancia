export type AlertType = "firearm" | "knife" | "suspicious_object" | "loitering";

export type AlertSeverity = "critical" | "medium" | "low";

export type AlertStatus =
  | "pending_validation"
  | "confirmed"
  | "false_positive"
  | "archived";

/** Coordenadas normalizadas 0-1 respecto al tamaño de la imagen. */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface AlertFrame {
  id: string;
  offsetSeconds: number;
  imageUrl: string;
}

export interface AlertEvidence {
  snapshotUrl: string;
  clipUrl: string | null;
  frames: AlertFrame[];
  boundingBox: BoundingBox | null;
}

export interface AlertReview {
  reviewerId: string;
  reviewerName: string;
  reviewerShift: string;
  reviewedAt: string | null;
  notes: string;
  notesUpdatedAt: string | null;
}

export interface AlertLinkedDetection {
  id: string;
  yoloClassName: string;
  confidence: number;
  detectedAt: string;
}

export interface AlertReviewHistory {
  id: string;
  action: string;
  actorId: string | null;
  actorName: string;
  decision: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  primaryYoloClass?: string;
  severity: AlertSeverity;
  status: AlertStatus;
  /** 0-1 (98.4% -> 0.984) */
  confidence: number;
  cameraId: string;
  cameraName: string;
  location: string;
  /** ISO 8601 */
  detectedAt: string;
  evidence: AlertEvidence;
  review: AlertReview | null;
  detections?: AlertLinkedDetection[];
  reviewHistory?: AlertReviewHistory[];
  autoProtocol: string | null;
}

/** Resumen ligero para listas (Alertas e Historial). */
export type AlertSummary = Pick<
  Alert,
  | "id"
  | "type"
  | "primaryYoloClass"
  | "severity"
  | "status"
  | "confidence"
  | "cameraId"
  | "cameraName"
  | "location"
  | "detectedAt"
> & { thumbnailUrl: string; boundingBox: BoundingBox | null };

/** Nivel de riesgo asignado a un evento del historial. */
export type RiskLevel = "high" | "medium" | "low";

export type HistoryEntry = AlertSummary & { risk: RiskLevel };
