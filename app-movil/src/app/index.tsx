import { Redirect } from "expo-router";

// TODO (Paso 5): redirigir según la sesión (useAuth).
export default function Index() {
  return <Redirect href="/login" />;
}
