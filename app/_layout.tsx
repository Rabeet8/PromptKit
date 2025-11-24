import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

// Prevent auto-hide until fonts are loaded
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

  if (!fontsLoaded) return null; // keep splash until fonts ready

  return (
    <>
      <StatusBar style="dark" backgroundColor="#FAF7F2" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="screens/Auth/index" />
        <Stack.Screen name="screens/Home/index" />
        <Stack.Screen name="screens/UserInfo/index" />
        <Stack.Screen name="screens/TokenCalculator/index" />
        <Stack.Screen name="screens/PromptLinter/index" />
        <Stack.Screen name="screens/SchemaGenerator/index" />
        <Stack.Screen name="screens/LLMCostCalculator/index" />
        <Stack.Screen name="screens/ResetPassword/index" />
      </Stack>
    </>
  );
}
