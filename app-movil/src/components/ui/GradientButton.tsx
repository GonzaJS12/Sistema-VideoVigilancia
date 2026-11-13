import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { palette } from "@/constants/theme";

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export function GradientButton({ label, onPress, icon, disabled }: GradientButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} className="active:opacity-80">
      <LinearGradient
        colors={[palette.primary, palette.accent]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ borderRadius: 14, opacity: disabled ? 0.5 : 1 }}
      >
        <View className="h-[52px] flex-row items-center justify-center gap-2">
          <Text className="font-sans-semibold text-base text-[#0B0F17]">{label}</Text>
          {icon}
        </View>
      </LinearGradient>
    </Pressable>
  );
}
