import crypto from "crypto";

/**
 * Generates a license key in format: PROWL-XXXX-XXXX-XXXX-XXXX
 * Server-side only
 */
export function generateLicenseKey(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = () =>
    Array.from(
      { length: 4 },
      () => alphabet[Math.floor(Math.random() * alphabet.length)]
    ).join("");

  return `PROWL-${segment()}-${segment()}-${segment()}-${segment()}`;
}

/**
 * Hashes license key with HMAC-SHA256
 * MUST use same MASTER_SECRET as desktop app
 * Server-side only
 */
export function hashLicenseKey(key: string, masterSecret: string): string {
  return crypto
    .createHmac("sha256", masterSecret)
    .update(key.toUpperCase())
    .digest("hex");
}

/**
 * Validates license key format
 */
export function isValidLicenseKeyFormat(key: string): boolean {
  const KEY_REGEX =
    /^PROWL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return KEY_REGEX.test(key.toUpperCase());
}

/**
 * Plan config
 */
export const PLANS = {
  basic: {
    name: "Basic",
    color: "#667eea",
    features: [
      "Google Maps scraping",
      "Yelp & Yellow Pages",
      "CSV/Excel export",
      "Email extraction",
      "Basic filtering",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    color: "#764ba2",
    features: [
      "Everything in Basic",
      "Directory scraper with login",
      "Owner enrichment (LinkedIn, FB, IG)",
      "Site Learner templates",
      "AI fallback engine",
      "Priority support",
    ],
  },
  elite: {
    name: "Elite",
    color: "#ff6464",
    features: [
      "Everything in Pro",
      "Unlimited AI credits",
      "State registry lookup",
      "Bulk job scheduler",
      "Custom scraper scripts",
      "1-on-1 onboarding call",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/**
 * Pricing matrix
 * [plan][lifetime|subscription][1device|alldevices]
 */
export const PRICES: Record<
  PlanKey,
  Record<"lifetime" | "subscription", Record<"1" | "unlimited", number>>
> = {
  basic: {
    lifetime: { "1": 40, unlimited: 60 },
    subscription: { "1": 20, unlimited: 40 },
  },
  pro: {
    lifetime: { "1": 60, unlimited: 120 },
    subscription: { "1": 40, unlimited: 60 },
  },
  elite: {
    lifetime: { "1": 120, unlimited: 200 },
    subscription: { "1": 80, unlimited: 120 },
  },
};

export function getPrice(
  plan: PlanKey,
  duration: "lifetime" | "subscription",
  devices: "1" | "unlimited"
): number {
  return PRICES[plan][duration][devices];
}