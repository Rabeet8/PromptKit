import * as Application from "expo-application";
import Constants from "expo-constants";
import { CopyPlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    Linking,
    Modal,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import PrimaryButton from "./Button.tsx";

interface UpdateConfig {
    isUpdateAvailable: boolean;
    storeUrl: string;
}

export default function ForceUpdateModal() {
    const [checking, setChecking] = useState(true);
    const [updateConfig, setUpdateConfig] = useState<UpdateConfig>({
        isUpdateAvailable: false,
        storeUrl: "",
    });

    useEffect(() => {
        checkStoreVersion();
    }, []);

    const checkStoreVersion = async () => {
        try {
            // 1. Get the current app version
            const currentVersion =
                Application.nativeApplicationVersion ||
                Constants.expoConfig?.version ||
                "1.0.0";
            const bundleId =
                Application.applicationId || "com.rabeet8.PromptKit";
            // fallback to your config bundleId

            let storeVersion: string | null = null;
            let storeUrl = "";

            // 2. Fetch the latest version from exactly where the app is published
            if (Platform.OS === "ios") {
                storeUrl = `https://apps.apple.com/app/idYOUR_APPLE_ID`; // Note: replace with actual Apple App ID
                const response = await fetch(
                    `https://itunes.apple.com/lookup?bundleId=${bundleId}`
                );
                const data = await response.json();
                if (data.resultCount > 0) {
                    storeVersion = data.results[0].version;
                    storeUrl = data.results[0].trackViewUrl;
                }
            } else if (Platform.OS === "android") {
                storeUrl = `https://play.google.com/store/apps/details?id=${bundleId}`;
                const response = await fetch(`${storeUrl}&hl=en`, {
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                    },
                });
                const text = await response.text();

                // Android Play Store scraping regex (fallback strategy for Android)
                // Matches the version number format in the scripts Play Store creates
                const match = text.match(/\[\[\["(\d+\.\d+\.\d+)"\]\]/);
                if (match && match[1]) {
                    storeVersion = match[1];
                }
            }

            console.log('--- App Version Check ---');
            console.log('Local Version:', currentVersion);
            console.log('Store Version:', storeVersion);
            console.log('Store Link:', storeUrl);

            // 3. Compare the versions
            if (storeVersion) {
                const needsUpdate = compareVersions(storeVersion, currentVersion) > 0;
                console.log('Is Update Needed?:', needsUpdate);
                console.log('-------------------------');

                if (needsUpdate) {
                    setUpdateConfig({ isUpdateAvailable: true, storeUrl });
                }
            } else {
                console.log('Store version not found, app might not be published yet.');
                console.log('-------------------------');
            }
        } catch (error) {
            console.log("Failed to check store version:", error);
        } finally {
            setChecking(false);
        }
    };

    const compareVersions = (v1: string, v2: string) => {
        const v1Parts = v1.split(".").map(Number);
        const v2Parts = v2.split(".").map(Number);

        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const part1 = v1Parts[i] || 0;
            const part2 = v2Parts[i] || 0;
            if (part1 > part2) return 1;
            if (part1 < part2) return -1;
        }
        return 0; // Versions are equal
    };

    const handleUpdate = () => {
        if (updateConfig.storeUrl) {
            Linking.openURL(updateConfig.storeUrl).catch((err) =>
                console.error("Failed to open store url:", err)
            );
        }
    };

    // If no update is available, render nothing
    if (checking || !updateConfig.isUpdateAvailable) {
        return null;
    }

    return (
        <Modal visible={true} transparent={true} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <CopyPlus size={32} color="#F59E0B" />
                    </View>
                    <Text style={styles.title}>Update Required</Text>
                    <Text style={styles.message}>
                        A newer version of PromptKit is available. Please update the app to
                        continue using it and enjoy the latest features.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton label="Update Now" onPress={handleUpdate} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        width: "100%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 5 },
        elevation: 10,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#FEF3C7", // Amber-50
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        color: "#111827",
        marginBottom: 8,
        textAlign: "center",
    },
    message: {
        fontSize: 15,
        fontFamily: "Poppins_400Regular",
        color: "#4B5563",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 24,
    },
    buttonContainer: {
        width: "100%",
        marginTop: 8,
    },
});
