/**
 * Purpose: Screen for creating new campsites with details and location
 * Author: Nicholas Maddox
 * Date: 06/07/2026
 */

import { useAuth } from "@/context/AuthContextAppwrite";
import { campsiteService } from "@/services/appwriteService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
        {/* Campsite Name */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-semibold mb-2">
            Campsite Name *
          </Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-4 py-3"
            placeholder="e.g., Hidden Lake Campground"
            value={campsite.name}
            onChangeText={(text) => setCampsite({ ...campsite, name: text })}
            autoFocus
          />
        </View>

        {/* Description */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-semibold mb-2">
            Description *
          </Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-4 py-3 h-32"
            placeholder="Describe the campsite, scenery, and what makes it special..."
            multiline
            value={campsite.description}
            onChangeText={(text) =>
              setCampsite({ ...campsite, description: text })
            }
          />
        </View>

        {/* Amenities */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-semibold mb-2">Amenities</Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-4 py-3 h-24"
            placeholder="Fire pit, Restrooms, Hiking trails, Lake access (comma separated)"
            multiline
            value={campsite.amenities}
            onChangeText={(text) =>
              setCampsite({ ...campsite, amenities: text })
            }
          />
          <Text className="text-gray-500 text-xs mt-2">
            Separate each amenity with a comma
          </Text>
        </View>

        {/* Privacy Toggle */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() =>
              setCampsite({ ...campsite, isPrivate: !campsite.isPrivate })
            }
          >
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold mb-1">
                🔒 Private Campsite
              </Text>
              <Text className="text-gray-600 text-sm">
                Only you can see and edit this campsite
              </Text>
            </View>
            <View
              className={`w-12 h-7 rounded-full p-1 ${campsite.isPrivate ? "bg-orange-500" : "bg-gray-300"}`}
            >
              <View
                className={`w-5 h-5 rounded-full bg-white ${campsite.isPrivate ? "ml-auto" : ""}`}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
          <Text className="text-blue-800 font-semibold mb-2">ℹ️ Tip</Text>
          <Text className="text-blue-700 text-sm">
            • Public campsites can receive activity suggestions from other users
          </Text>
          <Text className="text-blue-700 text-sm mt-1">
            • You can edit all your campsites anytime from your profile
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`rounded-xl py-4 mb-6 shadow-sm ${isLoading ? "bg-orange-400" : "bg-orange-500"}`}
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
