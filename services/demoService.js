/**
 * Demo Mode Service - Mock Data Implementation
 * Provides the same interface as Appwrite service but with mock data
 */

// Mock data storage (in-memory)
let mockUsers = [
  {
    $id: "demo-user-1",
    email: "demo@campfire.com",
    name: "Demo User",
    avatar: "https://i.pravatar.cc/150?u=demo@campfire.com",
    bio: "Nature lover 🏕️",
  },
];

let mockCampsites = [
  {
    $id: "1",
    name: "Yosemite Valley Campground",
    description: "Beautiful campground in the heart of Yosemite Valley",
    latitude: 37.7459,
    longitude: -119.5937,
    isPrivate: false,
    addedBy: "demo-user-1",
    amenities: ["Water", "Restrooms", "Fire Pits", "Picnic Tables"],
    photos: [],
    createdAt: new Date().toISOString(),
  },
  {
    $id: "2",
    name: "Big Sur Campsite",
    description: "Stunning coastal views and redwood forests",
    latitude: 36.2704,
    longitude: -121.8081,
    isPrivate: false,
    addedBy: "demo-user-1",
    amenities: ["Water", "Fire Pits", "Hiking Trails"],
    photos: [],
    createdAt: new Date().toISOString(),
  },
];

let mockPosts = [
  {
    $id: "post-1",
    campsiteId: "1",
    userId: "demo-user-1",
    userName: "Demo User",
    content: "Amazing sunrise this morning! 🌅",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 5,
    likedBy: [],
  },
];

let mockComments = [];
let mockActivities = [
  {
    $id: "activity-1",
    campsiteId: "1",
    name: "Hiking",
    content: "Multiple trails nearby",
    description: "Various difficulty levels available",
    addedBy: "demo-user-1",
  },
];

let mockTrips = [];
let mockChecklists = [];

// Current session
let currentSession = null;

// ============================================
// AUTH SERVICES (DEMO)
// ============================================

export const demoAuthService = {
  async register(email, password, name) {
    const newUser = {
      $id: `user-${Date.now()}`,
      email,
      name,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      bio: "Nature lover 🏕️",
    };
    mockUsers.push(newUser);
    currentSession = { userId: newUser.$id };
    return newUser;
  },

  async login(email, password) {
    // Demo mode: accept any credentials
    const user = mockUsers.find((u) => u.email === email) || mockUsers[0];
    currentSession = { userId: user.$id };
    return { userId: user.$id };
  },

  async logout() {
    currentSession = null;
    return null;
  },

  async getCurrentUser() {
    if (!currentSession) return null;
    return (
      mockUsers.find((u) => u.$id === currentSession.userId) || mockUsers[0]
    );
  },

  async getUserProfile(userId) {
    return mockUsers.find((u) => u.$id === userId) || null;
  },

  async createUserProfile(userId, name, email) {
    const profile = {
      $id: userId,
      name,
      email,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      bio: "Nature lover 🏕️",
    };
    mockUsers.push(profile);
    return profile;
  },
};

// ============================================
// CAMPSITE SERVICES (DEMO)
// ============================================

export const demoCampsiteService = {
  async getAllCampsites() {
    return [...mockCampsites];
  },

  async getCampsite(campsiteId) {
    return mockCampsites.find((c) => c.$id === campsiteId) || null;
  },

  async createCampsite(campsiteData) {
    const newCampsite = {
      $id: `campsite-${Date.now()}`,
      ...campsiteData,
      createdAt: new Date().toISOString(),
    };
    mockCampsites.push(newCampsite);
    return newCampsite;
  },

  async updateCampsite(campsiteId, updates) {
    const index = mockCampsites.findIndex((c) => c.$id === campsiteId);
    if (index !== -1) {
      mockCampsites[index] = { ...mockCampsites[index], ...updates };
      return mockCampsites[index];
    }
    return null;
  },

  async deleteCampsite(campsiteId) {
    mockCampsites = mockCampsites.filter((c) => c.$id !== campsiteId);
    return true;
  },

  async getUserCampsites(userId) {
    return mockCampsites.filter((c) => c.addedBy === userId);
  },
};

