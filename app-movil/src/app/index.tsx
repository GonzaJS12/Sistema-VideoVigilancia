import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
}
