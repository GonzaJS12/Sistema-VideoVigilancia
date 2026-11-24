import { Image } from "expo-image";
import { Pressable, ScrollView, Text, View } from "react-native";

import { resolveApiAssetUrl } from "@/config/env";
import { useAuth } from "@/context/AuthContext";
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
  const { accessToken } = useAuth();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
      className="-mx-4 grow-0"
    >
      {frames.map((f) => {
        const selected = f.id === selectedId;
        const imageUrl = resolveApiAssetUrl(f.imageUrl);
        return (
          <Pressable
            key={f.id}
            onPress={() => onSelect(f.id)}
            className={`h-14 w-[70px] items-center justify-end overflow-hidden rounded-lg border bg-[#0A1420] ${
              selected ? "border-danger" : "border-border"
            }`}
          >
            {imageUrl ? (
              <Image
                source={{
                  uri: imageUrl,
                  headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
                }}
                contentFit="cover"
                style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
              />
            ) : null}
            <View className="w-full bg-black/65 px-1 py-0.5">
              <Text
                className={`text-center font-mono text-[9px] ${
                  selected ? "font-bold text-danger" : "text-white/90"
                }`}
              >
                {formatOffset(f.offsetSeconds)}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
