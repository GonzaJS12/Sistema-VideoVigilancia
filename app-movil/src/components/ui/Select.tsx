import { Check, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { palette } from "@/constants/theme";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export function Select({ label, options, value, onChange, icon }: SelectProps) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <View className="flex-1">
      <View className="mb-2 flex-row items-center gap-1.5">
        {icon}
        <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
          {label}
        </Text>
      </View>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-11 flex-row items-center justify-between rounded-xl border border-border bg-surface-alt px-3 active:opacity-80"
      >
        <Text className="flex-1 text-sm text-foreground" numberOfLines={1}>
          {current.label}
        </Text>
        <ChevronDown size={16} color={palette.muted} />
      </Pressable>

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/60" onPress={() => setOpen(false)}>
          <View className="rounded-t-[28px] border border-border bg-surface px-4 pb-8 pt-4">
            <View className="mb-3 h-1 w-10 self-center rounded-full bg-border" />
            <Text className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted">
              {label}
            </Text>
            {options.map((o) => {
              const selected = o.value === value;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className="flex-row items-center justify-between border-b border-border py-3.5"
                >
                  <Text className={`text-base ${selected ? "text-primary" : "text-foreground"}`}>
                    {o.label}
                  </Text>
                  {selected && <Check size={18} color={palette.primary} />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
