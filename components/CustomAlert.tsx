import { AlertCircle, CheckCircle, X, XCircle } from "lucide-react-native";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: "error" | "success" | "info";
    onClose: () => void;
    buttonText?: string;
    showCancelButton?: boolean;
    cancelText?: string;
    onCancel?: () => void;
    confirmButtonColor?: string;
}

export default function CustomAlert({
    visible,
    title,
    message,
    type = "info",
    onClose,
    buttonText = "OK",
    showCancelButton = false,
    cancelText = "Cancel",
    onCancel,
    confirmButtonColor = "#2B2A28",
}: CustomAlertProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const getIcon = () => {
        switch (type) {
            case "error":
                return <XCircle size={48} color="#E74C3C" strokeWidth={2.5} />;
            case "success":
                return <CheckCircle size={48} color="#27AE60" strokeWidth={2.5} />;
            default:
                return <AlertCircle size={48} color="#3498DB" strokeWidth={2.5} />;
        }
    };

    const getIconBgColor = () => {
        switch (type) {
            case "error":
                return "#FFE8E8";
            case "success":
                return "#E3F8EC";
            default:
                return "#E9F0FF";
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Pressable style={styles.overlayPressable} onPress={onClose} />
                <Animated.View
                    style={[
                        styles.alertContainer,
                        { transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    {/* Close Button (X) */}
                    <Pressable
                        onPress={onCancel || onClose}
                        style={styles.closeButton}
                        hitSlop={10}
                    >
                        <X size={24} color="#9CA3AF" />
                    </Pressable>

                    {/* Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: getIconBgColor() }]}>
                        {getIcon()}
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Message */}
                    <Text style={styles.message}>{message}</Text>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        {showCancelButton && (
                            <Pressable
                                onPress={onCancel || onClose}
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.cancelButton,
                                    styles.halfButton,
                                    { transform: [{ scale: pressed ? 0.98 : 1 }] },
                                ]}
                            >
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </Pressable>
                        )}
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.button,
                                showCancelButton ? styles.halfButton : styles.fullButton,
                                { backgroundColor: confirmButtonColor, transform: [{ scale: pressed ? 0.98 : 1 }] },
                            ]}
                        >
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    overlayPressable: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    alertContainer: {
        width: width - 60,
        maxWidth: 340,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 28,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
        position: 'relative', // Ensure relative positioning for absolute children
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        left: 16, // Left top as requested
        zIndex: 10,
        padding: 4,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        color: "#2B2A28",
        textAlign: "center",
        marginBottom: 12,
    },
    message: {
        fontSize: 15,
        fontFamily: "Poppins_500Medium",
        color: "#7A746D",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    fullButton: {
        width: "100%",
    },
    halfButton: {
        flex: 1,
    },
    cancelButton: {
        backgroundColor: "#F3F4F6",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        textAlign: "center",
        letterSpacing: 0.5,
    },
    cancelButtonText: {
        color: "#4B5563",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        textAlign: "center",
        letterSpacing: 0.5,
    },
});
