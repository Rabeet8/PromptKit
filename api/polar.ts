
export const POLAR_CHECKOUT_URLS = {
    monthly: process.env.EXPO_PUBLIC_POLAR_CHECKOUT_MONTHLY || '',
    yearly: process.env.EXPO_PUBLIC_POLAR_CHECKOUT_YEARLY || '',
} as const;

export const SUBSCRIPTION_PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Monthly',
        price: 5,
        currency: 'USD',
        interval: 'month',
        checkoutUrl: POLAR_CHECKOUT_URLS.monthly,
        savings: null,
    },
    yearly: {
        id: 'yearly',
        name: 'Yearly',
        price: 50,
        currency: 'USD',
        interval: 'year',
        checkoutUrl: POLAR_CHECKOUT_URLS.yearly,
        savings: '17%',
    },
} as const;

export type PlanId = keyof typeof SUBSCRIPTION_PLANS;

export function buildCheckoutUrl(planId: PlanId, customerEmail?: string): string {
    const plan = SUBSCRIPTION_PLANS[planId];
    let url: string = plan.checkoutUrl;

    if (customerEmail) {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}customer_email=${encodeURIComponent(customerEmail)}`;
    }

    return url;
}


export function formatPrice(planId: PlanId): string {
    const plan = SUBSCRIPTION_PLANS[planId];
    return `$${plan.price}/${plan.interval === 'month' ? 'mo' : 'yr'}`;
}
