/**
 * Purpose: Detailed view of a specific trip with overview and checklist
 * Author: Nicholas Maddox
 * Date: 06/07/2026
 */

import { useAuth } from "@/context/AuthContextAppwrite";
import { checklistService, tripService } from "@/services/appwriteService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newItemText, setNewItemText] = useState("");
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);

  useEffect(() => {
    if (id) {
      loadTrip();
      if (user) {
        loadChecklist();
      }
    }
  }, [id, user]);

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

  const loadChecklist = async () => {
    if (!user) return;
    try {
      setIsLoadingChecklist(true);
      const items = await checklistService.getTripChecklists(user.id, id);
      setChecklistItems(items);
    } catch (error) {
      console.error("Error loading checklist:", error);
    } finally {
      setIsLoadingChecklist(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemText.trim() || !user) return;
    try {
      const newItem = await checklistService.createChecklistItem({
        userId: user.id,
        tripId: id,
        text: newItemText.trim(),
        completed: false,
      });
      setChecklistItems([...checklistItems, newItem]);
      setNewItemText("");
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Failed to add checklist item");
    }
  };

  const handleToggleItem = async (item) => {
    try {
      const updated = await checklistService.updateChecklistItem(item.$id, {
        completed: !item.completed,
      });
      setChecklistItems(
        checklistItems.map((i) =>
          i.$id === item.$id ? { ...i, completed: !i.completed } : i,
        ),
      );
    } catch (error) {
      console.error("Error toggling item:", error);
      Alert.alert("Error", "Failed to update item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await checklistService.deleteChecklistItem(itemId);
      setChecklistItems(checklistItems.filter((i) => i.$id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete item");
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
            My Checklist
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
          </View>
        )}

        {activeTab === "checklists" && (
          <View className="p-4">
            <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                📝 My Personal Checklist
              </Text>
              <Text className="text-gray-600 text-sm mb-4">
                This checklist is private and only visible to you.
              </Text>

              {/* Add Item Input */}
              <View className="flex-row mb-4">
                <TextInput
                  className="flex-1 bg-gray-50 rounded-lg px-4 py-3 mr-2"
                  placeholder="Add an item..."
                  value={newItemText}
                  onChangeText={setNewItemText}
                  onSubmitEditing={handleAddItem}
                />
                <TouchableOpacity
                  className="bg-orange-500 rounded-lg px-4 py-3 justify-center"
                  onPress={handleAddItem}
                >
                  <Text className="text-white font-semibold">Add</Text>
                </TouchableOpacity>
              </View>

              {/* Checklist Items */}
              {isLoadingChecklist ? (
                <ActivityIndicator size="small" color="#f97316" />
              ) : checklistItems.length === 0 ? (
                <View className="items-center py-8">
                  <Text className="text-gray-400 text-center">
                    No items yet. Add your first item above!
                  </Text>
                </View>
              ) : (
                <View>
                  {checklistItems.map((item) => (
                    <View
                      key={item.$id}
                      className="flex-row items-center py-3 border-b border-gray-100"
                    >
                      <TouchableOpacity
                        className="mr-3"
                        onPress={() => handleToggleItem(item)}
                      >
                        <View
                          className={`w-6 h-6 rounded border-2 items-center justify-center ${
                            item.completed
                              ? "bg-orange-500 border-orange-500"
                              : "border-gray-300"
                          }`}
                        >
                          {item.completed && (
                            <Text className="text-white text-xs font-bold">
                              ✓
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                      <Text
                        className={`flex-1 ${
                          item.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {item.text}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteItem(item.$id)}
                        className="ml-2 p-2"
                      >
                        <Text className="text-red-500 text-lg">🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
