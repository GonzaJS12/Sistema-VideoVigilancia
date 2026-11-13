import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "./AppHeader";

interface ScreenProps {
  children: ReactNode;
  /** Muestra el AppHeader (logo SIV IA + engranaje). */
  header?: boolean;
  /** Header con botón de volver (pantallas de detalle). */
  back?: boolean;
  scroll?: boolean;
  className?: string;
}

export function Screen({ children, header = true, back = false, scroll = true, className = "" }: ScreenProps) {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      {header && <AppHeader back={back} />}
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={`px-4 pb-8 pt-5 ${className}`}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 px-4 pt-5 ${className}`}>{children}</View>
      )}
    </SafeAreaView>
  );
}
