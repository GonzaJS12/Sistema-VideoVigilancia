import { apiRequest } from "@/services/apiClient";
import type {
  AlertSeverity,
  AlertStatus,
  AlertType,
  HistoryEntry,
  Paginated,
} from "@/types";

export interface HistoryQueryParams {
  cameraId?: string;
  type?: AlertType;
  severity?: AlertSeverity;
  status?: AlertStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "detected_at" | "confidence" | "severity";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export const historyService = {
  list(params: HistoryQueryParams = {}): Promise<Paginated<HistoryEntry>> {
    return apiRequest<Paginated<HistoryEntry>>("/history", {
      query: {
        camera_id: params.cameraId,
        type: params.type,
        severity: params.severity,
        status: params.status,
        date_from: params.dateFrom,
        date_to: params.dateTo,
        sort_by: params.sortBy ?? "detected_at",
        order: params.order ?? "desc",
        page: params.page ?? 1,
        page_size: params.pageSize ?? 5,
      },
    });
  },
};
