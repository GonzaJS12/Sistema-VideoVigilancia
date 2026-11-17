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
};
