
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const textFadeAnim = useRef(new Animated.Value(0)).current;

    const [displayedText, setDisplayedText] = useState("");
    const fullText = "PromptKit";
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        // 1. Logo Enter Animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // 2. Start Typing after logo settles
            startTyping();
        });

        // Cursor Blinking
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, []);

    const startTyping = () => {
        // Reveal text container
        Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        let currentIndex = 0;
        const typeInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typeInterval);
                // 3. Wait a moment then finish
                setTimeout(() => {
                    onFinish();
                }, 1200);
            }
        }, 100);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                        alignItems: "center",
                    }}
                >
                    {/* Logo Image */}
                    <Image
                        source={require("../assets/images/icon.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* Text Container */}
                <Animated.View style={[styles.textWrapper, { opacity: textFadeAnim }]}>
                    <Text style={styles.appName}>
                        {displayedText}
                        <Text style={{ opacity: showCursor ? 1 : 0, color: "#2D2A26" }}>|</Text>
                    </Text>
                    <Text style={styles.tagline}>AI Prompt Engineering</Text>
                </Animated.View>
            </View>

            {/* Decorative Background */}
            <View style={styles.decorationCircle} />
            <View style={styles.decorationCircleSmall} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#FAF7F2",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
    },
    content: {
        alignItems: "center",
        marginBottom: 40,
        zIndex: 10,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    textWrapper: {
        alignItems: "center",
        height: 60, // Fixed height to prevent layout shift
    },
    appName: {
        fontSize: 32,
        fontFamily: "Poppins_700Bold",
        color: "#2D2A26",
        letterSpacing: 0.5,
    },
    tagline: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: "Poppins_500Medium",
        color: "#8B7E74",
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },
    decorationCircle: {
        position: "absolute",
        width: width * 1.6,
        height: width * 1.6,
        borderRadius: width * 0.8,
        backgroundColor: "#F5F0E8", // Subtle circle
        top: -width * 0.6,
        right: -width * 0.6,
        opacity: 0.6,
    },
    decorationCircleSmall: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "rgba(229, 231, 235, 0.3)",
        bottom: -50,
        left: -50,
    },
});
