export type CameraStatus = "online" | "offline" | "error";

/** Pendiente de definir con backend. Se resuelve en el Paso 5. */
export type StreamProtocol = "hls" | "mjpeg" | "webrtc";

export interface CameraStream {
  protocol: StreamProtocol;
  url: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: CameraStatus;
  isRecording: boolean;
  stream: CameraStream | null;
  resolution: string;
  fps: number;
  latencyMs: number | null;
  detectionsToday: number;
  aiFilters: string[];
  lastDetectionAt: string | null;
}
