import { Pressable, ScrollView, Text, View } from "react-native";

import type { AlertFrame } from "@/types";

interface FrameStripProps {
  frames: AlertFrame[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function formatOffset(o: number) {
  if (o === 0) return "0.0s";
  return `${o > 0 ? "+" : "-"}${Math.abs(o).toFixed(1)}s`;
}

export function FrameStrip({ frames, selectedId, onSelect }: FrameStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
      className="-mx-4 grow-0"
    >
      {frames.map((f) => {
        const selected = f.id === selectedId;
        return (
          <Pressable
            key={f.id}
            onPress={() => onSelect(f.id)}
            className={`h-14 w-[62px] items-center justify-center rounded-lg border bg-[#0A1420] ${
              selected ? "border-danger" : "border-border"
            }`}
          >
            <View className="absolute left-1 top-1">
              <Text className={`font-mono text-[8px] ${selected ? "text-danger" : "text-muted"}`}>
                {f.id}
              </Text>
            </View>
            <Text className={`mt-3 font-mono text-[9px] ${selected ? "text-danger" : "text-muted"}`}>
              {formatOffset(f.offsetSeconds)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
