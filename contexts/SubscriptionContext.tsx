import { PlanId } from "@/api/polar";
import PaywallModal from "@/components/PaywallModal";
import {
    getLocalSubscription,
    markAsPremium,
    SubscriptionStatus,
    syncSubscription,
} from "@/utils/subscription";
import { getAllServiceUsage, trackServiceUsage } from "@/utils/usageTracker";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface SubscriptionContextType {
    isPremium: boolean;
    subscription: SubscriptionStatus | null;
    checkAccess: (serviceName: string) => boolean;
    incrementUsage: (serviceName: string) => Promise<void>;
    refreshSubscription: () => Promise<void>;
    showPaywall: () => void;
    isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
    isPremium: false,
    subscription: null,
    checkAccess: () => false,
    incrementUsage: async () => { },
    refreshSubscription: async () => { },
    showPaywall: () => { },
    isLoading: true,
});

export const useSubscription = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [usageMap, setUsageMap] = useState<Record<string, number>>({});
    const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
    const [paywallVisible, setPaywallVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isPremium = subscription?.isPremium ?? false;
    const totalUsage = Object.values(usageMap).reduce((sum, count) => sum + count, 0);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            if (!user) {
                setUsageMap({});
                setSubscription(null);
                setIsLoading(false);
                return;
            }

            try {
                const usageData = await getAllServiceUsage();
                console.log("📊 Usage loaded:", usageData);
                setUsageMap(usageData);


                const localSub = await getLocalSubscription();
                if (localSub.isPremium) {
                    setSubscription(localSub);
                }

                if (user.email) {
                    const firebaseSub = await syncSubscription(user.email);
                    console.log("🔄 Subscription synced:", firebaseSub);
                    setSubscription(firebaseSub);
                }
            } catch (error) {
                console.error("Failed to load subscription data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    const refreshSubscription = useCallback(async () => {
        if (!user?.email) return;

        try {
            const firebaseSub = await syncSubscription(user.email);
            console.log("🔄 Subscription refreshed:", firebaseSub);
            setSubscription(firebaseSub);
        } catch (error) {
            console.error("Failed to refresh subscription:", error);
        }
    }, [user?.email]);

    const checkAccess = useCallback((serviceName: string) => {
        if (isPremium) return true;

        if (totalUsage >= 8) {
            setPaywallVisible(true);
            return false;
        }

        return true;
    }, [isPremium, totalUsage]);

    const incrementUsage = useCallback(async (serviceName: string) => {
        if (isPremium) return;

        setUsageMap(prev => ({
            ...prev,
            [serviceName]: (prev[serviceName] || 0) + 1
        }));

        await trackServiceUsage(serviceName);
    }, [isPremium]);

    const showPaywall = useCallback(() => {
        setPaywallVisible(true);
    }, []);

    const handleUpgradeSuccess = useCallback(async (plan: PlanId) => {
        if (!user?.email) {
            console.error("❌ No user email for upgrade");
            return;
        }

        try {
            console.log("🎉 Upgrade successful! Plan:", plan);
            const newSubscription = await markAsPremium(user.email, plan);
            setSubscription(newSubscription);
            console.log("✅ Subscription updated:", newSubscription);
        } catch (error) {
            console.error("Failed to update subscription:", error);
        }
    }, [user?.email]);

    return (
        <SubscriptionContext.Provider
            value={{
                isPremium,
                subscription,
                checkAccess,
                incrementUsage,
                refreshSubscription,
                showPaywall,
                isLoading,
            }}
        >
            {children}
            <PaywallModal
                visible={paywallVisible}
                onClose={() => setPaywallVisible(false)}
                onUpgradeSuccess={handleUpgradeSuccess}
                isLimitReached={totalUsage >= 8}
            />
        </SubscriptionContext.Provider>
    );
}
