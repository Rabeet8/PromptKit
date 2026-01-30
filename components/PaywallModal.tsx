import { LinearGradient } from "expo-linear-gradient";
import { Check, X } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface PaywallModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function PaywallModal({ visible, onClose }: PaywallModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Close Button */}
                    <Pressable onPress={onClose} style={styles.closeBtn}>
                        <X size={20} color="#6B7280" />
                    </Pressable>

                    <View style={styles.content}>
                        <Text style={styles.title}>Limit Reached</Text>
                        <Text style={styles.subtitle}>
                            You've used your 2 free requests. Upgrade to unlock unlimited access.
                        </Text>

                        <View style={styles.features}>
                            <View style={styles.featureItem}>
                                <View style={styles.checkCircle}>
                                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                                </View>
                                <Text style={styles.featureText}>Unlimited AI Inferences</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <View style={styles.checkCircle}>
                                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                                </View>
                                <Text style={styles.featureText}>Advanced Models Access</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <View style={styles.checkCircle}>
                                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                                </View>
                                <Text style={styles.featureText}>Priority Support</Text>
                            </View>
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.upgradeBtn,
                                { transform: [{ scale: pressed ? 0.98 : 1 }] },
                            ]}
                            onPress={() => {
                                // Future integration: Stripe/RevenueCat
                                onClose();
                            }}
                        >
                            <LinearGradient
                                colors={["#2D2A26", "#1A1918"]}
                                style={styles.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.upgradeText}>Upgrade for $10/Month</Text>
                            </LinearGradient>
                        </Pressable>

                        <Pressable onPress={onClose} style={styles.notNowBtn}>
                            <Text style={styles.notNowText}>Not now</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    container: {
        width: "100%",
        backgroundColor: "#FAF7F2",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        position: "relative",
    },
    closeBtn: {
        position: "absolute",
        top: 16,
        right: 16,
        padding: 4,
        zIndex: 10,
    },
    content: {
        alignItems: "center",
        paddingTop: 10,
    },
    title: {
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
        color: "#2D2A26",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        color: "#6B6560",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 24,
    },
    features: {
        width: "100%",
        gap: 16,
        marginBottom: 32,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#2D2A26",
        justifyContent: "center",
        alignItems: "center",
    },
    featureText: {
        fontSize: 15,
        fontFamily: "Poppins_500Medium",
        color: "#2D2A26",
    },
    upgradeBtn: {
        width: "100%",
        height: 56,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
        shadowColor: "#2D2A26",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    gradient: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    upgradeText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        letterSpacing: 0.5,
    },
    notNowBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    notNowText: {
        fontSize: 15,
        fontFamily: "Poppins_500Medium",
        color: "#8C877F",
    },
});
