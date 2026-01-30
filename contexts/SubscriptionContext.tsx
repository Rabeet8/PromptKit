import PaywallModal from "@/components/PaywallModal";
import { getAllServiceUsage, trackServiceUsage } from "@/utils/usageTracker";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface SubscriptionContextType {
    isPremium: boolean;
    checkAccess: () => boolean;
    incrementUsage: (serviceName: string) => Promise<void>;
    isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
    isPremium: false,
    checkAccess: () => false,
    incrementUsage: async () => { },
    isLoading: true,
});

export const useSubscription = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [usageCount, setUsageCount] = useState(0);
    const [isPremium, setIsPremium] = useState(false); // Default to free tier
    const [paywallVisible, setPaywallVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setUsageCount(0);
            setIsLoading(false);
            return;
        }

        const loadUsage = async () => {
            try {
                const usageData = await getAllServiceUsage();
                const total = Object.values(usageData).reduce((acc, curr) => acc + curr, 0);
                console.log("📊 Total usage loaded:", total);
                setUsageCount(total);
            } catch (error) {
                console.error("Failed to load usage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsage();
    }, [user]);

    const checkAccess = () => {
        if (isPremium) return true;

        if (usageCount >= 2) {
            setPaywallVisible(true);
            return false;
        }

        return true;
    };

    const incrementUsage = async (serviceName: string) => {
        if (isPremium) return;

        const newCount = usageCount + 1;
        setUsageCount(newCount);

        await trackServiceUsage(serviceName);
    };

    return (
        <SubscriptionContext.Provider value={{ isPremium, checkAccess, incrementUsage, isLoading }}>
            {children}
            <PaywallModal
                visible={paywallVisible}
                onClose={() => setPaywallVisible(false)}
            />
        </SubscriptionContext.Provider>
    );
}
