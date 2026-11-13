import type { ReactNode } from "react";
import { Text, View } from "react-native";

interface InfoRowProps {
  label: string;
  value: string;
  right?: ReactNode;
  mono?: boolean;
  last?: boolean;
}

export function InfoRow({ label, value, right, mono, last }: InfoRowProps) {
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-4 ${last ? "" : "border-b border-border"}`}
    >
      <View className="flex-1">
        <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</Text>
        <Text className={`mt-1.5 text-base text-foreground ${mono ? "font-mono" : "font-sans-semibold"}`}>
          {value}
        </Text>
      </View>
      {right}
    </View>
  );
}
