import { User as UserIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import type { User } from "@/types";

export function ProfileHeader({ user }: { user: User }) {
  return (
    <View className="items-center">
      <View className="h-32 w-32 items-center justify-center rounded-full border border-dashed border-primary/50">
        <View className="h-28 w-28 items-center justify-center rounded-full border border-border bg-surface-alt">
          <UserIcon size={52} color="#64748B" fill="#64748B" />
        </View>
        <View className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-background bg-primary" />
      </View>

      <Text className="mt-4 font-sans-bold text-2xl text-foreground">Mi perfil</Text>
      <View className="mt-1.5 h-1 w-10 rounded-full bg-primary" />

      <View className="mt-4 flex-row items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2">
        <Text className="font-mono text-xs text-foreground">ID: {user.employeeCode}</Text>
        <Text className="font-mono text-[10px] text-primary">
          • {user.isActive ? "ACTIVO" : "INACTIVO"}
        </Text>
      </View>
    </View>
  );
}
