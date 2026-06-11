/**
 * Purpose: Detailed view of a specific campsite with posts, activities, and comments
 * Author: Nicholas Maddox
 * Date: 06/07/2026
 */

import { useAuth } from "@/context/AuthContextAppwrite";
import {
  activityService,
  campsiteService,
  commentService,
  postService,
} from "@/services";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CampsiteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [localPosts, setLocalPosts] = useState([]);
  const [postComments, setPostComments] = useState({}); // Store comments by postId
  const [newComment, setNewComment] = useState("");
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [newActivity, setNewActivity] = useState("");
  const [editableCampsite, setEditableCampsite] = useState(null);
  const [localActivities, setLocalActivities] = useState([]);
  const [campsite, setCampsite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch campsite and posts from Appwrite
  useEffect(() => {
    if (id) {
      loadCampsiteData();
    }
  }, [id]);

  const loadCampsiteData = async () => {
    try {
      setIsLoading(true);
      // Load campsite (required)
      const campsiteData = await campsiteService.getCampsite(id);
      setCampsite(campsiteData);

      // Load posts
      try {
        const postsData = await postService.getCampsitePosts(id);
        setLocalPosts(postsData);

        // Load comments for each post
        const commentsMap = {};
        for (const post of postsData) {
          try {
            const comments = await commentService.getPostComments(post.$id);
            commentsMap[post.$id] = comments;
          } catch (err) {
            commentsMap[post.$id] = [];
          }
        }
        setPostComments(commentsMap);
      } catch (postError) {
        setLocalPosts([]);
      }

      // Load activities from Appwrite
      try {
        const activitiesData = await activityService.getCampsiteActivities(id);
        setLocalActivities(activitiesData);
      } catch (actError) {
        setLocalActivities([]);
      }
    } catch (error) {
      console.error("Error loading campsite:", error);
      Alert.alert("Error", "Failed to load campsite details");
    } finally {
      setIsLoading(false);
    }
  };

  // Posts are already filtered by campsite ID from Appwrite
  const campsitePosts = localPosts;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!campsite) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600">Campsite not found</Text>
      </View>
    );
  }

  // Check if user owns this campsite
  const isOwner = isAuthenticated && user && campsite.addedBy === user.id;
  const canEdit = isOwner; // Users can edit all their created campsites

  // Check if this is a private campsite that the user doesn't own
  if (campsite.isPrivate && !isOwner) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-6xl mb-4">🔒</Text>
        <Text className="text-gray-800 text-xl font-bold mb-2">
          Private Campsite
        </Text>
        <Text className="text-gray-600 text-center px-8">
          This campsite is private and only visible to its creator.
        </Text>
        <TouchableOpacity
          className="bg-orange-500 px-6 py-3 rounded-lg mt-6"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLikePost = async (postId) => {
    if (!isAuthenticated || !user) return;

    try {
      const post = localPosts.find((p) => p.$id === postId);
      if (!post) return;

      const likedBy = post.likedBy || [];

      // Call Appwrite to toggle the like
      const updatedPost = await postService.toggleLike(
        postId,
        user.id,
        likedBy,
      );

      // Update local state
      setLocalPosts((prevPosts) =>
        prevPosts.map((p) => (p.$id === postId ? updatedPost : p)),
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error", "Failed to update like");
    }
  };

  const handleAddPost = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert("Login Required", "Please log in to post.");
      return;
    }
    if (newPost.trim()) {
      try {
        const post = await postService.createPost({
          campsiteId: id,
          userId: user.id,
          userName: user.name,
          content: newPost,
          image: null,
        });
        setLocalPosts([post, ...localPosts]);
        setNewPost("");
        setShowPostModal(false);
        Alert.alert("Success", "Your experience has been shared!");
      } catch (error) {
        console.error("Error creating post:", error);
        Alert.alert(
          "Error",
          "Failed to share your experience. Please try again.",
        );
      }
    }
  };

  const handleEditCampsite = () => {
    setEditableCampsite({ ...campsite });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editableCampsite) return;

    try {
      await campsiteService.updateCampsite(id, {
        name: editableCampsite.name,
        description: editableCampsite.description,
        amenities: editableCampsite.amenities,
      });

      // Reload campsite to show updated data
      await loadCampsiteData();
      Alert.alert("Success", "Campsite updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating campsite:", error);
      Alert.alert("Error", "Failed to update campsite. Please try again.");
    }
  };

  const handleAddActivity = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert("Login Required", "Please log in to add activities.");
      return;
    }
    if (newActivity.trim()) {
      try {
        const activity = await activityService.addActivity({
          campsiteId: id,
          name: newActivity,
          content: newActivity,
          description: "",
          addedBy: user.id,
        });
        setLocalActivities([...localActivities, activity]);
        Alert.alert("Success", `Activity "${newActivity}" added successfully!`);
        setNewActivity("");
        setShowAddActivityModal(false);
      } catch (error) {
        console.error("Error adding activity:", error);
        Alert.alert("Error", "Failed to add activity. Please try again.");
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!isAuthenticated || !user) {
      Alert.alert("Login Required", "Please log in to comment.");
      return;
    }
    if (newComment.trim()) {
      try {
        const comment = await commentService.createComment({
          postId: postId,
          userId: user.id,
          userName: user.name,
          content: newComment,
        });

        // Update local state
        setPostComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), comment],
        }));

        setNewComment("");
        setCommentingPostId(null);
        Alert.alert("Success", "Comment added!");
      } catch (error) {
        console.error("Error adding comment:", error);
        Alert.alert("Error", "Failed to add comment. Please try again.");
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Back Button */}
      <View className="bg-white pt-12 pb-2 px-4 border-b border-gray-200">
        <TouchableOpacity
          className="flex-row items-center py-2"
          onPress={() => router.back()}
        >
          <Text className="text-orange-600 text-lg mr-2">←</Text>
          <Text className="text-orange-600 text-base font-semibold">Back</Text>
        </TouchableOpacity>
      </View>

      {/* Header Image */}
      <View className="h-48 bg-green-500 items-center justify-center">
        <Text className="text-8xl">🏕️</Text>
        {campsite.isPrivate && (
          <View className="absolute top-4 right-4 bg-orange-500 px-3 py-2 rounded-full">
            <Text className="text-white text-sm font-semibold">🔒 Private</Text>
          </View>
        )}
      </View>

      {/* Campsite Info */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800">
              {campsite.name}
            </Text>
            <Text className="text-gray-600 mt-2">{campsite.description}</Text>
          </View>
          {canEdit && (
            <TouchableOpacity
              className="bg-orange-500 px-3 py-2 rounded-lg ml-2"
              onPress={handleEditCampsite}
            >
              <Text className="text-white font-semibold text-sm">✏️ Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Amenities */}
        <View className="flex-row flex-wrap mt-3">
          {campsite.amenities && campsite.amenities.length > 0 ? (
            campsite.amenities.map((amenity, index) => (
              <View
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full mr-2 mt-2"
              >
                <Text className="text-sm text-gray-700">✓ {amenity}</Text>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-500">No amenities listed</Text>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "posts" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("posts")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "posts" ? "text-orange-500" : "text-gray-600"}`}
          >
            Posts ({campsitePosts?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "activities" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("activities")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "activities" ? "text-orange-500" : "text-gray-600"}`}
          >
            Things To Do
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {activeTab === "posts" && (
          <View className="p-4">
            {/* Add Post Button */}
            <TouchableOpacity
              className="bg-orange-500 rounded-lg py-3 mb-4"
              onPress={() => setShowPostModal(true)}
            >
              <Text className="text-white text-center font-semibold">
                ✍️ Share Your Experience
              </Text>
            </TouchableOpacity>

            {/* Posts */}
            {campsitePosts && campsitePosts.length > 0 ? (
              campsitePosts.map((post) => {
                const isLiked = user && post.likedBy?.includes(user.id);
                return (
                  <View
                    key={post.$id}
                    className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden"
                  >
                    {/* Post Header */}
                    <View className="flex-row items-center p-4 pb-2">
                      <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center mr-3">
                        <Text className="text-xl">👤</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-800">
                          {post.userName}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {post.timestamp}
                        </Text>
                      </View>
                    </View>

                    {/* Post Content */}
                    <View className="px-4 pb-3">
                      <Text className="text-gray-800">{post.content}</Text>
                    </View>

                    {/* Post Image */}
                    {post.image && (
                      <View className="h-64 bg-blue-500 items-center justify-center">
                        <Text className="text-6xl">🏞️</Text>
                      </View>
                    )}

                    {/* Post Actions */}
                    <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-100">
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => handleLikePost(post.$id)}
                      >
                        <Text className="mr-2">{isLiked ? "❤️" : "🤍"}</Text>
                        <Text
                          className={`${isLiked ? "text-red-500 font-semibold" : "text-gray-600"}`}
                        >
                          {post.likes || 0}{" "}
                          {(post.likes || 0) === 1 ? "Like" : "Likes"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() =>
                          setCommentingPostId(
                            commentingPostId === post.$id ? null : post.$id,
                          )
                        }
                      >
                        <Text className="mr-2">💬</Text>
                        <Text className="text-gray-600">
                          {postComments[post.$id]?.length || 0} Comments
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Comments */}
                    {postComments[post.$id] &&
                      postComments[post.$id].length > 0 && (
                        <View className="px-4 pb-3 border-t border-gray-100">
                          {postComments[post.$id].map((comment) => (
                            <View key={comment.$id} className="flex-row mt-3">
                              <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center mr-2">
                                <Text className="text-sm">👤</Text>
                              </View>
                              <View className="flex-1 bg-gray-100 rounded-lg p-2">
                                <Text className="font-semibold text-sm text-gray-800">
                                  {comment.userName}
                                </Text>
                                <Text className="text-gray-700 text-sm">
                                  {comment.content}
                                </Text>
                                <Text className="text-gray-500 text-xs mt-1">
                                  {comment.timeStamp}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                    {/* Comment Input */}
                    {commentingPostId === post.$id && (
                      <View className="px-4 pb-3 border-t border-gray-100">
                        <View className="flex-row items-center mt-3">
                          <TextInput
                            className="flex-1 bg-gray-100 rounded-lg px-3 py-2 mr-2"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline
                          />
                          <TouchableOpacity
                            className="bg-orange-500 rounded-lg px-4 py-2"
                            onPress={() => handleAddComment(post.$id)}
                          >
                            <Text className="text-white font-semibold">
                              Post
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View className="items-center py-12">
                <Text className="text-6xl mb-4">📝</Text>
                <Text className="text-gray-600 text-center">No posts yet</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Be the first to share!
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "activities" && (
          <View className="p-4">
            {/* Activities Section */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Popular Activities
              </Text>
              {isOwner && (
                <TouchableOpacity
                  className="bg-orange-500 px-3 py-2 rounded-lg"
                  onPress={() => setShowAddActivityModal(true)}
                >
                  <Text className="text-white font-semibold text-sm">
                    ➕ Add Activity
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {localActivities.map((activity, index) => (
              <View
                key={activity.$id || index}
                className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm"
              >
                <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-2xl">⛰️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">
                    {activity.name || activity.content || activity}
                  </Text>
                </View>
              </View>
            ))}
            {localActivities.length === 0 && (
              <View className="items-center py-12">
                <Text className="text-6xl mb-4">🏕️</Text>
                <Text className="text-gray-600 text-center">
                  No activities listed yet
                </Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  {isOwner
                    ? "Add the first activity!"
                    : "Check back later for activities!"}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Post Modal */}
      <Modal
        visible={showPostModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPostModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[60%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">Share Your Experience</Text>
              <TouchableOpacity onPress={() => setShowPostModal(false)}>
                <Text className="text-2xl text-gray-400">✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 h-32 text-gray-800"
              placeholder="What's on your mind?"
              multiline
              value={newPost}
              onChangeText={setNewPost}
              autoFocus
            />

            <TouchableOpacity
              className="bg-orange-500 rounded-lg py-4 mt-4"
              onPress={handleAddPost}
            >
              <Text className="text-white text-center font-bold text-lg">
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Campsite Modal (for private campsite owners) */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">Edit Campsite</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text className="text-2xl text-gray-400">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Campsite Name
                </Text>
                <TextInput
                  className="bg-gray-100 rounded-lg px-4 py-3"
                  value={editableCampsite?.name}
                  onChangeText={(text) =>
                    setEditableCampsite({ ...editableCampsite, name: text })
                  }
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Description
                </Text>
                <TextInput
                  className="bg-gray-100 rounded-lg px-4 py-3 h-24"
                  placeholder="Describe the campsite..."
                  multiline
                  value={editableCampsite?.description}
                  onChangeText={(text) =>
                    setEditableCampsite({
                      ...editableCampsite,
                      description: text,
                    })
                  }
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Amenities (comma separated)
                </Text>
                <TextInput
                  className="bg-gray-100 rounded-lg px-4 py-3 h-20"
                  placeholder="Fire pit, Restrooms, Hiking trails"
                  multiline
                  value={editableCampsite?.amenities.join(", ")}
                  onChangeText={(text) =>
                    setEditableCampsite({
                      ...editableCampsite,
                      amenities: text.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </View>

              <TouchableOpacity
                className="bg-orange-500 rounded-lg py-4 mt-4"
                onPress={handleSaveEdit}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Save Changes
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Activity Modal (for owners) */}
      <Modal
        visible={showAddActivityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddActivityModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[60%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">Add Activity</Text>
              <TouchableOpacity onPress={() => setShowAddActivityModal(false)}>
                <Text className="text-2xl text-gray-400">✕</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-4">
              Add a new activity that campers can enjoy at your campsite.
            </Text>

            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 h-24 text-gray-800"
              placeholder="e.g., Rock climbing, Bird watching, Fishing"
              multiline
              value={newActivity}
              onChangeText={setNewActivity}
              autoFocus
            />

            <TouchableOpacity
              className="bg-orange-500 rounded-lg py-4 mt-4"
              onPress={handleAddActivity}
            >
              <Text className="text-white text-center font-bold text-lg">
                Add Activity
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
