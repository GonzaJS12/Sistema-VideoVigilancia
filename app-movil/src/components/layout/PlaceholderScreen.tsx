import { Text } from "react-native";

import { Screen } from "./Screen";

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <Screen>
      <Text className="text-3xl font-sans-bold text-foreground">{title}</Text>
      <Text className="mt-1 text-sm text-muted">Pendiente de maquetar</Text>
    </Screen>
  );
}
