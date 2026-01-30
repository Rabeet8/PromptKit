import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { hasCompletedOnboarding } from "./screens/Onboarding";

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const completed = await hasCompletedOnboarding();
    setHasSeenOnboarding(completed);
    setIsNavigationReady(true);
  };

  // Wait for both auth check and onboarding check
  if (authLoading || !isNavigationReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF7F2" }}>
        <ActivityIndicator size="large" color="#2D2A26" />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/screens/Onboarding" />;
  }

  if (user) {
    return <Redirect href="/screens/Home" />;
  }

  return <Redirect href="/screens/Auth" />;
}
