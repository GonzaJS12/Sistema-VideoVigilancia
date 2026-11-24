import Constants from "expo-constants";
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

  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.hostname) {
    const h = window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname;
    return `http://${h}:8000`;
  }

  // Detecta automáticamente la IP LAN de la PC donde corre Metro/Expo (ej. 192.168.100.222)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0]?.trim();
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:8000`;
    }
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }
  return "http://127.0.0.1:8000";
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
