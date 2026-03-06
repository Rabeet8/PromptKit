import { trackServiceUsage } from "@/utils/usageTracker";
import React, { createContext, useCallback, useContext } from "react";

interface SubscriptionContextType {
    isPremium: boolean;
    subscription: any | null;
    checkAccess: (serviceName: string) => boolean;
    incrementUsage: (serviceName: string) => Promise<void>;
    refreshSubscription: () => Promise<void>;
    showPaywall: () => void;
    isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
    isPremium: true,
    subscription: { isPremium: true },
    checkAccess: () => true,
    incrementUsage: async (serviceName: string) => { await trackServiceUsage(serviceName); },
    refreshSubscription: async () => { },
    showPaywall: () => { },
    isLoading: false,
});

export const useSubscription = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const incrementUsage = useCallback(async (serviceName: string) => {
        await trackServiceUsage(serviceName);
    }, []);

    return (
        <SubscriptionContext.Provider
            value={{
                isPremium: true,
                subscription: { isPremium: true },
                checkAccess: () => true,
                incrementUsage,
                refreshSubscription: async () => { },
                showPaywall: () => { },
                isLoading: false,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

