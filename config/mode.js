/**
 * App Mode Configuration
 *
 * Determines whether to use Appwrite backend or Demo mode with mock data
 */

// Check if Appwrite credentials are configured
const hasAppwriteConfig =
  process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID &&
  process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;

// Allow manual override to force demo mode
const forceDemoMode = process.env.EXPO_PUBLIC_FORCE_DEMO_MODE === "true";

/**
 * App Mode: 'appwrite' or 'demo'
 * - 'appwrite': Uses real Appwrite backend (requires configuration)
 * - 'demo': Uses mock data (no backend setup required)
 */
export const APP_MODE =
  forceDemoMode || !hasAppwriteConfig ? "demo" : "appwrite";

export const isAppwriteMode = () => APP_MODE === "appwrite";
export const isDemoMode = () => APP_MODE === "demo";

// Log current mode
console.log(`🔥 Campfire running in ${APP_MODE.toUpperCase()} mode`);
if (isDemoMode()) {
  console.log("📝 Using mock data. To use Appwrite, configure .env file.");
}
