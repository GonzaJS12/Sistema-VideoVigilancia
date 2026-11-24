import { apiRequest } from "@/services/apiClient";
import type {
  Alert,
  AlertFilters,
  AlertSummary,
  Paginated,
  ValidateAlertAction,
} from "@/types";

export const alertsService = {
  list(filters: AlertFilters & { cameraId?: string } = {}): Promise<Paginated<AlertSummary>> {
    return apiRequest<Paginated<AlertSummary>>("/alerts", {
      query: {
        type: filters.type,
        severity: filters.severity,
        status: filters.status,
        camera_id: filters.cameraId,
        date_from: filters.dateFrom,
        date_to: filters.dateTo,
        page: filters.page ?? 1,
        page_size: filters.pageSize ?? 50,
      },
    });
  },

  getById(alertId: string): Promise<Alert> {
    return apiRequest<Alert>(`/alerts/${alertId}`);
  },

  validate(alertId: string, action: ValidateAlertAction): Promise<Alert> {
    return apiRequest<Alert>(`/alerts/${alertId}/validate`, {
      method: "PATCH",
      body: { action },
    });
  },

  updateNotes(alertId: string, notes: string): Promise<Alert> {
    return apiRequest<Alert>(`/alerts/${alertId}/notes`, {
      method: "PATCH",
      body: { notes },
    });
  },
};
