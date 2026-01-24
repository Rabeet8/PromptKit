import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@promptkit_onboarding_completed";

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        return value === "true";
    } catch (error) {
        console.error("Failed to check onboarding status:", error);
        return false;
    }
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(): Promise<void> {
    try {
        await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    } catch (error) {
        console.error("Failed to save onboarding status:", error);
    }
}

/**
 * Reset onboarding status (for testing)
 */
export async function resetOnboarding(): Promise<void> {
    try {
        await AsyncStorage.removeItem(ONBOARDING_KEY);
        console.log("✅ Onboarding reset - will show on next app launch");
    } catch (error) {
        console.error("Failed to reset onboarding:", error);
    }
}
