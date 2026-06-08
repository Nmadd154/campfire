import { useAuth } from "@/context/AuthContext";
import { campsiteService } from "@/services/appwriteService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function CreateCampsiteScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { latitude, longitude } = useLocalSearchParams();

  const [campsite, setCampsite] = useState({
    name: "",
    description: "",
    isPrivate: false,
    amenities: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert("Login Required", "Please log in to add a campsite.");
      return;
    }

    if (!campsite.name.trim()) {
      Alert.alert("Name Required", "Please enter a campsite name.");
      return;
    }

    if (!campsite.description.trim()) {
      Alert.alert("Description Required", "Please enter a description.");
      return;
    }

    setIsLoading(true);

    try {
      // Create campsite in Appwrite database
      const newCampsite = await campsiteService.createCampsite({
        name: campsite.name,
        description: campsite.description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        isPrivate: campsite.isPrivate,
        addedBy: user.id,
        amenities: campsite.amenities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
        photos: [],
      });

      Alert.alert(
        "Campsite Added!",
        `${campsite.name} has been added to the map.`,
        [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)"),
          },
        ],
      );
    } catch (error) {
      console.error("Error creating campsite:", error);
      Alert.alert("Error", "Failed to add campsite. Please try again.");
    } finally {
      setIsLoading(false);
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

      {/* Header */}
      <View className="bg-orange-500 pb-6 px-4 pt-4">
        <Text className="text-white text-2xl font-bold">Add New Campsite</Text>
        <Text className="text-white opacity-80 mt-2">
          📍 Location: {parseFloat(latitude).toFixed(4)},{" "}
          {parseFloat(longitude).toFixed(4)}
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Form fields remain the same... */}
        {/* ... */}

        {/* Save Button */}
        <TouchableOpacity
          className={`rounded-xl py-4 mb-6 shadow-sm ${isLoading ? "bg-gray-400" : "bg-orange-500"}`}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Add Campsite to Map
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
