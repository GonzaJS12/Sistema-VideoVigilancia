import { API_V1_URL } from "@/config/env";
import { tokenStorage } from "@/services/tokenStorage";
import type { AuthSession } from "@/types";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code = "api_error") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type SessionExpiredListener = () => void;
type TokenRefreshedListener = (accessToken: string) => void;

let onSessionExpiredListener: SessionExpiredListener | null = null;
let onTokenRefreshedListener: TokenRefreshedListener | null = null;
let refreshInFlight: Promise<string | null> | null = null;

export function setOnSessionExpired(listener: SessionExpiredListener | null): void {
  onSessionExpiredListener = listener;
}

export function setOnTokenRefreshed(listener: TokenRefreshedListener | null): void {
  onTokenRefreshedListener = listener;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean;
  timeoutMs?: number;
  _retried?: boolean;
}

function buildUrl(
  path: string,
  query?: Record<string, string | number | boolean | undefined | null>,
): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_V1_URL}${normalized}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function parseErrorPayload(response: Response): Promise<{ detail: string; code: string }> {
  try {
    const data = (await response.json()) as { detail?: unknown; code?: unknown };
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : `Error HTTP ${response.status}`;
    const code = typeof data.code === "string" ? data.code : "http_error";
    return { detail, code };
  } catch {
    return { detail: `Error HTTP ${response.status}`, code: "http_error" };
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      await tokenStorage.clearTokens();
      onSessionExpiredListener?.();
      return null;
    }

    try {
      const response = await fetch(`${API_V1_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        await tokenStorage.clearTokens();
        onSessionExpiredListener?.();
        return null;
      }

      const session = (await response.json()) as AuthSession;
      await tokenStorage.saveTokens(session.accessToken, session.refreshToken);
      onTokenRefreshedListener?.(session.accessToken);
      return session.accessToken;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    query,
    auth = true,
    timeoutMs = 45000,
    _retried = false,
  } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError("Tiempo de espera agotado al conectar con el servidor.", 408, "timeout");
    }
    throw new ApiError(
      "No se pudo conectar con el servidor. Verificá tu red o la URL del backend.",
      0,
      "network_error",
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401 && auth && !_retried) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      return apiRequest<T>(path, { ...options, _retried: true });
    }
    throw new ApiError("Sesión expirada. Iniciá sesión nuevamente.", 401, "session_expired");
  }

  if (!response.ok) {
    const { detail, code } = await parseErrorPayload(response);
    throw new ApiError(detail, response.status, code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
