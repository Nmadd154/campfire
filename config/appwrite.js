import { Account, Client, Databases, ID, Query, Storage } from "appwrite";

// Initialize Appwrite Client
const client = new Client();

client
  .setEndpoint("https://sfo.cloud.appwrite.io/v1") // Appwrite San Francisco Region
  .setProject("6a259c030035e310c6cf"); // Your Appwrite Project ID

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };

// Database and Collection IDs
export const DATABASE_ID = "6a259caa000e07459e51";
export const COLLECTIONS = {
  USERS: "users",
  CAMPSITES: "campsites",
  POSTS: "posts",
  COMMENTS: "comments",
  TRIPS: "trips",
  ACTIVITIES: "activities",
  SUGGESTIONS: "suggestions",
};

export default client;
