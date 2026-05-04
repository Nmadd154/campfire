import { currentUser, posts, trips } from "@/data/mockData";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("trips");

  const userPosts = posts.filter((post) => post.userId === currentUser.id);
  const userTrips = trips.filter((trip) =>
    trip.attendees.includes(currentUser.id),
  );
  const pastTrips = userTrips.filter((trip) => trip.status === "past");
  const plannedTrips = userTrips.filter((trip) => trip.status === "planned");

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-500 pt-12 pb-6 px-4">
        <View className="items-center">
          <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-3">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-white text-2xl font-bold">
            {currentUser.name}
          </Text>
          <Text className="text-white opacity-80 mt-1">{currentUser.bio}</Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around mt-6 bg-orange-600 rounded-lg py-3">
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {pastTrips.length}
            </Text>
            <Text className="text-white opacity-80 text-sm">Past Trips</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {plannedTrips.length}
            </Text>
            <Text className="text-white opacity-80 text-sm">Planned</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {userPosts.length}
            </Text>
            <Text className="text-white opacity-80 text-sm">Posts</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === "trips" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("trips")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "trips" ? "text-orange-500" : "text-gray-600"}`}
          >
            Trips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === "posts" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("posts")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "posts" ? "text-orange-500" : "text-gray-600"}`}
          >
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === "albums" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("albums")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "albums" ? "text-orange-500" : "text-gray-600"}`}
          >
            Albums
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {activeTab === "trips" && (
          <View className="p-4">
            {/* Planned Trips */}
            {plannedTrips.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Upcoming Trips
                </Text>
                {plannedTrips.map((trip) => (
                  <TouchableOpacity
                    key={trip.id}
                    className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                    onPress={() => router.push(`/trip/${trip.id}`)}
                  >
                    <View className="flex-row items-center mb-2">
                      <Text className="text-3xl mr-3">🏕️</Text>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800">
                          {trip.name}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          {trip.campsiteName}
                        </Text>
                      </View>
                      <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-700 text-xs font-semibold">
                          Upcoming
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm">
                      📅 {trip.startDate} - {trip.endDate}
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1">
                      👥 {trip.attendees.length} attendees
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Past Trips */}
            {pastTrips.length > 0 && (
              <View>
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Past Trips
                </Text>
                {pastTrips.map((trip) => (
                  <TouchableOpacity
                    key={trip.id}
                    className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                    onPress={() => router.push(`/trip/${trip.id}`)}
                  >
                    <View className="flex-row items-center mb-2">
                      <Text className="text-3xl mr-3">🏕️</Text>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800">
                          {trip.name}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          {trip.campsiteName}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm">
                      📅 {trip.startDate} - {trip.endDate}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {userTrips.length === 0 && (
              <View className="items-center py-12">
                <Text className="text-6xl mb-4">🏕️</Text>
                <Text className="text-gray-600 text-center">No trips yet</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Start planning your adventure!
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "posts" && (
          <View className="p-4">
            {userPosts.map((post) => (
              <View
                key={post.id}
                className="bg-white rounded-xl mb-4 overflow-hidden shadow-sm"
              >
                {post.image && (
                  <View className="h-48 bg-gray-200 items-center justify-center">
                    <Text className="text-4xl">🏞️</Text>
                  </View>
                )}
                <View className="p-4">
                  <Text className="text-gray-800 mb-2">{post.content}</Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-500 text-sm">
                      {post.timestamp}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-gray-600 mr-4">
                        ❤️ {post.likes}
                      </Text>
                      <Text className="text-gray-600">
                        💬 {post.comments.length}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {userPosts.length === 0 && (
              <View className="items-center py-12">
                <Text className="text-6xl mb-4">📝</Text>
                <Text className="text-gray-600 text-center">No posts yet</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Share your camping adventures!
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "albums" && (
          <View className="p-4">
            <View className="flex-row flex-wrap">
              {[1, 2, 3, 4].map((album) => (
                <View
                  key={album}
                  className="w-[48%] mr-[4%] mb-4 bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  <View className="h-32 bg-blue-500 items-center justify-center">
                    <Text className="text-4xl">📸</Text>
                  </View>
                  <View className="p-3">
                    <Text className="font-bold text-gray-800">
                      Album {album}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {Math.floor(Math.random() * 50) + 10} photos
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
