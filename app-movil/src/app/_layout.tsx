import "../global.css";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { themes } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  // Tema oscuro por defecto (la preferencia persistida llega en el Paso 5).
  // Solo al montar: si dependiera de setColorScheme, se reiniciaría a "dark" al cambiar el modo.
  useEffect(() => {
    setColorScheme("dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
    AlfaSlabOne_400Regular,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  const mode = colorScheme === "light" ? "light" : "dark";

  return (
    <SafeAreaProvider>
      <View style={[{ flex: 1 }, themes[mode]]} className={`bg-background ${mode === "dark" ? "dark" : ""}`}>
        <StatusBar style={mode === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }} />
      </View>
    </SafeAreaProvider>
  );
}
