import { Check, Video } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

import { palette } from "@/constants/theme";
import type { Camera } from "@/types";

interface CameraSelectorProps {
  cameras: Camera[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CameraSelector({ cameras, selectedId, onSelect }: CameraSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3 px-1 py-1"
      className="-mx-1 grow-0"
    >
      {cameras.map((camera) => {
        const selected = camera.id === selectedId;
        const online = camera.status === "online";
        return (
          <Pressable
            key={camera.id}
            onPress={() => onSelect(camera.id)}
            className={`min-w-[160px] items-center rounded-card border-2 px-4 py-4 ${
              selected ? "border-primary bg-primary/10" : "border-border bg-surface"
            }`}
          >
            {selected && (
              <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check size={12} color="#0B0F17" strokeWidth={3} />
              </View>
            )}
            <View className="flex-row items-center gap-2">
              <Video size={16} color={selected ? palette.primary : palette.muted} />
              <Text
                className={`font-sans-semibold text-base ${
                  selected ? "text-foreground" : "text-muted"
                }`}
                numberOfLines={1}
              >
                {camera.name}
              </Text>
            </View>
            {selected ? (
              <Text
                className={`mt-2 font-mono text-[10px] uppercase tracking-widest ${
                  online ? "text-primary" : "text-danger"
                }`}
              >
                ● {online ? "En línea" : "Sin señal"}
              </Text>
            ) : (
              <Text className="mt-2 text-xs text-muted" numberOfLines={1}>
                {camera.location}
              </Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
