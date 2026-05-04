import { campsites } from "@/data/mockData";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MapScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCampsite, setNewCampsite] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  const filteredCampsites = campsites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCampsitePress = (campsiteId) => {
    router.push(`/campsite/${campsiteId}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-500 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-bold">🔥 Campfire</Text>
          <TouchableOpacity
            className="bg-orange-600 px-4 py-2 rounded-full"
            onPress={() => setShowAddModal(true)}
          >
            <Text className="text-white font-semibold">+ Add Site</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-lg flex-row items-center px-4 py-2">
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Search campsites..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Map Placeholder with Pins */}
      <View className="flex-1">
        <View className="absolute top-4 left-4 right-4 bg-white rounded-lg p-3 shadow-md z-10">
          <Text className="text-gray-600 text-sm">
            📍 Showing {filteredCampsites.length} nearby campsites
          </Text>
        </View>

        {/* Simulated Map View with Campsite Cards */}
        <ScrollView className="flex-1 mt-16 px-4">
          <View className="py-4">
            {filteredCampsites.map((site) => (
              <TouchableOpacity
                key={site.id}
                className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden"
                onPress={() => handleCampsitePress(site.id)}
              >
                <View className="h-40 bg-green-500 items-center justify-center">
                  <Text className="text-6xl">🏕️</Text>
                  {site.isPrivate && (
                    <View className="absolute top-2 right-2 bg-orange-500 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-semibold">
                        Private
                      </Text>
                    </View>
                  )}
                </View>
                <View className="p-4">
                  <Text className="text-lg font-bold text-gray-800">
                    {site.name}
                  </Text>
                  <Text className="text-gray-600 mt-1" numberOfLines={2}>
                    {site.description}
                  </Text>
                  <View className="flex-row flex-wrap mt-2">
                    {site.amenities.slice(0, 3).map((amenity, index) => (
                      <View
                        key={index}
                        className="bg-gray-100 px-2 py-1 rounded-full mr-2 mt-1"
                      >
                        <Text className="text-xs text-gray-600">{amenity}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Add Campsite Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">Add New Campsite</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
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
                  placeholder="Enter campsite name"
                  value={newCampsite.name}
                  onChangeText={(text) =>
                    setNewCampsite({ ...newCampsite, name: text })
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
                  value={newCampsite.description}
                  onChangeText={(text) =>
                    setNewCampsite({ ...newCampsite, description: text })
                  }
                />
              </View>

              <TouchableOpacity
                className="flex-row items-center mb-4"
                onPress={() =>
                  setNewCampsite({
                    ...newCampsite,
                    isPrivate: !newCampsite.isPrivate,
                  })
                }
              >
                <View
                  className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${newCampsite.isPrivate ? "bg-orange-500 border-orange-500" : "border-gray-300"}`}
                >
                  {newCampsite.isPrivate && (
                    <Text className="text-white">✓</Text>
                  )}
                </View>
                <Text className="text-gray-700">
                  Keep this campsite private
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-orange-500 rounded-lg py-4 mt-4"
                onPress={() => {
                  // In a real app, save the campsite
                  setShowAddModal(false);
                  setNewCampsite({
                    name: "",
                    description: "",
                    isPrivate: false,
                  });
                }}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Add Campsite
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
