import {
    account,
    COLLECTIONS,
    DATABASE_ID,
    databases,
    ID,
    Query,
} from "../config/appwrite";

// ============================================
// AUTH SERVICES
// ============================================

export const authService = {
  // Create account
  async register(email, password, name) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      // Create session after registration
      await this.login(email, password);
      return user;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // Login
  async login(email, password) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      return await account.deleteSession("current");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  // Get user profile from database
  async getUserProfile(userId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId,
      );
    } catch (error) {
      console.error("Get user profile error:", error);
      return null;
    }
  },

  // Create user profile in database
  async createUserProfile(userId, name, email) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId,
        {
          name: name,
          email: email,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
          bio: "Nature lover 🏕️",
        },
      );
    } catch (error) {
      console.error("Create user profile error:", error);
      throw error;
    }
  },
};

// ============================================
// CAMPSITE SERVICES
// ============================================

export const campsiteService = {
  // Get all campsites
  async getAllCampsites() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CAMPSITES,
      );
      return response.documents;
    } catch (error) {
      console.error("Get campsites error:", error);
      throw error;
    }
  },

  // Get campsite by ID
  async getCampsite(campsiteId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.CAMPSITES,
        campsiteId,
      );
    } catch (error) {
      console.error("Get campsite error:", error);
      throw error;
    }
  },

  // Create campsite
  async createCampsite(campsiteData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CAMPSITES,
        ID.unique(),
        {
          name: campsiteData.name,
          description: campsiteData.description,
          latitude: campsiteData.latitude,
          longitude: campsiteData.longitude,
          isPrivate: campsiteData.isPrivate,
          addedBy: campsiteData.addedBy,
          amenities: campsiteData.amenities,
          photos: campsiteData.photos || [],
          createdAt: new Date().toISOString(),
        },
      );
    } catch (error) {
      console.error("Create campsite error:", error);
      throw error;
    }
  },

  // Update campsite
  async updateCampsite(campsiteId, updates) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CAMPSITES,
        campsiteId,
        updates,
      );
    } catch (error) {
      console.error("Update campsite error:", error);
      throw error;
    }
  },

  // Delete campsite
  async deleteCampsite(campsiteId) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.CAMPSITES,
        campsiteId,
      );
    } catch (error) {
      console.error("Delete campsite error:", error);
      throw error;
    }
  },

  // Get user's campsites
  async getUserCampsites(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CAMPSITES,
        [Query.equal("addedBy", userId)],
      );
      return response.documents;
    } catch (error) {
      console.error("Get user campsites error:", error);
      throw error;
    }
  },
};

// ============================================
// POST SERVICES
// ============================================

export const postService = {
  // Get posts for a campsite
  async getCampsitePosts(campsiteId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.POSTS,
        [Query.equal("campsiteId", campsiteId)],
      );
      return response.documents;
    } catch (error) {
      console.error("Get campsite posts error:", error);
      throw error;
    }
  },

  // Create post
  async createPost(postData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.POSTS,
        ID.unique(),
        {
          campsiteId: postData.campsiteId,
          userId: postData.userId,
          userName: postData.userName,
          content: postData.content,
          timestamp: new Date().toISOString(),
          likes: 0,
          likedBy: [],
        },
      );
    } catch (error) {
      console.error("Create post error:", error);
      throw error;
    }
  },

  // Like/unlike post
  async toggleLike(postId, userId, currentLikedBy) {
    try {
      const isLiked = currentLikedBy.includes(userId);
      const newLikedBy = isLiked
        ? currentLikedBy.filter((id) => id !== userId)
        : [...currentLikedBy, userId];

      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.POSTS,
        postId,
        {
          likedBy: newLikedBy,
          likes: newLikedBy.length,
        },
      );
    } catch (error) {
      console.error("Toggle like error:", error);
      throw error;
    }
  },
};

// ============================================
// COMMENT SERVICES
// ============================================

export const commentService = {
  // Get comments for a post
  async getPostComments(postId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        [Query.equal("postId", postId)],
      );
      return response.documents;
    } catch (error) {
      console.error("Get post comments error:", error);
      throw error;
    }
  },

  // Create comment
  async createComment(commentData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        ID.unique(),
        {
          postId: commentData.postId,
          userId: commentData.userId,
          userName: commentData.userName,
          content: commentData.content,
          timeStamp: new Date().toISOString(),
        },
      );
    } catch (error) {
      console.error("Create comment error:", error);
      throw error;
    }
  },

  // Delete comment
  async deleteComment(commentId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        commentId,
      );
    } catch (error) {
      console.error("Delete comment error:", error);
      throw error;
    }
  },
};

// ============================================
// SUGGESTION SERVICES
// ============================================

