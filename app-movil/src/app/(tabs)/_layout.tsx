import { Redirect, Tabs } from "expo-router";
import { Bell, Clock, Home, User, Video } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isLight = colorScheme === "light";
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarLabelStyle: { fontFamily: "Inter_500Medium", fontSize: 11 },
        tabBarStyle: {
          backgroundColor: isLight ? "#FFFFFF" : "#0B0F17",
          borderTopColor: isLight ? "#D5DEE7" : "#1E293B",
          // Respeta la barra de navegación / gestos de Android e iOS
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Inicio", tabBarIcon: ({ color }) => <Home size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="monitoring"
        options={{ title: "Monitoreo", tabBarIcon: ({ color }) => <Video size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="alerts"
        options={{ title: "Alertas", tabBarIcon: ({ color }) => <Bell size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: "Historial", tabBarIcon: ({ color }) => <Clock size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Perfil", tabBarIcon: ({ color }) => <User size={22} color={color} /> }}
      />
    </Tabs>
  );
}
