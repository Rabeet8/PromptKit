import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    BadgeDollarSign,
    Blocks,
    Sparkles,
    Zap,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ONBOARDING_KEY = "@promptkit_onboarding_completed";

interface OnboardingSlide {
    id: number;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;
    features?: string[];
}

const slides: OnboardingSlide[] = [
    {
        id: 1,
        title: "Welcome to\nPromptKit",
        subtitle: "Your all-in-one AI developer toolkit for mobile",
        icon: <Sparkles size={80} color="#2D2A26" strokeWidth={2} />,
        bgColor: "#E9F0FF",
    },
    {
        id: 2,
        title: "Powerful AI\nUtilities",
        subtitle: "Everything you need to work smarter with AI",
        icon: <Blocks size={80} color="#2D2A26" strokeWidth={2} />,
        bgColor: "#E3F8EC",

    },
    {
        id: 3,
        title: "Work Faster\nAnywhere",
        subtitle: "Optimize your AI workflow on the go",
        icon: <Zap size={80} color="#2D2A26" strokeWidth={2} />,
        bgColor: "#F5E6FF",
    },
    {
        id: 4,
        title: "Let's Get\nStarted",
        subtitle: "Build amazing AI experiences on the go",
        icon: <BadgeDollarSign size={80} color="#2D2A26" strokeWidth={2} />,
        bgColor: "#FFE8E8",
    },
];

export default function Onboarding() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            // Reset animations
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
            scaleAnim.setValue(0.8);
            setCurrentIndex(currentIndex + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, "true");
            router.replace("/screens/Auth");
        } catch (error) {
            console.error("Failed to save onboarding status:", error);
            router.replace("/screens/Auth");
        }
    };

    const currentSlide = slides[currentIndex];

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: currentSlide.bgColor },
            ]}
        >
            <StatusBar
                style="dark"
                backgroundColor={currentSlide.bgColor}
            />

            {/* Skip Button - Always present to prevent content jumping */}
            <Pressable
                onPress={handleSkip}
                disabled={currentIndex === slides.length - 1}
                style={({ pressed }) => [
                    styles.skipBtn,
                    {
                        opacity: currentIndex === slides.length - 1 ? 0 : (pressed ? 0.6 : 1),
                        pointerEvents: currentIndex === slides.length - 1 ? 'none' : 'auto',
                    },
                ]}
            >
                <Text style={styles.skipText}>Skip</Text>
            </Pressable>

            {/* Main Content */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                    },
                ]}
            >
                {/* Icon Container */}
                <View style={styles.iconContainer}>
                    {/* Animated rings around icon - BEHIND the icon */}
                    <Animated.View
                        style={[
                            styles.pulseRing,
                            {
                                opacity: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 0.3],
                                }),
                                transform: [
                                    {
                                        scale: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.8, 1.2],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.pulseRing2,
                            {
                                opacity: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 0.2],
                                }),
                                transform: [
                                    {
                                        scale: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.9, 1.4],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />

                    {/* Icon Circle - ON TOP of rings */}
                    <View style={styles.iconCircle}>{currentSlide.icon}</View>
                </View>

                {/* Title */}
                <Text style={styles.title}>{currentSlide.title}</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>

                {/* Features List (only for slide 2) */}
                {currentSlide.features && (
                    <View style={styles.featuresContainer}>
                        {currentSlide.features.map((feature, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.featureItem,
                                    {
                                        opacity: fadeAnim,
                                        transform: [
                                            {
                                                translateX: fadeAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [-20, 0],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <View style={styles.featureDot} />
                                <Text style={styles.featureText}>{feature}</Text>
                            </Animated.View>
                        ))}
                    </View>
                )}
            </Animated.View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: index === currentIndex ? "#2D2A26" : "#C4BFB8",
                                    width: index === currentIndex ? 32 : 8,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Next/Get Started Button */}
                <Pressable
                    onPress={handleNext}
                    style={({ pressed }) => [
                        styles.nextBtn,
                        { transform: [{ scale: pressed ? 0.96 : 1 }] },
                    ]}
                >
                    <Text style={styles.nextBtnText}>
                        {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 40,
        paddingHorizontal: 24,
    },
    skipBtn: {
        alignSelf: "flex-end",
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 20,
        marginTop: 50,
    },
    skipText: {
        fontSize: 15,
        fontFamily: "Poppins_600SemiBold",
        color: "#2D2A26",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    iconContainer: {
        marginBottom: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
    },
    pulseRing: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 2,
        borderColor: "#2D2A26",
    },
    pulseRing2: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "#2D2A26",
    },
    title: {
        fontSize: 42,
        fontFamily: "Poppins_700Bold",
        color: "#2D2A26",
        textAlign: "center",
        marginVertical: 30,
        lineHeight: 50,
    },
    subtitle: {
        fontSize: 17,
        fontFamily: "Poppins_500Medium",
        color: "#6B6560",
        textAlign: "center",
        lineHeight: 26,
        paddingHorizontal: 10,
    },
    featuresContainer: {
        marginTop: 40,
        width: "100%",
        paddingHorizontal: 20,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },
    featureDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#2D2A26",
        marginRight: 14,
    },
    featureText: {
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        color: "#2D2A26",
    },
    bottomSection: {
        paddingTop: 20,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    nextBtn: {
        backgroundColor: "#2D2A26",
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    nextBtnText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontFamily: "Poppins_600SemiBold",
        textAlign: "center",
    },
});

// Export helper function to check onboarding status
export async function hasCompletedOnboarding(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        return value === "true";
    } catch (error) {
        console.error("Failed to check onboarding status:", error);
        return false;
    }
}
