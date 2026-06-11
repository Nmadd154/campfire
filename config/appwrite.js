import { Account, Client, Databases, ID, Query, Storage } from "appwrite";

// Initialize Appwrite Client
const client = new Client();

// Use environment variables for configuration
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://sfo.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;

if (!APPWRITE_PROJECT_ID || !APPWRITE_DATABASE_ID) {
  throw new Error(
    "Missing Appwrite configuration. Please copy .env.example to .env and configure your Appwrite credentials."
  );
}

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };

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
