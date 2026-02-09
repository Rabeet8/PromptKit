
import { PlanId } from '@/api/polar';
import { database } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, ref, set } from 'firebase/database';

const SUBSCRIPTION_STORAGE_KEY = '@promptkit_subscription';

export interface SubscriptionStatus {
    isPremium: boolean;
    plan: PlanId | null;
    subscribedAt: string | null;
    expiresAt: string | null;
    email: string | null;
}

const DEFAULT_SUBSCRIPTION: SubscriptionStatus = {
    isPremium: false,
    plan: null,
    subscribedAt: null,
    expiresAt: null,
    email: null,
};

function sanitizeEmailForKey(email: string): string {
    return email.replace(/[.#$[\]]/g, '_');
}


export async function getLocalSubscription(): Promise<SubscriptionStatus> {
    try {
        const stored = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to get local subscription:', error);
    }
    return DEFAULT_SUBSCRIPTION;
}


export async function saveLocalSubscription(status: SubscriptionStatus): Promise<void> {
    try {
        await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(status));
    } catch (error) {
        console.error('Failed to save local subscription:', error);
    }
}

export async function getFirebaseSubscription(email: string): Promise<SubscriptionStatus> {
    try {
        const sanitizedEmail = sanitizeEmailForKey(email);
        const subscriptionRef = ref(database, `subscriptions/${sanitizedEmail}`);
        const snapshot = await get(subscriptionRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            return {
                isPremium: data.isPremium ?? false,
                plan: data.plan ?? null,
                subscribedAt: data.subscribedAt ?? null,
                expiresAt: data.expiresAt ?? null,
                email: email,
            };
        }
    } catch (error) {
        console.error('Failed to get Firebase subscription:', error);
    }
    return { ...DEFAULT_SUBSCRIPTION, email };
}

export async function saveFirebaseSubscription(
    email: string,
    status: Omit<SubscriptionStatus, 'email'>
): Promise<void> {
    try {
        const sanitizedEmail = sanitizeEmailForKey(email);
        const subscriptionRef = ref(database, `subscriptions/${sanitizedEmail}`);
        await set(subscriptionRef, {
            ...status,
            email: email,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Failed to save Firebase subscription:', error);
        throw error;
    }
}


export async function syncSubscription(email: string): Promise<SubscriptionStatus> {
    const firebaseStatus = await getFirebaseSubscription(email);
    await saveLocalSubscription(firebaseStatus);
    return firebaseStatus;
}


export async function markAsPremium(email: string, plan: PlanId): Promise<SubscriptionStatus> {
    const now = new Date();
    const expiresAt = new Date(now);

    if (plan === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    const status: SubscriptionStatus = {
        isPremium: true,
        plan,
        subscribedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        email,
    };

    await saveLocalSubscription(status);
    await saveFirebaseSubscription(email, status);

    return status;
}


export async function clearSubscription(): Promise<void> {
    await AsyncStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
}
