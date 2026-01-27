import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import { AuthProvider } from "@/contexts/AuthContext";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("⏰ Splash timeout - hiding splash screen");
      setAppReady(true);
      SplashScreen.hideAsync().catch(() => { });
    }, 3000);

    if (fontsLoaded || fontError) {
      clearTimeout(timeout);
      setAppReady(true);
      SplashScreen.hideAsync().catch(() => { });

      if (fontError) {
        console.error("❌ Font loading error:", fontError);
      } else {
        console.log("✅ Fonts loaded successfully");
      }
    }

    return () => clearTimeout(timeout);
  }, [fontsLoaded, fontError]);

  if (!appReady) return null; // keeps splash visible

  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor="#FAF7F2" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          contentStyle: { backgroundColor: "#FAF7F2" },
        }}
      >
        <Stack.Screen name="screens/Onboarding" />
        <Stack.Screen name="screens/Auth" />
        <Stack.Screen name="screens/Home" />
        <Stack.Screen name="screens/UserInfo" />
        <Stack.Screen name="screens/TokenCalculator" />
        <Stack.Screen name="screens/PromptLinter" />
        <Stack.Screen name="screens/SchemaGenerator" />
        <Stack.Screen name="screens/LLMCostCalculator" />
        <Stack.Screen name="screens/ResetPassword" />

      </Stack>
    </AuthProvider>
  );
}
