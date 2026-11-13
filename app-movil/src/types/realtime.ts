import type { AlertSummary } from "./alert";
import type { CameraStatus } from "./camera";

export type SocketEvent =
  | { type: "alert.created"; payload: AlertSummary }
  | { type: "alert.updated"; payload: AlertSummary }
  | { type: "camera.status"; payload: { cameraId: string; status: CameraStatus } };

export type SocketConnectionState = "connecting" | "open" | "closed" | "error";
