import { useAuth } from "@/context/AuthContextAppwrite";
import { tripService } from "@/services/appwriteService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTrip();
    }
  }, [id]);

  const loadTrip = async () => {
    try {
      setIsLoading(true);
      const tripData = await tripService.getTrip(id);
      setTrip(tripData);
    } catch (error) {
      console.error("Error loading trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600">Trip not found</Text>
      </View>
    );
  }

  const isOrganizer = user && trip.organizer === user.id;

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
            {/* Trip Info */}
            <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Trip Details
              </Text>
              <View className="mb-2">
                <Text className="text-gray-600 text-sm">📅 Dates</Text>
                <Text className="text-gray-800 font-medium">
                  {trip.startDate} - {trip.endDate}
                </Text>
              </View>
              <View className="mb-2">
                <Text className="text-gray-600 text-sm">👥 Attendees</Text>
                <Text className="text-gray-800 font-medium">
                  {trip.attendees?.length || 0} people
                </Text>
              </View>
              <View className="mb-2">
                <Text className="text-gray-600 text-sm">📍 Campsites</Text>
                <Text className="text-gray-800 font-medium">
                  {trip.campsiteIds?.length || 0} location(s)
                </Text>
              </View>
              <View>
                <Text className="text-gray-600 text-sm">Status</Text>
                <View className="flex-row items-center mt-1">
                  <View
                    className={`px-3 py-1 rounded-full ${
                      trip.status === "planned"
                        ? "bg-green-100"
                        : trip.status === "active"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        trip.status === "planned"
                          ? "text-green-700"
                          : trip.status === "active"
                            ? "text-blue-700"
                            : "text-gray-700"
                      }`}
                    >
                      {trip.status.charAt(0).toUpperCase() +
                        trip.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Coming Soon Message */}
            <View className="bg-white rounded-xl p-6 shadow-sm items-center">
              <Text className="text-4xl mb-3">🔨</Text>
              <Text className="text-gray-800 font-semibold text-center mb-2">
                More Features Coming Soon
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Checklists, group chat, and more trip planning tools are on the
                way!
              </Text>
            </View>
          </View>
        )}

        {activeTab === "checklists" && (
          <View className="p-4">
            <View className="bg-white rounded-xl p-6 shadow-sm items-center">
              <Text className="text-4xl mb-3">📝</Text>
              <Text className="text-gray-800 font-semibold text-center mb-2">
                Checklists Coming Soon
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Shared and personal checklists will be available soon!
              </Text>
            </View>
          </View>
        )}

        {activeTab === "posts" && (
          <View className="p-4">
            <View className="bg-white rounded-xl p-6 shadow-sm items-center">
              <Text className="text-4xl mb-3">💬</Text>
              <Text className="text-gray-800 font-semibold text-center mb-2">
                Trip Chat Coming Soon
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Private group messaging for your trip will be available soon!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
