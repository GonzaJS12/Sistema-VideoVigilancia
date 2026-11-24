import { API_BASE_URL } from "@/config/env";
import { apiRequest } from "@/services/apiClient";
import type { Camera, CameraStream, MonitoringStreamInfo } from "@/types";

export const camerasService = {
  list(): Promise<Camera[]> {
    return apiRequest<Camera[]>("/cameras");
  },

  getById(cameraId: string): Promise<Camera> {
    return apiRequest<Camera>(`/cameras/${cameraId}`);
  },

  getStream(cameraId: string): Promise<CameraStream | null> {
    return apiRequest<CameraStream | null>(`/cameras/${cameraId}/stream`);
  },

  getStreamInfo(cameraId: string): Promise<MonitoringStreamInfo> {
    return apiRequest<MonitoringStreamInfo>(`/monitoring/cameras/${cameraId}/stream-info`);
  },

  getSnapshotPath(cameraId: string, cacheBust?: number): string {
    const suffix = cacheBust ? `?t=${cacheBust}` : "";
    return `/api/v1/cameras/${cameraId}/snapshot${suffix}`;
  },

  getMjpegStreamPath(cameraId: string, token?: string | null, cacheBust?: number): string {
    const params = new URLSearchParams();
    if (token) params.set("token", token);
    if (cacheBust) params.set("t", String(cacheBust));
    const qs = params.toString();
    return `/api/v1/cameras/${cameraId}/mjpeg${qs ? `?${qs}` : ""}`;
  },

  getWsStreamUrl(cameraId: string, token: string): string {
    const wsBase = API_BASE_URL.replace(/^http/i, "ws");
    return `${wsBase}/api/v1/cameras/${cameraId}/ws-stream?token=${encodeURIComponent(token)}&max_width=640&quality=70`;
  },
};
