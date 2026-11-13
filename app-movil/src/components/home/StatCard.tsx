import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";

interface StatCardProps {
  badge: string;
  badgeVariant: BadgeVariant;
  icon: ReactNode;
  value: number | string;
  label: string;
  caption: string;
}

export function StatCard({ badge, badgeVariant, icon, value, label, caption }: StatCardProps) {
  return (
    <View className="flex-1 rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center justify-between">
        <Badge label={badge} variant={badgeVariant} />
        {icon}
      </View>
      <Text className="mt-4 font-sans-bold text-4xl text-foreground">{value}</Text>
      <Text className="mt-2 font-sans-medium text-sm text-foreground">{label}</Text>
      <Text className="mt-1 text-xs text-muted">{caption}</Text>
    </View>
  );
}
