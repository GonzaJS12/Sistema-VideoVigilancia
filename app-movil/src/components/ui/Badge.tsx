import { Text, View } from "react-native";

export type BadgeVariant = "success" | "info" | "danger" | "warning" | "caution" | "neutral";

const styles: Record<BadgeVariant, { box: string; text: string }> = {
  success: { box: "border-primary/40 bg-primary/10", text: "text-primary" },
  info: { box: "border-accent/40 bg-accent/10", text: "text-accent" },
  danger: { box: "border-danger/40 bg-danger/15", text: "text-danger" },
  warning: { box: "border-warning/40 bg-warning/15", text: "text-warning" },
  caution: { box: "border-caution/40 bg-caution/15", text: "text-caution" },
  neutral: { box: "border-border bg-surface-alt", text: "text-muted" },
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = "neutral" }: BadgeProps) {
  const s = styles[variant];
  return (
    <View className={`self-start rounded-md border px-2 py-0.5 ${s.box}`}>
      <Text className={`font-mono text-[10px] uppercase tracking-widest ${s.text}`}>{label}</Text>
    </View>
  );
}
