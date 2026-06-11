import { Account, Client, Databases, ID, Query, Storage } from "appwrite";
import { isDemoMode } from "./mode";

// Use environment variables for configuration
const APPWRITE_ENDPOINT =
  process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ||
  "https://sfo.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;

// Only initialize Appwrite if not in demo mode
let client = null;
let account = null;
let databases = null;
let storage = null;

if (!isDemoMode()) {
  if (!APPWRITE_PROJECT_ID || !APPWRITE_DATABASE_ID) {
    console.warn(
      "⚠️  Missing Appwrite configuration. Falling back to demo mode. " +
        "To use Appwrite, copy .env.example to .env and configure your credentials.",
    );
  } else {
    // Initialize Appwrite Client
    client = new Client();
    client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

    // Initialize services
    account = new Account(client);
    databases = new Databases(client);
    storage = new Storage(client);
  }
}

export { account, databases, ID, Query, storage };

// Database and Collection IDs
export const DATABASE_ID = APPWRITE_DATABASE_ID;
export const COLLECTIONS = {
  USERS: "users",
  CAMPSITES: "campsites",
  POSTS: "posts",
  COMMENTS: "comments",
  TRIPS: "trips",
  ACTIVITIES: "activities",
  CHECKLISTS: "checklists",
};

export default client;
