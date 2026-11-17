import { apiRequest } from "@/services/apiClient";
import { tokenStorage } from "@/services/tokenStorage";
import type { AuthSession, LoginCredentials, User } from "@/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const session = await apiRequest<AuthSession>("/auth/login", {
      method: "POST",
      body: credentials,
      auth: false,
    });
    await tokenStorage.saveTokens(session.accessToken, session.refreshToken);
    return session;
  },

  async me(): Promise<User> {
    return apiRequest<User>("/auth/me");
  },

  async refresh(): Promise<AuthSession> {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No hay refresh token almacenado");
    }
    const session = await apiRequest<AuthSession>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      auth: false,
    });
    await tokenStorage.saveTokens(session.accessToken, session.refreshToken);
    return session;
  },

  async logout(): Promise<void> {
    const refreshToken = await tokenStorage.getRefreshToken();
    try {
      await apiRequest<void>("/auth/logout", {
        method: "POST",
        body: { refreshToken },
      });
    } finally {
      await tokenStorage.clearTokens();
    }
  },
};
