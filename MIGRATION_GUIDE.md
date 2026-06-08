# Quick Migration Reference: Mock Data → Appwrite

## Authentication

### Current (Mock Data)

```javascript
// login.jsx
const user = users.find((u) => u.email === email);
login(user);
router.replace("/(tabs)");
```

### With Appwrite

```javascript
// login.jsx
const result = await login(email, password);
if (result.success) {
  router.replace("/(tabs)");
} else {
  Alert.alert("Error", result.error);
}
```

---

## Fetching Data

### Current (Mock Data)

```javascript
// Import and use directly
import { campsites } from "@/data/mockData";
const filteredCampsites = campsites.filter(...);
```

### With Appwrite

```javascript
// Fetch from database
import { campsiteService } from "@/services/appwriteService";

const [campsites, setCampsites] = useState([]);

useEffect(() => {
  const loadCampsites = async () => {
    const data = await campsiteService.getAllCampsites();
    setCampsites(data);
  };
  loadCampsites();
}, []);
```

---

## Creating Records

### Current (Mock Data)

```javascript
// Create in memory (doesn't persist)
const newCampsite = {
  id: Date.now(),
  name: campsite.name,
  // ... other fields
};
Alert.alert("Success", "Campsite added!");
```

### With Appwrite

```javascript
// Save to database (persists)
try {
  const newCampsite = await campsiteService.createCampsite({
    name: campsite.name,
    description: campsite.description,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    addedBy: user.id,
    // ... other fields
  });
  Alert.alert("Success", "Campsite added!");
} catch (error) {
  Alert.alert("Error", "Failed to add campsite");
}
```

---

## Updating Records

### Current (Mock Data)

```javascript
// Update local state only
setLocalPosts((prevPosts) =>
  prevPosts.map((post) =>
    post.id === postId ? { ...post, likes: post.likes + 1 } : post,
  ),
);
```

### With Appwrite

```javascript
// Update in database
try {
  await postService.toggleLike(postId, user.id, post.likedBy);
  // Reload data or update local state
  loadPosts();
} catch (error) {
  Alert.alert("Error", "Failed to like post");
}
```

---

## Filtering Data

### Current (Mock Data)

```javascript
// Filter in JavaScript
const userCampsites = campsites.filter(
  (campsite) => campsite.addedBy === user.id,
);
```

### With Appwrite

```javascript
// Filter with database query
const userCampsites = await campsiteService.getUserCampsites(user.id);

// Or use Query builder:
const response = await databases.listDocuments(
  DATABASE_ID,
  COLLECTIONS.CAMPSITES,
  [Query.equal("addedBy", user.id)],
);
```

---

## Real-time Updates (Bonus!)

### With Appwrite

```javascript
import { client } from "@/config/appwrite";

useEffect(() => {
  // Subscribe to changes in campsites collection
  const unsubscribe = client.subscribe(
    `databases.${DATABASE_ID}.collections.${COLLECTIONS.CAMPSITES}.documents`,
    (response) => {
      // Handle real-time update
      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        console.log("New campsite added!");
        loadCampsites(); // Refresh data
      }
    },
  );

  return () => unsubscribe();
}, []);
```

---

## File Upload (Campsite Photos)

### With Appwrite Storage

```javascript
import { storage } from "@/config/appwrite";
import { ID } from "appwrite";
import * as ImagePicker from "expo-image-picker";

const uploadPhoto = async () => {
  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (!result.canceled) {
    try {
      // Create file object
      const file = {
        name: `campsite-${Date.now()}.jpg`,
        type: "image/jpeg",
        uri: result.assets[0].uri,
      };

      // Upload to Appwrite Storage
      const response = await storage.createFile(
        "BUCKET_ID", // Create bucket in Appwrite Console
        ID.unique(),
        file,
      );

      // Get file URL
      const fileUrl = storage.getFileView("BUCKET_ID", response.$id);

      // Save URL to campsite document
      await campsiteService.updateCampsite(campsiteId, {
        photos: [...campsite.photos, fileUrl],
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }
};
```

---

## Key Differences Summary

| Feature               | Mock Data         | Appwrite             |
| --------------------- | ----------------- | -------------------- |
| **Data Persistence**  | ❌ Lost on reload | ✅ Saved in database |
| **Multi-device Sync** | ❌ Local only     | ✅ Auto-synced       |
| **Authentication**    | ⚠️ Fake           | ✅ Real & secure     |
| **File Storage**      | ❌ Not available  | ✅ Built-in          |
| **Real-time Updates** | ❌ Manual refresh | ✅ Automatic         |
| **Querying**          | JS filter         | ✅ Database queries  |
| **Relationships**     | Manual            | ✅ Built-in          |
| **Permissions**       | Manual checks     | ✅ Database-level    |

---

## Migration Checklist

- [ ] Install Appwrite SDK
- [ ] Create Appwrite project & database
- [ ] Create collections with attributes
- [ ] Set up permissions
- [ ] Update AuthContext to use Appwrite
- [ ] Replace static imports with async data fetching
- [ ] Add loading states to components
- [ ] Add error handling
- [ ] Test all CRUD operations
- [ ] Set up file storage for photos
- [ ] (Optional) Add real-time subscriptions
