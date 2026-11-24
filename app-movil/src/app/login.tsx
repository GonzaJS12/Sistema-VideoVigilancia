import { router } from "expo-router";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GradientButton } from "@/components/ui/GradientButton";
import { TextField } from "@/components/ui/TextField";
import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/apiClient";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg("Ingresá tu correo electrónico y contraseña.");
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);
    try {
      await login({ email: cleanEmail, password });
      router.replace("/home");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("No se pudo iniciar sesión. Intentá nuevamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Resplandor superior */}
      <LinearGradient
        colors={["rgba(0,214,143,0.12)", "transparent"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320 }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="rounded-[28px] border border-border bg-surface px-6 pb-8 pt-8">
            <View className="items-center">
              <View className="h-20 w-20 items-center justify-center rounded-3xl border border-primary/50 bg-surface-alt">
                <ShieldCheck size={38} color={palette.primary} />
              </View>
              <Text className="mt-5 font-display text-lg tracking-[6px] text-foreground">SVI</Text>
              <Text className="mt-1 font-sans-medium text-3xl text-foreground">Bienvenido</Text>
              <Text className="mt-1 text-center font-display text-[12px] text-foreground">
                Sistema de Videovigilancia Inteligente
              </Text>
            </View>

            <View className="mt-8 gap-5">
              <TextField
                label="Correo electrónico"
                placeholder="operador@seguridad.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={<Mail size={18} color={palette.muted} />}
              />
              <TextField
                label="Contraseña"
                placeholder="••••••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                leftIcon={<Lock size={18} color={palette.muted} />}
                rightElement={
                  <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
                    {showPassword ? (
                      <EyeOff size={18} color={palette.muted} />
                    ) : (
                      <Eye size={18} color={palette.muted} />
                    )}
                  </Pressable>
                }
              />
            </View>

            {errorMsg ? (
              <View className="mt-5 rounded-xl border border-danger/50 bg-danger/10 px-3.5 py-2.5">
                <Text className="text-xs text-danger">{errorMsg}</Text>
              </View>
            ) : null}

            <View className="mt-7">
              <GradientButton
                label={submitting ? "Ingresando..." : "Iniciar sesión"}
                onPress={() => {
                  void handleLogin();
                }}
                disabled={submitting}
                icon={<ArrowRight size={18} color="#0B0F17" />}
              />
            </View>

            <Pressable
              onPress={() =>
                Alert.alert(
                  "Recuperación de contraseña",
                  "El restablecimiento de credenciales es gestionado por un administrador del sistema SVI.",
                )
              }
              className="mt-6 items-center"
            >
              <Text className="text-sm text-primary underline">¿Olvidaste tu contraseña?</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View className="items-center border-t border-border py-5">
        <Text className="text-xs text-muted">Acceso restringido a personal autorizado</Text>
      </View>
    </SafeAreaView>
  );
}
