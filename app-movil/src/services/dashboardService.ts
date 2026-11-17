import { apiRequest } from "@/services/apiClient";
import type { DashboardSummary } from "@/types";

export const dashboardService = {
  getSummary(): Promise<DashboardSummary> {
    return apiRequest<DashboardSummary>("/dashboard/summary");
  },
};
