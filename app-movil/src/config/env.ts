import { Platform } from "react-native";

function resolveDefaultBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "").replace(/\/api\/v1$/i, "");
  }

  if (typeof __DEV__ !== "undefined" && !__DEV__) {
    throw new Error(
      "EXPO_PUBLIC_API_URL no está configurada. Definí la URL del backend antes de compilar para producción.",
    );
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }
  return "http://localhost:8000";
}

export const API_BASE_URL = resolveDefaultBaseUrl();
export const API_V1_URL = `${API_BASE_URL}/api/v1`;
export const WS_URL = `${API_BASE_URL.replace(/^http/i, "ws")}/api/v1/ws`;

/** Convierte rutas relativas (/api/v1/evidence/...) en URLs absolutas contra el backend. */
export function resolveApiAssetUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
