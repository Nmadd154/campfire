import { useAuth } from "@/context/AuthContextAppwrite";
import { trips, users } from "@/data/mockData";
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

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [trip, setTrip] = useState(trips.find((t) => t.id === parseInt(id)));

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600">Trip not found</Text>
      </View>
    );
  }

  const attendeeDetails = users.filter((u) => trip.attendees.includes(u.id));
  const isOrganizer = user && trip.organizer === user.id;

  const togglePersonalChecklistItem = (itemId) => {
    setTrip({
      ...trip,
      personalChecklist: trip.personalChecklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      ),
    });
  };

  const toggleGroupChecklistItem = (itemId) => {
    setTrip({
      ...trip,
      groupChecklist: trip.groupChecklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      ),
    });
  };

  const handleAddPost = () => {
    if (newPost.trim() && user) {
      const post = {
        id: Date.now(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: newPost,
        timestamp: "Just now",
        comments: [],
      };
      setTrip({
        ...trip,
        privatePosts: [...trip.privatePosts, post],
      });
      setNewPost("");
      setShowPostModal(false);
    }
  };

  const personalProgress =
    trip.personalChecklist.length > 0
      ? Math.round(
          (trip.personalChecklist.filter((item) => item.completed).length /
            trip.personalChecklist.length) *
            100,
        )
      : 0;

  const groupProgress =
    trip.groupChecklist.length > 0
      ? Math.round(
          (trip.groupChecklist.filter((item) => item.completed).length /
            trip.groupChecklist.length) *
            100,
        )
      : 0;

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

      {/* Header */}
      <View className="bg-orange-500 pb-6 px-4 pt-4">
        <View className="flex-row items-center mb-3">
          <Text className="text-5xl mr-3">🏕️</Text>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">{trip.name}</Text>
            <Text className="text-white opacity-80">{trip.campsiteName}</Text>
          </View>
          {trip.status === "planned" && (
            <View className="bg-green-500 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">Upcoming</Text>
            </View>
          )}
        </View>
        <Text className="text-white opacity-90">
          📅 {trip.startDate} - {trip.endDate}
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "overview" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "overview" ? "text-orange-500" : "text-gray-600"}`}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "checklists" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("checklists")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "checklists" ? "text-orange-500" : "text-gray-600"}`}
          >
            Checklists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "posts" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("posts")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "posts" ? "text-orange-500" : "text-gray-600"}`}
          >
            Posts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {activeTab === "overview" && (
          <View className="p-4">
            {/* Attendees */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">
                  Trip Members
                </Text>
                {isOrganizer && (
                  <TouchableOpacity className="bg-orange-500 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">
                      + Invite
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {attendeeDetails.map((user, index) => (
                <View key={user.id} className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-gray-300 rounded-full items-center justify-center mr-3">
                    <Text className="text-2xl">👤</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">
                      {user.name}
                      {user.id === trip.organizer && (
                        <Text className="text-orange-500 text-sm">
                          {" "}
                          (Organizer)
                        </Text>
                      )}
                    </Text>
                    <Text className="text-gray-500 text-sm">{user.email}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Quick Stats */}
            <View className="flex-row mb-4">
              <View className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm">
                <Text className="text-gray-600 text-sm mb-1">
                  Personal Checklist
                </Text>
                <Text className="text-2xl font-bold text-orange-500">
                  {personalProgress}%
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {trip.personalChecklist.filter((i) => i.completed).length} of{" "}
                  {trip.personalChecklist.length} done
                </Text>
              </View>
              <View className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm">
                <Text className="text-gray-600 text-sm mb-1">
                  Group Checklist
                </Text>
                <Text className="text-2xl font-bold text-green-500">
                  {groupProgress}%
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {trip.groupChecklist.filter((i) => i.completed).length} of{" "}
                  {trip.groupChecklist.length} done
                </Text>
              </View>
            </View>

            {/* Trip Info */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Trip Details
              </Text>
              <View className="mb-2">
                <Text className="text-gray-600 text-sm">Location</Text>
                <Text className="text-gray-800 font-medium">
                  {trip.campsiteName}
                </Text>
              </View>
              <View className="mb-2">
                <Text className="text-gray-600 text-sm">Duration</Text>
                <Text className="text-gray-800 font-medium">
                  {trip.startDate} - {trip.endDate}
                </Text>
              </View>
              <View>
                <Text className="text-gray-600 text-sm">Status</Text>
                <Text className="text-gray-800 font-medium capitalize">
                  {trip.status}
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "checklists" && (
          <View className="p-4">
            {/* Personal Checklist */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">
                  My Checklist
                </Text>
                <View className="bg-orange-100 px-3 py-1 rounded-full">
                  <Text className="text-orange-700 text-xs font-semibold">
                    {personalProgress}% Complete
                  </Text>
                </View>
              </View>

              {trip.personalChecklist.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="flex-row items-center py-3 border-b border-gray-100"
                  onPress={() => togglePersonalChecklistItem(item.id)}
                >
                  <View
                    className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${item.completed ? "bg-orange-500 border-orange-500" : "border-gray-300"}`}
                  >
                    {item.completed && <Text className="text-white">✓</Text>}
                  </View>
                  <Text
                    className={`flex-1 ${item.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
                  >
                    {item.item}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity className="bg-gray-100 rounded-lg py-3 mt-4">
                <Text className="text-center text-gray-600 font-semibold">
                  + Add Item
                </Text>
              </TouchableOpacity>
            </View>

            {/* Group Checklist */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">
                  Group Checklist
                </Text>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 text-xs font-semibold">
                    {groupProgress}% Complete
                  </Text>
                </View>
              </View>

              {trip.groupChecklist.map((item) => {
                const assignedUser = users.find(
                  (u) => u.id === item.assignedTo,
                );
                return (
                  <TouchableOpacity
                    key={item.id}
                    className="py-3 border-b border-gray-100"
                    onPress={() => toggleGroupChecklistItem(item.id)}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${item.completed ? "bg-green-500 border-green-500" : "border-gray-300"}`}
                      >
                        {item.completed && (
                          <Text className="text-white">✓</Text>
                        )}
                      </View>
                      <Text
                        className={`flex-1 ${item.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
                      >
                        {item.item}
                      </Text>
                    </View>
                    {assignedUser && (
                      <Text className="text-gray-500 text-sm ml-9">
                        Assigned to {assignedUser.name}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}

              {isOrganizer && (
                <TouchableOpacity className="bg-gray-100 rounded-lg py-3 mt-4">
                  <Text className="text-center text-gray-600 font-semibold">
                    + Add Item
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {activeTab === "posts" && (
          <View className="p-4">
            <View className="bg-blue-50 rounded-lg p-3 mb-4 flex-row items-start">
              <Text className="mr-2">🔒</Text>
              <Text className="flex-1 text-blue-800 text-sm">
                These posts are private and only visible to trip members
              </Text>
            </View>

            {/* Add Post Button */}
            <TouchableOpacity
              className="bg-orange-500 rounded-lg py-3 mb-4"
              onPress={() => setShowPostModal(true)}
            >
              <Text className="text-white text-center font-semibold">
                ✍️ Share with Group
              </Text>
            </TouchableOpacity>

            {/* Private Posts */}
            {trip.privatePosts.map((post) => (
              <View
                key={post.id}
                className="bg-white rounded-xl mb-4 shadow-sm"
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
                <View className="px-4 pb-4">
                  <Text className="text-gray-800">{post.content}</Text>
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

                {/* Comment Input */}
                <View className="border-t border-gray-100 px-4 py-3">
                  <View className="flex-row items-center bg-gray-50 rounded-full px-3 py-2">
                    <TextInput
                      className="flex-1 text-gray-800"
                      placeholder="Add a comment..."
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity>
                      <Text className="text-orange-500 font-semibold">
                        Post
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {trip.privatePosts.length === 0 && (
              <View className="items-center py-12">
                <Text className="text-6xl mb-4">💬</Text>
                <Text className="text-gray-600 text-center">No posts yet</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Start the conversation!
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
              <Text className="text-2xl font-bold">Share with Group</Text>
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
