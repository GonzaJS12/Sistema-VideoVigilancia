import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <View className={`rounded-card border border-border bg-surface p-4 ${className}`} {...props}>
      {children}
    </View>
  );
}
