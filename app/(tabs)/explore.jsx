import { useAuth } from "@/context/AuthContextAppwrite";
import { campsiteService, tripService } from "@/services/appwriteService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("trips");
  const [userCampsites, setUserCampsites] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTripModal, setShowCreateTripModal] = useState(false);
  const [newTripName, setNewTripName] = useState("");
  const [newTripStartDate, setNewTripStartDate] = useState("");
  const [newTripEndDate, setNewTripEndDate] = useState("");

  // Fetch user's campsites and trips from Appwrite
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      // Load campsites
      const allCampsites = await campsiteService.getAllCampsites();
      const myCampsites = allCampsites.filter(
        (campsite) => campsite.addedBy === user.id,
      );
      setUserCampsites(myCampsites);

      // Load trips
      const myTrips = await tripService.getUserTrips(user.id);
      setUserTrips(myTrips);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTrip = async () => {
    if (!newTripName.trim() || !newTripStartDate || !newTripEndDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const trip = await tripService.createTrip({
        name: newTripName,
        campsiteName: "",
        campsiteIds: [],
        startDate: newTripStartDate,
        endDate: newTripEndDate,
        status: "planned",
        organizer: user.id,
        attendees: [user.id],
      });

      setUserTrips([trip, ...userTrips]);
      setNewTripName("");
      setNewTripStartDate("");
      setNewTripEndDate("");
      setShowCreateTripModal(false);
      Alert.alert("Success", "Trip created!");
    } catch (error) {
      console.error("Error creating trip:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      Alert.alert(
        "Error",
        `Failed to create trip: ${error.message || "Unknown error"}`,
      );
    }
  };

  const pastTrips = userTrips.filter((trip) => trip.status === "past");
  const plannedTrips = userTrips.filter((trip) => trip.status === "planned");

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
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {activeTab === "trips" && (
          <View className="p-4">
            {/* Create Trip Button */}
            <TouchableOpacity
              className="bg-orange-500 rounded-lg py-3 mb-4"
              onPress={() => setShowCreateTripModal(true)}
            >
              <Text className="text-white text-center font-semibold">
                ➕ Plan a New Trip
              </Text>
            </TouchableOpacity>

            {/* Planned Trips */}
            {plannedTrips.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Upcoming Trips
                </Text>
                {plannedTrips.map((trip) => (
                  <TouchableOpacity
                    key={trip.$id}
                    className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                    onPress={() => router.push(`/trip/${trip.$id}`)}
                  >
                    <View className="flex-row items-center mb-2">
                      <Text className="text-3xl mr-3">🏕️</Text>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800">
                          {trip.name}
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
                      👥 {trip.attendees?.length || 0} attendees
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
                    key={trip.$id}
                    className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                    onPress={() => router.push(`/trip/${trip.$id}`)}
                  >
                    <View className="flex-row items-center mb-2">
                      <Text className="text-3xl mr-3">🏕️</Text>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800">
                          {trip.name}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm">
                      📅 {trip.startDate} - {trip.endDate}
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1">
                      👥 {trip.attendees?.length || 0} attendees
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
                    📍 {campsite.amenities?.length || 0} amenities
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    📸 {campsite.photos?.length || 0} photos
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
      </ScrollView>

      {/* Create Trip Modal */}
      <Modal
        visible={showCreateTripModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateTripModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Plan a New Trip
              </Text>
              <TouchableOpacity onPress={() => setShowCreateTripModal(false)}>
                <Text className="text-2xl text-gray-600">×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 mb-3"
              placeholder="Trip name (e.g., Summer Adventure 2026)"
              value={newTripName}
              onChangeText={setNewTripName}
            />
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 mb-3"
              placeholder="Start date (e.g., 2026-07-15)"
              value={newTripStartDate}
              onChangeText={setNewTripStartDate}
            />
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 mb-4"
              placeholder="End date (e.g., 2026-07-18)"
              value={newTripEndDate}
              onChangeText={setNewTripEndDate}
            />

            <TouchableOpacity
              className="bg-orange-500 rounded-lg py-3"
              onPress={handleCreateTrip}
            >
              <Text className="text-white text-center font-semibold">
                Create Trip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
