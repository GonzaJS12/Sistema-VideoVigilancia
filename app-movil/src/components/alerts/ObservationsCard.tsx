import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface ObservationsCardProps {
  notes: string;
  updatedAt: string | null;
  onSave?: (notes: string) => void | Promise<void>;
  saving?: boolean;
}

function formatClock(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function ObservationsCard({ notes, updatedAt, onSave, saving }: ObservationsCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes);

  useEffect(() => {
    if (!editing) {
      setDraft(notes);
    }
  }, [notes, editing]);

  const toggle = async () => {
    if (editing) {
      await onSave?.(draft);
    }
    setEditing((v) => !v);
  };

  return (
    <View className="rounded-card border border-border bg-surface p-4">
      {editing ? (
        <TextInput
          value={draft}
          onChangeText={setDraft}
          multiline
          autoFocus
          textAlignVertical="top"
          placeholder="Escribí observaciones de la revisión..."
          placeholderTextColor="#64748B"
          className="min-h-[96px] text-sm leading-5 text-foreground"
        />
      ) : (
        <Text className="text-sm leading-5 text-foreground/90">
          {draft || "Sin observaciones registradas"}
        </Text>
      )}
      <View className="mt-3 flex-row items-center justify-between border-t border-border pt-3">
        <Text className="font-mono text-[10px] uppercase text-muted">
          Última modif: {updatedAt ? formatClock(updatedAt) : "--:--:--"}
        </Text>
        <Pressable
          onPress={() => {
            void toggle();
          }}
          disabled={saving}
          hitSlop={8}
        >
          <Text className="font-mono text-[11px] text-primary underline">
            {saving ? "Guardando..." : editing ? "Guardar nota" : "Editar nota"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
