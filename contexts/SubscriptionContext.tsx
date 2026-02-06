import PaywallModal from "@/components/PaywallModal";
import { getAllServiceUsage, trackServiceUsage } from "@/utils/usageTracker";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface SubscriptionContextType {
    isPremium: boolean;
    checkAccess: (serviceName: string) => boolean;
    incrementUsage: (serviceName: string) => Promise<void>;
    isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
    isPremium: false,
    checkAccess: (serviceName: string) => false,
    incrementUsage: async () => { },
    isLoading: true,
});

export const useSubscription = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [usageMap, setUsageMap] = useState<Record<string, number>>({});
    const [isPremium, setIsPremium] = useState(false);
    const [paywallVisible, setPaywallVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setUsageMap({});
            setIsLoading(false);
            return;
        }

        const loadUsage = async () => {
            try {
                const usageData = await getAllServiceUsage();
                console.log("📊 Usage loaded:", usageData);
                setUsageMap(usageData);
            } catch (error) {
                console.error("Failed to load usage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsage();
    }, [user]);

    const checkAccess = (serviceName: string) => {
        if (isPremium) return true;

        const count = usageMap[serviceName] || 0;

        if (count >= 2) {
            setPaywallVisible(true);
            return false;
        }

        return true;
    };

    const incrementUsage = async (serviceName: string) => {
        if (isPremium) return;

        setUsageMap(prev => ({
            ...prev,
            [serviceName]: (prev[serviceName] || 0) + 1
        }));

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
