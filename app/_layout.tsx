import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // AdMob setup is handled in individual components
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="index" /> */}

      {/* Screens */}
      <Stack.Screen name="screens/Auth/index" />

      <Stack.Screen name="screens/Home/index" />
      <Stack.Screen name="screens/UserInfo/index" />
      <Stack.Screen name="screens/TokenCalculator/index" />
      <Stack.Screen name="screens/PromptLinter/index" />
      <Stack.Screen name="screens/SchemaGenerator/index" />
      <Stack.Screen name="screens/LLMCostCalculator/index" />
      <Stack.Screen name="screens/ResetPassword/index" />
    </Stack>
  );
}
