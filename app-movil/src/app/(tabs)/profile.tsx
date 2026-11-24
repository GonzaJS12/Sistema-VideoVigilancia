import { Check, ChevronRight, Clock, LogOut, Mail, Moon, Shield } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { InfoRow } from "@/components/profile/InfoRow";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { themeStorage } from "@/services/themeStorage";
import type { UserRole } from "@/types";

const roleLabel: Record<UserRole, string> = {
  operator: "Operador",
  supervisor: "Supervisor",
  admin: "Administrador",
};

function SectionHeader({ title, aside }: { title: string; aside: string }) {
  return (
    <View className="mb-3 mt-7 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <View className="h-1.5 w-1.5 rounded-full bg-primary" />
        <Text className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
          {title}
        </Text>
      </View>
      <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">{aside}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme !== "light";
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Screen>
        <View className="items-center justify-center py-16">
          <ActivityIndicator color={palette.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ProfileHeader user={user} />

      <SectionHeader title="Información personal" aside="Confidencial" />
      <View className="overflow-hidden rounded-card border border-border bg-surface">
        <InfoRow
          label="Nombre completo"
          value={user.fullName}
          right={
            user.isVerified ? (
              <View className="flex-row items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1.5">
                <Check size={12} color={palette.primary} />
                <Text className="text-xs text-primary">Verificado</Text>
              </View>
            ) : null
          }
        />
        <InfoRow
          label="Correo electrónico"
          value={user.email}
          mono
          right={<Mail size={16} color={palette.muted} />}
        />
        <InfoRow
          label="Rol asignado"
          value={roleLabel[user.role]}
          last={!user.shift}
          right={
            <View className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-alt">
              <Shield size={16} color={palette.muted} />
            </View>
          }
        />
        {user.shift ? (
          <InfoRow
            label="Turno operativo"
            value={user.shift}
            last
            right={
              <View className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-alt">
                <Clock size={16} color={palette.muted} />
              </View>
            }
          />
        ) : null}
      </View>

      <SectionHeader title="Cuenta" aside="Acciones" />
      <View className="gap-3">
        <View className="flex-row items-center rounded-card border border-border bg-surface p-3.5">
          <View className="h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-alt">
            <Moon size={20} color={palette.primary} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-sans-semibold text-base text-foreground">Modo oscuro</Text>
            <Text className="mt-0.5 text-xs text-muted">
              {isDark ? "Tema oscuro activo" : "Tema claro activo"}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={(v) => {
              const next = v ? "dark" : "light";
              setColorScheme(next);
              void themeStorage.saveTheme(next);
            }}
            trackColor={{ false: "#CBD5E1", true: palette.primary }}
            thumbColor="#fff"
          />
        </View>

        <Pressable
          onPress={() => {
            void logout();
          }}
          className="flex-row items-center rounded-card border border-danger/40 bg-danger/10 p-3.5 active:opacity-80"
        >
          <View className="h-11 w-11 items-center justify-center rounded-xl border border-danger/40 bg-danger/15">
            <LogOut size={20} color={palette.danger} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-sans-semibold text-base text-foreground">Cerrar sesión</Text>
            <Text className="mt-0.5 text-xs text-muted">Finalizar guardia de monitoreo</Text>
          </View>
          <ChevronRight size={18} color={palette.muted} />
        </Pressable>
      </View>
    </Screen>
  );
}
