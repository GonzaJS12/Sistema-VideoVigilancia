import { Shield, TriangleAlert } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ResponseProtocolCardProps {
  code: string;
  onDispatch?: () => void;
}

export function ResponseProtocolCard({ code, onDispatch }: ResponseProtocolCardProps) {
  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Shield size={14} color="#00D68F" />
          <Text className="font-mono text-[11px] font-bold uppercase tracking-widest text-primary">
            Protocolo de respuesta
          </Text>
        </View>
        <Text className="font-mono text-[10px] text-muted">{code}</Text>
      </View>
      <Text className="mt-3 text-sm leading-5 text-foreground/80">
        Ante la detección confirmada de arma de fuego, el protocolo de cierre perimetral automático
        se encuentra disponible para su activación.
      </Text>
      <Pressable
        onPress={onDispatch}
        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-danger/60 bg-danger/20 py-3.5 active:opacity-70"
      >
        <TriangleAlert size={16} color="#F0453F" />
        <Text className="font-mono text-[11px] font-bold uppercase tracking-wider text-danger">
          Despachar alerta a seguridad central
        </Text>
      </Pressable>
    </View>
  );
}
