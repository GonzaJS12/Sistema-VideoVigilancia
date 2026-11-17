import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useRealtimeSocket } from "@/hooks/useRealtimeSocket";
import { setOnSessionExpired, setOnTokenRefreshed } from "@/services/apiClient";
import { authService } from "@/services/authService";
import { tokenStorage } from "@/services/tokenStorage";
import type { LoginCredentials, SocketConnectionState, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  wsState: SocketConnectionState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;
  const wsState = useRealtimeSocket(isAuthenticated, accessToken);

  const clearSessionState = useCallback(async () => {
    setUser(null);
    setAccessToken(null);
    queryClient.clear();
    await tokenStorage.clearTokens();
  }, [queryClient]);

  useEffect(() => {
    setOnSessionExpired(() => {
      void clearSessionState().then(() => {
        router.replace("/login");
      });
    });
    setOnTokenRefreshed((newToken) => {
      setAccessToken(newToken);
    });
    return () => {
      setOnSessionExpired(null);
      setOnTokenRefreshed(null);
    };
  }, [clearSessionState]);

  useEffect(() => {
    let mounted = true;
    const bootstrapSession = async () => {
      try {
        const storedToken = await tokenStorage.getAccessToken();
        if (!storedToken) {
          return;
        }
        const profile = await authService.me();
        const latestToken = await tokenStorage.getAccessToken();
        if (mounted) {
          setUser(profile);
          setAccessToken(latestToken);
        }
      } catch {
        await tokenStorage.clearTokens();
        if (mounted) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void bootstrapSession();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await authService.login(credentials);
    setUser(session.user);
    setAccessToken(session.accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      await tokenStorage.clearTokens();
    } finally {
      setUser(null);
      setAccessToken(null);
      queryClient.clear();
      router.replace("/login");
    }
  }, [queryClient]);

  const refreshProfile = useCallback(async () => {
    const profile = await authService.me();
    const latestToken = await tokenStorage.getAccessToken();
    setUser(profile);
    setAccessToken(latestToken);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      wsState,
      login,
      logout,
      refreshProfile,
    }),
    [user, accessToken, isAuthenticated, isLoading, wsState, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }
  return ctx;
}
