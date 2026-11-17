import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type ThemeMode = "light" | "dark";

const THEME_KEY = "sivia_theme_mode";

export const themeStorage = {
  async getTheme(): Promise<ThemeMode | null> {
    try {
      if (Platform.OS === "web") {
        const val = typeof window !== "undefined" ? window.localStorage?.getItem(THEME_KEY) : null;
        return val === "light" || val === "dark" ? val : null;
      }
      const val = await SecureStore.getItemAsync(THEME_KEY);
      return val === "light" || val === "dark" ? val : null;
    } catch {
      return null;
    }
  },

  async saveTheme(mode: ThemeMode): Promise<void> {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(THEME_KEY, mode);
        }
        return;
      }
      await SecureStore.setItemAsync(THEME_KEY, mode);
    } catch {
      // Ignora errores de almacenamiento no críticos
    }
  },
};
