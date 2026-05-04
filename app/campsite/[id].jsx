import { campsites, currentUser, posts, thingsToDo } from "@/data/mockData";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
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
  const [activeTab, setActiveTab] = useState("posts");
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [localPosts, setLocalPosts] = useState(posts);

  const campsite = campsites.find((site) => site.id === parseInt(id));
  const campsitePosts = localPosts.filter(
    (post) => post.campsiteId === parseInt(id),
  );
  const activities = thingsToDo[parseInt(id)] || [];

  if (!campsite) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600">Campsite not found</Text>
      </View>
    );
  }

  const handleLikePost = (postId) => {
    setLocalPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(currentUser.id);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked
              ? post.likedBy.filter((id) => id !== currentUser.id)
              : [...post.likedBy, currentUser.id],
          };
        }
        return post;
      }),
    );
  };

  const handleAddPost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        campsiteId: parseInt(id),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: newPost,
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp: "Just now",
      };
      setLocalPosts([post, ...localPosts]);
      setNewPost("");
      setShowPostModal(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Image */}
      <View className="h-56 bg-green-500 items-center justify-center">
        <Text className="text-8xl">🏕️</Text>
        {campsite.isPrivate && (
          <View className="absolute top-4 right-4 bg-orange-500 px-3 py-2 rounded-full">
            <Text className="text-white text-sm font-semibold">🔒 Private</Text>
          </View>
        )}
      </View>

      {/* Campsite Info */}
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          {campsite.name}
        </Text>
        <Text className="text-gray-600 mt-2">{campsite.description}</Text>

        {/* Amenities */}
        <View className="flex-row flex-wrap mt-3">
          {campsite.amenities.map((amenity, index) => (
            <View
              key={index}
              className="bg-gray-100 px-3 py-1 rounded-full mr-2 mt-2"
            >
              <Text className="text-sm text-gray-700">✓ {amenity}</Text>
            </View>
          ))}
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
            Posts ({campsitePosts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "photos" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("photos")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "photos" ? "text-orange-500" : "text-gray-600"}`}
          >
            Photos
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
            {campsitePosts.map((post) => {
              const isLiked = post.likedBy.includes(currentUser.id);
              return (
                <View
                  key={post.id}
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
                      onPress={() => handleLikePost(post.id)}
                    >
                      <Text className="mr-2">{isLiked ? "❤️" : "🤍"}</Text>
                      <Text
                        className={`${isLiked ? "text-red-500 font-semibold" : "text-gray-600"}`}
                      >
                        {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center">
                      <Text className="mr-2">💬</Text>
                      <Text className="text-gray-600">
                        {post.comments.length} Comments
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <View className="px-4 pb-3 border-t border-gray-100">
                      {post.comments.map((comment) => (
                        <View key={comment.id} className="flex-row mt-3">
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
                              {comment.timestamp}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {campsitePosts.length === 0 && (
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

        {activeTab === "photos" && (
          <View className="p-4">
            <View className="flex-row flex-wrap">
              {campsite.photos.map((photo, index) => (
                <View
                  key={index}
                  className="w-[48%] mr-[4%] mb-4 h-32 bg-blue-500 rounded-xl items-center justify-center"
                >
                  <Text className="text-4xl">🏞️</Text>
                </View>
              ))}
              {[1, 2, 3, 4].map((item) => (
                <View
                  key={item}
                  className="w-[48%] mr-[4%] mb-4 h-32 bg-gray-200 rounded-xl items-center justify-center"
                >
                  <Text className="text-4xl">📷</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "activities" && (
          <View className="p-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Popular Activities
            </Text>
            {activities.map((activity, index) => (
              <View
                key={index}
                className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm"
              >
                <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-2xl">⛰️</Text>
                </View>
                <Text className="flex-1 text-gray-800 font-medium">
                  {activity}
                </Text>
              </View>
            ))}
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
    </View>
  );
}
