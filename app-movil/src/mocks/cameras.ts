import type { Camera } from "@/types";

export const mockCameras: Camera[] = [
  {
    id: "cam-01",
    name: "Cámara 01",
    location: "Acceso Principal Norte",
    status: "online",
    isRecording: true,
    stream: null,
    resolution: "1080p FHD",
    fps: 24,
    latencyMs: 32,
    detectionsToday: 0,
    aiFilters: ["Anomalías", "Personas"],
    lastDetectionAt: null,
  },
  {
    id: "cam-02",
    name: "Cámara 02",
    location: "Patio Trasero",
    status: "online",
    isRecording: true,
    stream: null,
    resolution: "1080p FHD",
    fps: 24,
    latencyMs: 41,
    detectionsToday: 0,
    aiFilters: ["Anomalías", "Personas"],
    lastDetectionAt: null,
  },
];

export const mockSystemSummary = {
  online: true,
  pendingAlerts: 0,
};
