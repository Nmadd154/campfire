import { useAuth } from "@/context/AuthContextAppwrite";
import { posts, suggestions, trips } from "@/data/mockData";
import { campsiteService } from "@/services/appwriteService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("trips");
  const [userCampsites, setUserCampsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's campsites from Appwrite
  useEffect(() => {
    if (user?.id) {
      loadUserCampsites();
    }
  }, [user?.id]);

  const loadUserCampsites = async () => {
    try {
      setIsLoading(true);
      const allCampsites = await campsiteService.getAllCampsites();
      const myCampsites = allCampsites.filter(
        (campsite) => campsite.addedBy === user.id,
      );
      setUserCampsites(myCampsites);
    } catch (error) {
      console.error("Error loading user campsites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const userPosts = posts.filter((post) => post.userId === user?.id);
  const userTrips = trips.filter((trip) => trip.attendees.includes(user?.id));
  const pastTrips = userTrips.filter((trip) => trip.status === "past");
  const plannedTrips = userTrips.filter((trip) => trip.status === "planned");
  const userSuggestions = suggestions.filter(
    (suggestion) => suggestion.campsiteOwnerId === user?.id,
  );

  if (!isAuthenticated || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-6xl mb-4">🔥</Text>
        <Text className="text-gray-600 text-lg">
          Please log in to view your profile
        </Text>
        <TouchableOpacity
          className="bg-orange-500 px-6 py-3 rounded-lg mt-4"
          onPress={() => router.replace("/login")}
        >
          <Text className="text-white font-bold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-500 pt-12 pb-6 px-4">
        <View className="items-center">
          <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-3">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-white text-2xl font-bold">{user.name}</Text>
          <Text className="text-white opacity-80 mt-1">
            {user.bio || "Happy camper! 🏕️"}
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="absolute top-12 right-4 bg-white/20 px-3 py-2 rounded-lg"
          onPress={() => {
            logout();
            router.replace("/login");
          }}
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>

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
              {userCampsites.length}
            </Text>
            <Text className="text-white opacity-80 text-sm">Campsites</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {userSuggestions.length}
            </Text>
            <Text className="text-white opacity-80 text-sm">Requests</Text>
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
          className={`flex-1 py-4 ${activeTab === "campsites" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("campsites")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "campsites" ? "text-orange-500" : "text-gray-600"}`}
          >
            Campsites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === "suggestions" ? "border-b-2 border-orange-500" : ""}`}
          onPress={() => setActiveTab("suggestions")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "suggestions" ? "text-orange-500" : "text-gray-600"}`}
          >
            Requests
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

        {activeTab === "campsites" && (
          <View className="p-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              My Campsites
            </Text>
            {userCampsites.map((campsite) => (
              <TouchableOpacity
                key={campsite.$id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                onPress={() => router.push(`/campsite/${campsite.$id}`)}
              >
                <View className="flex-row items-center mb-2">
                  <Text className="text-3xl mr-3">🏕️</Text>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">
                      {campsite.name}
                    </Text>
                    <Text className="text-gray-600 text-sm" numberOfLines={2}>
                      {campsite.description}
                    </Text>
                  </View>
                  {campsite.isPrivate && (
                    <View className="bg-orange-100 px-2 py-1 rounded-full">
                      <Text className="text-orange-700 text-xs font-semibold">
                        🔒 Private
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center mt-2">
                  <Text className="text-gray-500 text-sm mr-4">
                    📍 {campsite.amenities.length} amenities
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    📸 {campsite.photos.length} photos
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {userCampsites.length === 0 && (
              <View className="items-center py-12">
                <Text className="text-6xl mb-4">🏕️</Text>
                <Text className="text-gray-600 text-center">
                  No campsites created yet
                </Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Be the first to add a campsite!
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "suggestions" && (
          <View className="p-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Pending Requests
            </Text>
            {userSuggestions.map((suggestion) => {
              const campsite = campsites.find(
                (c) => c.id === suggestion.campsiteId,
              );
              return (
                <View
                  key={suggestion.id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-sm text-gray-500 mb-1">
                        From: {suggestion.userName}
                      </Text>
                      <Text className="text-base font-semibold text-gray-800">
                        {campsite?.name}
                      </Text>
                    </View>
                    <View className="bg-yellow-100 px-3 py-1 rounded-full">
                      <Text className="text-yellow-700 text-xs font-semibold">
                        Pending
                      </Text>
                    </View>
                  </View>
                  <View className="bg-gray-50 p-3 rounded-lg mb-3">
                    <Text className="text-gray-700 text-sm mb-1">
                      {suggestion.type === "activity"
                        ? "Suggested Activity:"
                        : "Suggested Change:"}
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {suggestion.content}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 text-xs">
                      Submitted: {suggestion.submittedAt}
                    </Text>
                    <View className="flex-row">
                      <TouchableOpacity
                        className="bg-green-500 px-4 py-2 rounded-lg mr-2"
                        onPress={() => {
                          Alert.alert(
                            "Approved",
                            `You approved the suggestion: "${suggestion.content}"`,
                          );
                        }}
                      >
                        <Text className="text-white text-sm font-semibold">
                          ✓ Approve
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-red-500 px-4 py-2 rounded-lg"
                        onPress={() => {
                          Alert.alert(
                            "Rejected",
                            "You rejected this suggestion.",
                          );
                        }}
                      >
                        <Text className="text-white text-sm font-semibold">
                          ✗ Reject
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {userSuggestions.length === 0 && (
              <View className="items-center py-12">
                <Text className="text-6xl mb-4">📬</Text>
                <Text className="text-gray-600 text-center">
                  No pending requests
                </Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Suggestions from other users will appear here
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
