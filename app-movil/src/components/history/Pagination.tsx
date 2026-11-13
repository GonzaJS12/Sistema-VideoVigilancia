import { Pressable, Text, View } from "react-native";

interface PaginationProps {
  shown: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({ shown, total, hasPrev, hasNext, onPrev, onNext }: PaginationProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-mono text-xs text-muted">
        {shown} de {total} registros
      </Text>
      <View className="flex-row gap-2">
        <Pressable
          disabled={!hasPrev}
          onPress={onPrev}
          className={`rounded-xl border border-border bg-surface px-4 py-2.5 ${hasPrev ? "" : "opacity-40"}`}
        >
          <Text className="font-sans-medium text-sm text-foreground">Anterior</Text>
        </Pressable>
        <Pressable
          disabled={!hasNext}
          onPress={onNext}
          className={`rounded-xl bg-primary px-4 py-2.5 ${hasNext ? "" : "opacity-40"}`}
        >
          <Text className="font-sans-semibold text-sm text-[#0B0F17]">Siguiente</Text>
        </Pressable>
      </View>
    </View>
  );
}