export const suggestionService = {
  // Get suggestions for campsite owner
  async getUserSuggestions(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.SUGGESTIONS,
        [
          Query.equal("campsiteOwnerId", userId),
          Query.equal("status", "pending"),
        ],
      );
      return response.documents;
    } catch (error) {
      console.error("Get suggestions error:", error);
      throw error;
    }
  },

  // Create suggestion
  async createSuggestion(suggestionData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.SUGGESTIONS,
        ID.unique(),
        {
          campsiteId: suggestionData.campsiteId,
          campsiteOwnerId: suggestionData.campsiteOwnerId,
          userId: suggestionData.userId,
          userName: suggestionData.userName,
          type: suggestionData.type,
          content: suggestionData.content,
          status: "pending",
          submittedAt: new Date().toISOString(),
        },
      );
    } catch (error) {
      console.error("Create suggestion error:", error);
      throw error;
    }
  },

  // Approve suggestion
  async approveSuggestion(suggestionId) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.SUGGESTIONS,
        suggestionId,
        {
          status: "approved",
        },
      );
    } catch (error) {
      console.error("Approve suggestion error:", error);
      throw error;
    }
  },

  // Reject suggestion
  async rejectSuggestion(suggestionId) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.SUGGESTIONS,
        suggestionId,
        {
          status: "rejected",
        },
      );
    } catch (error) {
      console.error("Reject suggestion error:", error);
      throw error;
    }
  },
};

// ============================================
// ACTIVITY SERVICES
// ============================================

export const activityService = {
  // Get activities for a campsite
  async getCampsiteActivities(campsiteId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ACTIVITIES,
        [Query.equal("campsiteId", campsiteId)],
      );
      return response.documents;
    } catch (error) {
      console.error("Get activities error:", error);
      throw error;
    }
  },

  // Add activity
  async addActivity(activityData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ACTIVITIES,
        ID.unique(),
        {
          campsiteId: activityData.campsiteId,
          name: activityData.name,
          content: activityData.content,
          description: activityData.description || "",
          addedBy: activityData.addedBy,
        },
      );
    } catch (error) {
      console.error("Add activity error:", error);
      throw error;
    }
  },

  // Delete activity
  async deleteActivity(activityId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.ACTIVITIES,
        activityId,
      );
    } catch (error) {
      console.error("Delete activity error:", error);
      throw error;
    }
  },
};

// ============================================
// TRIP SERVICES
// ============================================

export const tripService = {
  // Get all trips for a user (as organizer or attendee)
  async getUserTrips(userId) {
    try {
      // Get trips where user is organizer
      const organizerTrips = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TRIPS,
        [Query.equal("organizer", userId)],
      );

      // Get trips where user is attendee
      const attendeeTrips = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TRIPS,
        [Query.search("attendees", userId)],
      );

      // Combine and deduplicate
      const allTrips = [
        ...organizerTrips.documents,
        ...attendeeTrips.documents,
      ];
      const uniqueTrips = Array.from(
        new Map(allTrips.map((trip) => [trip.$id, trip])).values(),
      );

      return uniqueTrips;
    } catch (error) {
      console.error("Get user trips error:", error);
      throw error;
    }
  },

  // Get trip by ID
  async getTrip(tripId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.TRIPS,
        tripId,
      );
    } catch (error) {
      console.error("Get trip error:", error);
      throw error;
    }
  },

  // Create trip
  async createTrip(tripData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TRIPS,
        ID.unique(),
        {
          name: tripData.name,
          campsiteName: tripData.campsiteName || "",
          campsiteIds: tripData.campsiteIds || [],
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          status: tripData.status || "planned",
          organizer: tripData.organizer,
          attendees: tripData.attendees || [],
        },
      );
    } catch (error) {
      console.error("Create trip error:", error);
      throw error;
    }
  },

  // Update trip
  async updateTrip(tripId, tripData) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TRIPS,
        tripId,
        tripData,
      );
    } catch (error) {
      console.error("Update trip error:", error);
      throw error;
    }
  },

  // Delete trip
  async deleteTrip(tripId) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TRIPS, tripId);
    } catch (error) {
      console.error("Delete trip error:", error);
      throw error;
    }
  },

  // Add attendee to trip
  async addAttendee(tripId, userId, currentAttendees) {
    try {
      const updatedAttendees = [...currentAttendees, userId];
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TRIPS,
        tripId,
        {
          attendees: updatedAttendees,
        },
      );
    } catch (error) {
      console.error("Add attendee error:", error);
      throw error;
    }
  },

  // Remove attendee from trip
  async removeAttendee(tripId, userId, currentAttendees) {
    try {
      const updatedAttendees = currentAttendees.filter((id) => id !== userId);
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TRIPS,
        tripId,
        {
          attendees: updatedAttendees,
        },
      );
    } catch (error) {
      console.error("Remove attendee error:", error);
      throw error;
    }
  },
};
