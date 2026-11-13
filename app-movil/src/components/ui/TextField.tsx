import type { ReactNode } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";

interface TextFieldProps extends TextInputProps {
  label: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export function TextField({ label, leftIcon, rightElement, ...props }: TextFieldProps) {
  return (
    <View>
      <Text className="mb-2 text-sm text-foreground/90">{label}</Text>
      <View className="h-14 flex-row items-center rounded-2xl border border-border bg-surface-alt px-4">
        {leftIcon}
        <TextInput
          placeholderTextColor="#64748B"
          className="ml-3 flex-1 text-base text-foreground"
          {...props}
        />
        {rightElement}
      </View>
    </View>
  );
}
