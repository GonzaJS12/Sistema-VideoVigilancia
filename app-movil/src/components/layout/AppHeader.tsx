import { router } from "expo-router";
import { ChevronLeft, Settings, Target } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { palette } from "@/constants/theme";

interface AppHeaderProps {
  /** Muestra un botón de volver en lugar del logo. */
  back?: boolean;
}

export function AppHeader({ back = false }: AppHeaderProps) {
  return (
    <View className="flex-row items-center border-b border-border px-4 py-3">
      {back ? (
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface active:opacity-70"
        >
          <ChevronLeft size={20} color={palette.muted} />
        </Pressable>
      ) : (
        <View className="h-12 w-12 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10">
          <Target size={22} color={palette.primary} />
        </View>
      )}
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="font-mono text-base font-bold text-foreground">SIV IA</Text>
          <View className="ml-2 rounded-md border border-primary/40 bg-primary/10 px-1.5 py-0.5">
            <Text className="font-mono text-[10px] text-primary">V1.0</Text>
          </View>
        </View>
        <Text className="text-xs text-muted">Sistema de vigilancia inteligente</Text>
      </View>
      <Pressable className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
        <Settings size={18} color={palette.muted} />
      </Pressable>
    </View>
  );
}
