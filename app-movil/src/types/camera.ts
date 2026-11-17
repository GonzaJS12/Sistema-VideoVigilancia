export type CameraStatus = "online" | "offline" | "error";

export type StreamProtocol = "hls" | "mjpeg" | "webrtc" | "rtsp";

export type MonitoringState = "monitoreando" | "detenido";

export interface CameraStream {
  protocol: StreamProtocol;
  url: string;
}

export interface Camera {
  id: string;
  code?: string;
  name: string;
  location: string;
  status: CameraStatus;
  isActive?: boolean;
  isRecording: boolean;
  isSimulated?: boolean;
  streamActive?: boolean;
  stream: CameraStream | null;
  resolution: string;
  fps: number;
  latencyMs: number | null;
  detectionsToday: number;
  aiFilters: string[];
  lastDetectionAt: string | null;
  lastConnectedAt?: string | null;
  lastError?: string | null;
}

export interface MonitoringStreamInfo {
  cameraId: string;
  monitoringStatus: MonitoringState;
  connectionStatus: CameraStatus;
  isActive: boolean;
  protocol: StreamProtocol | null;
  webCompatible: boolean;
  transcodingRequired: boolean;
  playbackUrl: string | null;
  snapshotUrl: string | null;
  webDeliveryNote: string;
}
