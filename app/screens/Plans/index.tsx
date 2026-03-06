
import { buildCheckoutUrl, PlanId } from "@/api/polar";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { markAsPremium } from "@/utils/subscription";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Check, ChevronRight, Crown, Sparkles, Zap } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PlansScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { isPremium, refreshSubscription } = useSubscription();
    const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

    const handleSubscribe = async (planId: PlanId) => {
        if (!user?.email) {
            Alert.alert("Error", "Please sign in to subscribe.");
            return;
        }

        setLoadingPlan(planId);
        try {
            const checkoutUrl = buildCheckoutUrl(planId, user.email);
            console.log("🛒 Opening checkout:", checkoutUrl);

            const result = await WebBrowser.openAuthSessionAsync(
                checkoutUrl,
                `promptkit://upgrade-success`
            );

            console.log("🔄 Browser result:", result);

            if (result.type === "success") {
                // Parse the checkout ID from the return URL for reference
                const returnUrl = result.url;
                const checkoutId = returnUrl ? new URL(returnUrl).searchParams.get("checkout_id") : null;
                console.log("✅ Checkout completed! Checkout ID:", checkoutId);

                // Optimistically mark the user as premium
                await markAsPremium(user.email, planId);
                // Also refresh to sync from Firebase
                await refreshSubscription();

                Alert.alert(
                    "🎉 Welcome to Pro!",
                    "Your subscription is now active. Enjoy unlimited access!",
                    [{ text: "Let's Go!", onPress: () => router.back() }]
                );
            } else if (result.type === "cancel" || result.type === "dismiss") {
                console.log("🚪 User cancelled checkout");
            }
        } catch (error) {
            console.error("❌ Checkout error:", error);
            Alert.alert("Error", "Failed to start checkout process.");
        } finally {
            setLoadingPlan(null);
        }
    };

    const FeatureItem = ({ text, dark }: { text: string; dark?: boolean }) => (
        <View style={styles.featureItem}>
            <View style={[styles.checkCircle, dark ? styles.checkCircleDark : styles.checkCircleLight]}>
                <Check size={12} color={dark ? "#FCD34D" : "#10B981"} strokeWidth={3} />
            </View>
            <Text style={[styles.featureText, dark && styles.featureTextDark]}>{text}</Text>
        </View>
    );

    return (
        <View style={styles.screen}>
            <Header title="Subscription Plans" onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Choose Your Plan</Text>
                    <Text style={styles.subtitle}>Unlock the full power of PromptKit</Text>
                </View>

                {/* Free Plan */}
                <View style={[styles.card, styles.freeCard]}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.planName}>Free Starter</Text>
                            <Text style={styles.planPrice}>$0</Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <Zap size={24} color="#6B7280" fill="#E5E7EB" />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.featuresList}>
                        <FeatureItem text="8 Free Requests Total" />
                        <FeatureItem text="Access Basic Models" />
                        <FeatureItem text="Standard Support" />
                    </View>

                    <View style={[styles.curentPlanBadge, !isPremium ? {} : { display: 'none' }]}>
                        <Text style={styles.currentPlanText}>Current Plan</Text>
                    </View>
                </View>

                {/* Pro Label */}
                <View style={styles.proLabelContainer}>
                    <LinearGradient
                        colors={["#F59E0B", "#D97706"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.proLabelGradient}
                    >
                        <Crown size={14} color="#FFF" fill="#FFF" />
                        <Text style={styles.proLabelText}>RECOMMENDED</Text>
                    </LinearGradient>
                </View>

                {/* Monthly Plan */}
                <LinearGradient
                    colors={["#1F2937", "#111827"]}
                    style={styles.proCard}
                >
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.proPlanName}>Pro Monthly</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Text style={styles.proPlanPrice}>$5</Text>
                                <Text style={styles.proPlanInterval}>/mo</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.proDivider} />

                    <View style={styles.featuresList}>
                        <FeatureItem text="Unlimited Requests" dark />
                        <FeatureItem text="Access All Advanced Models" dark />
                        <FeatureItem text="Priority Support" dark />
                        <FeatureItem text="Early Access to Features" dark />
                    </View>

                    {isPremium ? (
                        <View style={styles.activePlanButton}>
                            <Check size={16} color="#10B981" />
                            <Text style={styles.activePlanText}>Active Plan</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.subscribeButton}
                            onPress={() => handleSubscribe("monthly")}
                            disabled={loadingPlan === "monthly"}
                        >
                            {loadingPlan === "monthly" ? (
                                <ActivityIndicator color="#111827" size="small" />
                            ) : (
                                <>
                                    <Text style={styles.subscribeButtonText}>Subscribe Monthly</Text>
                                    <ChevronRight size={16} color="#111827" />
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </LinearGradient>

                {/* Yearly Plan */}
                <LinearGradient
                    colors={["#1F2937", "#111827"]}
                    style={[styles.proCard, { marginTop: 20 }]}
                >
                    <View style={styles.savingBadge}>
                        <Sparkles size={12} color="#FFF" fill="#10B981" />
                        <Text style={styles.savingText}>SAVE 17%</Text>
                    </View>

                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.proPlanName}>Pro Annually</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Text style={styles.proPlanPrice}>$50</Text>
                                <Text style={styles.proPlanInterval}>/year</Text>
                            </View>
                            <Text style={styles.priceSubtext}>Like getting 2 months free per year!</Text>
                        </View>
                    </View>

                    <View style={styles.proDivider} />

                    <View style={styles.featuresList}>
                        <FeatureItem text="All Pro Features" dark />
                        <FeatureItem text="Best Value for Power Users" dark />
                    </View>

                    {isPremium ? (
                        <View style={styles.activePlanButton}>
                            <Check size={16} color="#10B981" />
                            <Text style={styles.activePlanText}>Active Plan</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.subscribeButton}
                            onPress={() => handleSubscribe("yearly")}
                            disabled={loadingPlan === "yearly"}
                        >
                            {loadingPlan === "yearly" ? (
                                <ActivityIndicator color="#111827" size="small" />
                            ) : (
                                <>
                                    <Text style={styles.subscribeButtonText}>Subscribe Annually</Text>
                                    <ChevronRight size={16} color="#111827" />
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </LinearGradient>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FAF7F2",
    },
    scrollContent: {
        padding: 24,
        paddingTop: 10,
    },
    headerSection: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
        color: "#1F2937",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "#6B7280",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    freeCard: {
        marginTop: 8,
    },
    proCard: {
        borderRadius: 20,
        padding: 24,
        shadowColor: "#F59E0B",
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        position: 'relative',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    planName: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#374151",
        marginBottom: 4,
    },
    planPrice: {
        fontSize: 32,
        fontFamily: "Poppins_700Bold",
        color: "#111827",
    },
    proPlanName: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#F3F4F6",
        marginBottom: 4,
    },
    proPlanPrice: {
        fontSize: 32,
        fontFamily: "Poppins_700Bold",
        color: "#FFFFFF",
    },
    proPlanInterval: {
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        color: "#9CA3AF",
        marginLeft: 4,
    },
    priceSubtext: {
        fontSize: 12,
        fontFamily: "Poppins_400Regular",
        color: "#10B981",
        marginTop: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginBottom: 16,
    },
    proDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginBottom: 16,
    },
    featuresList: {
        gap: 12,
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    checkCircleLight: {
        backgroundColor: "#D1FAE5",
    },
    checkCircleDark: {
        backgroundColor: "rgba(245, 158, 11, 0.2)",
    },
    featureText: {
        fontSize: 14,
        fontFamily: "Poppins_500Medium",
        color: "#4B5563",
    },
    featureTextDark: {
        color: "#D1D5DB",
    },
    curentPlanBadge: {
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 8,
    },
    currentPlanText: {
        fontSize: 14,
        fontFamily: "Poppins_600SemiBold",
        color: "#4B5563",
    },
    proLabelContainer: {
        alignItems: "center",
        marginBottom: -12,
        zIndex: 10,
    },
    proLabelGradient: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: "#F59E0B",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    proLabelText: {
        fontSize: 12,
        fontFamily: "Poppins_700Bold",
        color: "#FFFFFF",
        letterSpacing: 1,
    },
    subscribeButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    subscribeButtonText: {
        fontSize: 15,
        fontFamily: "Poppins_600SemiBold",
        color: "#111827",
    },
    activePlanButton: {
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "rgba(16, 185, 129, 0.4)",
    },
    activePlanText: {
        fontSize: 15,
        fontFamily: "Poppins_600SemiBold",
        color: "#10B981",
    },
    savingBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20, // doesn't matter much inside overflow hidden
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    savingText: {
        fontSize: 10,
        fontFamily: "Poppins_700Bold",
        color: "#10B981",
        letterSpacing: 0.5,
    },
});
