import { Stack } from "expo-router";

export default function RootLayout() {
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
    </Stack>
  );
}
