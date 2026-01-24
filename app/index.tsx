import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { hasCompletedOnboarding } from "./screens/Onboarding";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const completed = await hasCompletedOnboarding();
    setHasSeenOnboarding(completed);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF7F2" }}>
        <ActivityIndicator size="large" color="#2D2A26" />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/screens/Onboarding" />;
  }

  return <Redirect href="/screens/Auth" />;
}
