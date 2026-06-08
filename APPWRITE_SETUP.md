# Appwrite Integration Guide for Campfire

This guide will help you connect your Campfire app to Appwrite for database functionality.

## Step 1: Create Appwrite Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io) or set up self-hosted Appwrite
2. Create a new project called "Campfire"
3. Note your Project ID

## Step 2: Install Dependencies

```bash
npm install appwrite react-native-appwrite
```

## Step 3: Configure Appwrite

1. Update `/config/appwrite.js` with your credentials:
   - Replace `YOUR_PROJECT_ID` with your Appwrite project ID
   - Replace `YOUR_DATABASE_ID` with your database ID (create in Appwrite Console)

2. In Appwrite Console, create a new database called "campfire"

## Step 4: Create Collections

In Appwrite Console, create these collections with their attributes:

### Collection: `users`

| Attribute | Type   | Required | Array |
| --------- | ------ | -------- | ----- |
| name      | String | Yes      | No    |
| email     | String | Yes      | No    |
| bio       | String | No       | No    |
| avatar    | String | No       | No    |

### Collection: `campsites`

| Attribute   | Type    | Required | Array |
| ----------- | ------- | -------- | ----- |
| name        | String  | Yes      | No    |
| description | String  | Yes      | No    |
| latitude    | Float   | Yes      | No    |
| longitude   | Float   | Yes      | No    |
| isPrivate   | Boolean | Yes      | No    |
| addedBy     | String  | Yes      | No    |
| amenities   | String  | No       | Yes   |
| photos      | String  | No       | Yes   |
| createdAt   | String  | Yes      | No    |

**Indexes:**

- Key: `addedBy`, Type: key, Attribute: addedBy

### Collection: `posts`

| Attribute  | Type    | Required | Array |
| ---------- | ------- | -------- | ----- |
| campsiteId | String  | Yes      | No    |
| userId     | String  | Yes      | No    |
| userName   | String  | Yes      | No    |
| content    | String  | Yes      | No    |
| image      | String  | No       | No    |
| likes      | Integer | Yes      | No    |
| likedBy    | String  | No       | Yes   |
| comments   | String  | No       | Yes   |
| createdAt  | String  | Yes      | No    |

**Indexes:**

- Key: `campsiteId`, Type: key, Attribute: campsiteId

### Collection: `trips`

| Attribute         | Type   | Required | Array |
| ----------------- | ------ | -------- | ----- |
| name              | String | Yes      | No    |
| campsiteId        | String | Yes      | No    |
| campsiteName      | String | Yes      | No    |
| startDate         | String | Yes      | No    |
| endDate           | String | Yes      | No    |
| status            | String | Yes      | No    |
| organizer         | String | Yes      | No    |
| attendees         | String | Yes      | Yes   |
| groupChecklist    | String | No       | Yes   |
| personalChecklist | String | No       | Yes   |

**Indexes:**

- Key: `organizer`, Type: key, Attribute: organizer

### Collection: `activities`

| Attribute  | Type   | Required | Array |
| ---------- | ------ | -------- | ----- |
| campsiteId | String | Yes      | No    |
| name       | String | Yes      | No    |
| createdAt  | String | Yes      | No    |

**Indexes:**

- Key: `campsiteId`, Type: key, Attribute: campsiteId

### Collection: `suggestions`

| Attribute       | Type   | Required | Array |
| --------------- | ------ | -------- | ----- |
| campsiteId      | String | Yes      | No    |
| campsiteOwnerId | String | Yes      | No    |
| userId          | String | Yes      | No    |
| userName        | String | Yes      | No    |
| type            | String | Yes      | No    |
| content         | String | Yes      | No    |
| status          | String | Yes      | No    |
| submittedAt     | String | Yes      | No    |

**Indexes:**

- Key: `campsiteOwnerId`, Type: key, Attribute: campsiteOwnerId
- Key: `status`, Type: key, Attribute: status

## Step 5: Set Collection Permissions

For each collection, set appropriate permissions:

### Example for `campsites`:

- **Create**: Any authenticated user
- **Read**: Any (for public) or Role: User (for private filtering in code)
- **Update**: Document Owner (addedBy field)
- **Delete**: Document Owner

### Example for `posts`:

- **Create**: Any authenticated user
- **Read**: Any
- **Update**: Document Owner
- **Delete**: Document Owner

## Step 6: Update Your Code

### Replace AuthContext

Replace imports in `app/_layout.jsx`:

```javascript
import { AuthProvider } from "@/context/AuthContextAppwrite";
```

### Update Login Screen

```javascript
import { useAuth } from "@/context/AuthContextAppwrite";

// In handleLogin:
const result = await login(email, password);
if (result.success) {
  router.replace("/(tabs)");
} else {
  Alert.alert("Login Failed", result.error);
}
```

### Update Map Screen to Fetch Campsites

```javascript
import { campsiteService } from "@/services/appwriteService";
import { useEffect, useState } from "react";

const [campsites, setCampsites] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadCampsites();
}, []);

const loadCampsites = async () => {
  try {
    const data = await campsiteService.getAllCampsites();
    setCampsites(data);
  } catch (error) {
    console.error("Error loading campsites:", error);
  } finally {
    setLoading(false);
  }
};
```

### Update Campsite Detail Screen

```javascript
import {
  campsiteService,
  postService,
  activityService,
} from "@/services/appwriteService";

// Load campsite data
useEffect(() => {
  loadCampsiteData();
}, [id]);

const loadCampsiteData = async () => {
  try {
    const [campsiteData, postsData, activitiesData] = await Promise.all([
      campsiteService.getCampsite(id),
      postService.getCampsitePosts(id),
      activityService.getCampsiteActivities(id),
    ]);

    setCampsite(campsiteData);
    setPosts(postsData);
    setActivities(activitiesData);
  } catch (error) {
    console.error("Error loading campsite:", error);
  }
};

// Handle add post
const handleAddPost = async () => {
  try {
    await postService.createPost({
      campsiteId: id,
      userId: user.id,
      userName: user.name,
      content: newPost,
    });
    // Reload posts
    loadCampsiteData();
  } catch (error) {
    Alert.alert("Error", "Failed to create post");
  }
};
```

## Step 7: Environment Variables (Optional)

Create `.env` file:

```
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
```

Update `config/appwrite.js`:

```javascript
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
```

## Step 8: Testing

1. Start your app: `npx expo start`
2. Test user registration
3. Test creating a campsite
4. Test adding posts
5. Test suggestions workflow

## Benefits of Appwrite

✅ **Real-time updates** - Use Appwrite's real-time subscriptions  
✅ **File storage** - Upload campsite photos to Appwrite Storage  
✅ **Authentication** - Secure user authentication out of the box  
✅ **Relationships** - Link users, campsites, posts automatically  
✅ **Permissions** - Fine-grained access control  
✅ **Cloud or Self-hosted** - Deploy anywhere

## Common Issues

### Issue: Session expired

**Solution:** Implement token refresh or re-login flow

### Issue: Permission denied

**Solution:** Check collection permissions in Appwrite Console

### Issue: Query limit reached

**Solution:** Use pagination with Query.limit() and Query.offset()

## Next Steps

1. Add photo upload functionality using Appwrite Storage
2. Implement real-time updates for posts and likes
3. Add push notifications for new suggestions
4. Implement geospatial queries for nearby campsites

## Resources

- [Appwrite Docs](https://appwrite.io/docs)
- [React Native Appwrite SDK](https://appwrite.io/docs/sdks#client)
- [Appwrite Discord](https://appwrite.io/discord)
