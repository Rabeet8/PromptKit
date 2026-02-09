import { buildCheckoutUrl, PlanId, SUBSCRIPTION_PLANS } from "@/api/polar";
import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { Check, Sparkles, X } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PaywallModalProps {
    visible: boolean;
    onClose: () => void;
    onUpgradeSuccess?: (plan: PlanId) => void;
    isLimitReached?: boolean;
}

export default function PaywallModal({ visible, onClose, onUpgradeSuccess, isLimitReached }: PaywallModalProps) {
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!user?.email) {
            console.error("❌ User email not found");
            return;
        }

        setIsLoading(true);

        try {
            const checkoutUrl = buildCheckoutUrl(selectedPlan, user.email);
            console.log("🛒 Opening checkout:", checkoutUrl);

            // Open Polar checkout in browser
            const result = await WebBrowser.openAuthSessionAsync(
                checkoutUrl,
                `promptkit://upgrade-success?plan=${selectedPlan}`
            );

            console.log("🔄 Browser result:", result);

            if (result.type === "success") {
                // User completed checkout and returned to app
                console.log("✅ Checkout completed, URL:", result.url);
                onUpgradeSuccess?.(selectedPlan);
                onClose();
            } else if (result.type === "cancel" || result.type === "dismiss") {
                console.log("🚪 User cancelled checkout");
            }
        } catch (error) {
            console.error("❌ Checkout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const monthlyPlan = SUBSCRIPTION_PLANS.monthly;
    const yearlyPlan = SUBSCRIPTION_PLANS.yearly;

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

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        bounces={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>

                            <Text style={styles.title}>Upgrade to Pro</Text>
                            <Text style={styles.subtitle}>
                                {isLimitReached
                                    ? "You've used your 8 free requests. Upgrade to continue using PromptKit."
                                    : "Unlock unlimited access to all PromptKit features"}
                            </Text>
                        </View>

                        {/* Plan Selection */}
                        <View style={styles.plansContainer}>
                            {/* Yearly Plan - Recommended */}
                            <Pressable
                                style={[
                                    styles.planCard,
                                    selectedPlan === "yearly" && styles.planCardSelected,
                                ]}
                                onPress={() => setSelectedPlan("yearly")}
                            >
                                <View style={styles.planHeader}>
                                    <View style={styles.planInfo}>
                                        <Text style={styles.planName}>Yearly</Text>
                                        <View style={styles.savingsBadge}>
                                            <Sparkles size={10} color="#059669" />
                                            <Text style={styles.savingsText}>Save 17%</Text>
                                        </View>
                                    </View>
                                    <View style={[
                                        styles.radioOuter,
                                        selectedPlan === "yearly" && styles.radioOuterSelected,
                                    ]}>
                                        {selectedPlan === "yearly" && <View style={styles.radioInner} />}
                                    </View>
                                </View>
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceAmount}>${yearlyPlan.price}</Text>
                                    <Text style={styles.priceInterval}>/year</Text>
                                </View>
                                <Text style={styles.priceSubtext}>
                                    Just ${(yearlyPlan.price / 12).toFixed(2)}/month
                                </Text>
                            </Pressable>

                            {/* Monthly Plan */}
                            <Pressable
                                style={[
                                    styles.planCard,
                                    selectedPlan === "monthly" && styles.planCardSelected,
                                ]}
                                onPress={() => setSelectedPlan("monthly")}
                            >
                                <View style={styles.planHeader}>
                                    <Text style={styles.planName}>Monthly</Text>
                                    <View style={[
                                        styles.radioOuter,
                                        selectedPlan === "monthly" && styles.radioOuterSelected,
                                    ]}>
                                        {selectedPlan === "monthly" && <View style={styles.radioInner} />}
                                    </View>
                                </View>
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceAmount}>${monthlyPlan.price}</Text>
                                    <Text style={styles.priceInterval}>/month</Text>
                                </View>
                            </Pressable>
                        </View>

                        {/* Features */}
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
                                <Text style={styles.featureText}>Access All Models</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <View style={styles.checkCircle}>
                                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                                </View>
                                <Text style={styles.featureText}>Priority Support</Text>
                            </View>
                        </View>

                        {/* Upgrade Button */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.upgradeBtn,
                                { transform: [{ scale: pressed ? 0.98 : 1 }] },
                                isLoading && styles.upgradeBtnDisabled,
                            ]}
                            onPress={handleUpgrade}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={["#2D2A26", "#1A1918"]}
                                style={styles.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={styles.upgradeText}>
                                        Continue with {selectedPlan === "yearly" ? "Yearly" : "Monthly"}
                                    </Text>
                                )}
                            </LinearGradient>
                        </Pressable>

                        <Pressable onPress={onClose} style={styles.notNowBtn}>
                            <Text style={styles.notNowText}>Not now</Text>
                        </Pressable>

                        {/* Footer Note */}
                        <Text style={styles.footerNote}>
                            Cancel anytime. Secure payment via Polar.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    container: {
        width: "100%",
        maxHeight: SCREEN_HEIGHT * 0.85,
        backgroundColor: "#FAF7F2",
        borderRadius: 24,
        padding: 20,
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
    scrollContent: {
        alignItems: "center",
        paddingTop: 8,
    },
    header: {
        alignItems: "center",
        marginBottom: 16,
    },
    crownContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FEF3C7",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        color: "#2D2A26",
        marginBottom: 2,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 13,
        fontFamily: "Poppins_500Medium",
        color: "#6B6560",
        textAlign: "center",
        lineHeight: 18,
    },
    plansContainer: {
        width: "100%",
        gap: 10,
        marginBottom: 16,
    },
    planCard: {
        width: "100%",
        padding: 12,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: "#E5E2DD",
        backgroundColor: "#FFFFFF",
    },
    planCardSelected: {
        borderColor: "#2D2A26",
        backgroundColor: "#FDFCFB",
    },
    planHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    planInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    planName: {
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        color: "#2D2A26",
    },
    savingsBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#D1FAE5",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    savingsText: {
        fontSize: 11,
        fontFamily: "Poppins_600SemiBold",
        color: "#059669",
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        justifyContent: "center",
        alignItems: "center",
    },
    radioOuterSelected: {
        borderColor: "#2D2A26",
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#2D2A26",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    priceAmount: {
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
        color: "#2D2A26",
    },
    priceInterval: {
        fontSize: 13,
        fontFamily: "Poppins_500Medium",
        color: "#6B6560",
        marginLeft: 2,
    },
    priceSubtext: {
        fontSize: 11,
        fontFamily: "Poppins_400Regular",
        color: "#8C877F",
        marginTop: 1,
    },
    features: {
        width: "100%",
        gap: 10,
        marginBottom: 16,
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
        height: 52,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 8,
        shadowColor: "#2D2A26",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    upgradeBtnDisabled: {
        opacity: 0.7,
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
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    notNowText: {
        fontSize: 14,
        fontFamily: "Poppins_500Medium",
        color: "#8C877F",
    },
    footerNote: {
        fontSize: 11,
        fontFamily: "Poppins_400Regular",
        color: "#A8A29E",
        textAlign: "center",
        marginTop: -10,
    },
});