// ============================================
// POST SERVICES (DEMO)
// ============================================

export const demoPostService = {
  async getCampsitePosts(campsiteId) {
    return mockPosts.filter((p) => p.campsiteId === campsiteId);
  },

  async createPost(postData) {
    const newPost = {
      $id: `post-${Date.now()}`,
      ...postData,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };
    mockPosts.push(newPost);
    return newPost;
  },

  async toggleLike(postId, userId, currentLikedBy) {
    const post = mockPosts.find((p) => p.$id === postId);
    if (post) {
      const isLiked = currentLikedBy.includes(userId);
      const newLikedBy = isLiked
        ? currentLikedBy.filter((id) => id !== userId)
        : [...currentLikedBy, userId];

      post.likedBy = newLikedBy;
      post.likes = newLikedBy.length;
      return post;
    }
    return null;
  },
};

// ============================================
// COMMENT SERVICES (DEMO)
// ============================================

export const demoCommentService = {
  async getPostComments(postId) {
    return mockComments.filter((c) => c.postId === postId);
  },

  async createComment(commentData) {
    const newComment = {
      $id: `comment-${Date.now()}`,
      ...commentData,
      timeStamp: new Date().toISOString(),
    };
    mockComments.push(newComment);
    return newComment;
  },

  async deleteComment(commentId) {
    mockComments = mockComments.filter((c) => c.$id !== commentId);
    return true;
  },
};

// ============================================
// ACTIVITY SERVICES (DEMO)
// ============================================

export const demoActivityService = {
  async getCampsiteActivities(campsiteId) {
    return mockActivities.filter((a) => a.campsiteId === campsiteId);
  },

  async addActivity(activityData) {
    const newActivity = {
      $id: `activity-${Date.now()}`,
      ...activityData,
    };
    mockActivities.push(newActivity);
    return newActivity;
  },

  async deleteActivity(activityId) {
    mockActivities = mockActivities.filter((a) => a.$id !== activityId);
    return true;
  },
};

// ============================================
// TRIP SERVICES (DEMO)
// ============================================

export const demoTripService = {
  async getUserTrips(userId) {
    return mockTrips.filter(
      (t) =>
        t.organizer === userId || (t.attendees && t.attendees.includes(userId)),
    );
  },

  async getTrip(tripId) {
    return mockTrips.find((t) => t.$id === tripId) || null;
  },

  async createTrip(tripData) {
    const newTrip = {
      $id: `trip-${Date.now()}`,
      ...tripData,
      createdAt: new Date().toISOString(),
    };
    mockTrips.push(newTrip);
    return newTrip;
  },

  async updateTrip(tripId, updates) {
    const index = mockTrips.findIndex((t) => t.$id === tripId);
    if (index !== -1) {
      mockTrips[index] = { ...mockTrips[index], ...updates };
      return mockTrips[index];
    }
    return null;
  },

  async deleteTrip(tripId) {
    mockTrips = mockTrips.filter((t) => t.$id !== tripId);
    return true;
  },
};

// ============================================
// CHECKLIST SERVICES (DEMO)
// ============================================

export const demoChecklistService = {
  async getTripChecklists(userId, tripId) {
    return mockChecklists.filter(
      (c) => c.tripId === tripId && c.userId === userId,
    );
  },

  async createChecklistItem(itemData) {
    const newItem = {
      $id: `checklist-${Date.now()}`,
      ...itemData,
      completed: itemData.completed || false,
    };
    mockChecklists.push(newItem);
    return newItem;
  },

  async updateChecklistItem(itemId, updates) {
    const index = mockChecklists.findIndex((c) => c.$id === itemId);
    if (index !== -1) {
      mockChecklists[index] = { ...mockChecklists[index], ...updates };
      return mockChecklists[index];
    }
    return null;
  },

  async deleteChecklistItem(itemId) {
    mockChecklists = mockChecklists.filter((c) => c.$id !== itemId);
    return true;
  },
};
