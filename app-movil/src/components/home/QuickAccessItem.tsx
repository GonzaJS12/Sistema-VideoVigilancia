import { ChevronRight } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { palette } from "@/constants/theme";

interface QuickAccessItemProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function QuickAccessItem({ icon, title, subtitle, onPress }: QuickAccessItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-card border border-border bg-surface p-3.5 active:opacity-80"
    >
      <View className="h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-alt">
        {icon}
      </View>
      <View className="ml-4 flex-1">
        <Text className="font-sans-semibold text-base text-foreground">{title}</Text>
        <Text className="mt-0.5 text-xs text-muted">{subtitle}</Text>
      </View>
      <ChevronRight size={20} color={palette.muted} />
    </Pressable>
  );
}
