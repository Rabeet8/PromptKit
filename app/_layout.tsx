import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { AuthProvider } from "@/contexts/AuthContext";
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
} from "@expo-google-fonts/poppins";

// Prevent splash auto-hide until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // keeps splash visible

  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor="#FAF7F2" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        {/* Correct screen paths — index.tsx auto-detected */}
        <Stack.Screen name="screens/Auth" />
        <Stack.Screen name="screens/Home" />
        <Stack.Screen name="screens/UserInfo" />
        <Stack.Screen name="screens/TokenCalculator" />
        <Stack.Screen name="screens/PromptLinter" />
        <Stack.Screen name="screens/SchemaGenerator" />
        <Stack.Screen name="screens/LLMCostCalculator" />
        <Stack.Screen name="screens/ResetPassword" />

        {/* If you have tabs */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
