import { Pressable, ScrollView, Text } from "react-native";

export interface AlertFilterOption {
  key: string;
  label: string;
}

interface AlertFiltersProps {
  options: AlertFilterOption[];
  selected: string;
  onSelect: (key: string) => void;
}

export function AlertFilters({ options, selected, onSelect }: AlertFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
      className="-mx-4 grow-0"
    >
      {options.map((o) => {
        const active = o.key === selected;
        return (
          <Pressable
            key={o.key}
            onPress={() => onSelect(o.key)}
            className={`rounded-pill border px-4 py-2 ${
              active ? "border-primary bg-primary/10" : "border-border bg-surface"
            }`}
          >
            <Text
              className={`font-sans-medium text-sm ${active ? "text-primary" : "text-foreground/80"}`}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
