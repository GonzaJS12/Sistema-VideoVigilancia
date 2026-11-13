import { Text, View } from "react-native";

interface SectionTitleProps {
  title: string;
  /** Texto técnico en mayúsculas a la derecha (fuente monoespaciada). */
  aside?: string;
  asideClassName?: string;
}

export function SectionTitle({ title, aside, asideClassName = "text-muted" }: SectionTitleProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-sans-semibold text-lg text-foreground">{title}</Text>
      {aside ? (
        <Text className={`font-mono text-[10px] uppercase tracking-widest ${asideClassName}`}>
          {aside}
        </Text>
      ) : null}
    </View>
  );
}
