/**
 * Purpose: Map screen displaying campsites with markers and search functionality
 * Author: Nicholas Maddox
 * Date: 06/07/2026
 */

import { useAuth } from "@/context/AuthContextAppwrite";
import { campsiteService } from "@/services";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [campsitesData, setCampsitesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 44.0521, // Eugene, Oregon
    longitude: -123.0868,
    latitudeDelta: 2,
    longitudeDelta: 2,
  });

  // Load campsites data
  useEffect(() => {
    loadCampsites();
  }, [user]);

  const loadCampsites = async () => {
    try {
      setIsLoading(true);
      const data = await campsiteService.getAllCampsites();
      // Filter out private campsites that don't belong to the current user
      const visibleCampsites = data.filter(
        (campsite) => !campsite.isPrivate || campsite.addedBy === user?.id,
      );
      setCampsitesData(visibleCampsites);
    } catch (error) {
      console.error("Error loading campsites:", error);
      Alert.alert("Error", "Failed to load campsites");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(newLocation);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
      } catch (error) {
        // Silently handle location errors
      }
    })();
  }, []);

  // Calculate distance between two coordinates in miles
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredCampsites = campsitesData
    .filter((site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .map((site) => ({
      ...site,
      distance: userLocation
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            site.latitude,
            site.longitude,
          )
        : null,
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const handleCampsitePress = (campsiteId) => {
    router.push(`/campsite/${campsiteId}`);
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleCreateCampsite = () => {
    if (selectedLocation) {
      router.push(
        `/create-campsite?latitude=${selectedLocation.latitude}&longitude=${selectedLocation.longitude}`,
      );
      setSelectedLocation(null);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-500 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-bold">🔥 Campfire</Text>
          <View className="bg-orange-600 px-4 py-2 rounded-full">
            <Text className="text-white font-semibold text-xs">
              Tap map to add 📍
            </Text>
          </View>
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

      {/* Map View with Campsite Pins */}
      <View className="flex-1">
        {isLoading && (
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-gray-100 items-center justify-center z-50">
            <ActivityIndicator size="large" color="#ea580c" />
            <Text className="text-gray-600 mt-4">Loading campsites...</Text>
          </View>
        )}

        <View className="absolute top-4 left-4 right-4 bg-white rounded-lg p-3 shadow-md z-10">
          <Text className="text-gray-600 text-sm">
            📍 Showing {filteredCampsites.length} nearby campsites
          </Text>
        </View>

        {/* Real Map View */}
        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* User Location Marker - shown by showsUserLocation */}

          {/* Temporary Selected Location Marker */}
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              pinColor="orange"
              title="New Campsite"
              description="Tap 'Create Campsite' to add details"
            >
              <View className="items-center">
                <Text style={{ fontSize: 40 }}>📍</Text>
              </View>
            </Marker>
          )}

          {/* Campsite Markers */}
          {filteredCampsites.map((site) => (
            <Marker
              key={site.$id}
              coordinate={{
                latitude: site.latitude,
                longitude: site.longitude,
              }}
              title={site.name}
              description={site.description}
              onCalloutPress={() => handleCampsitePress(site.$id)}
            >
              <View className="items-center">
                <Text style={{ fontSize: 30 }}>🏕️</Text>
                {site.isPrivate && (
                  <View className="bg-orange-500 px-2 py-0.5 rounded-full -mt-1">
                    <Text className="text-white text-xs font-bold">🔒</Text>
                  </View>
                )}
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Create Campsite Button (shows when location is selected) */}
        {selectedLocation && (
          <View className="absolute top-20 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-20">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-800 font-bold text-base mb-1">
                  📍 Location Selected
                </Text>
                <Text className="text-gray-600 text-xs">
                  {selectedLocation.latitude.toFixed(4)},{" "}
                  {selectedLocation.longitude.toFixed(4)}
                </Text>
              </View>
              <View className="flex-row">
                <TouchableOpacity
                  className="bg-gray-200 px-3 py-2 rounded-lg mr-2"
                  onPress={() => setSelectedLocation(null)}
                >
                  <Text className="text-gray-700 font-semibold text-sm">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-orange-500 px-4 py-2 rounded-lg"
                  onPress={handleCreateCampsite}
                >
                  <Text className="text-white font-semibold text-sm">
                    Create Campsite
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Nearby Campsites List */}
        <View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
          style={{ maxHeight: "40%" }}
        >
          <View className="px-4 pt-4 pb-2 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">
              Nearby Campsites
            </Text>
          </View>
          <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
            <View className="py-2">
              {filteredCampsites.map((site) => (
                <TouchableOpacity
                  key={site.$id}
                  className="bg-gray-50 rounded-xl mb-3 p-4 shadow-sm"
                  onPress={() => handleCampsitePress(site.$id)}
                >
                  <View className="flex-row items-start">
                    <Text className="text-4xl mr-3">🏕️</Text>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base font-bold text-gray-800 flex-1">
                          {site.name}
                        </Text>
                        {site.isPrivate && (
                          <View className="bg-orange-500 px-2 py-1 rounded-full ml-2">
                            <Text className="text-white text-xs font-semibold">
                              Private
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        className="text-gray-600 text-sm mt-1"
                        numberOfLines={2}
                      >
                        {site.description}
                      </Text>
                      {site.distance !== null && (
                        <Text className="text-orange-500 font-semibold text-sm mt-1">
                          {site.distance < 1
                            ? `${(site.distance * 5280).toFixed(0)} ft away`
                            : `${site.distance.toFixed(1)} miles away`}
                        </Text>
                      )}
                      <View className="flex-row flex-wrap mt-2">
                        {site.amenities.slice(0, 2).map((amenity, index) => (
                          <View
                            key={index}
                            className="bg-white px-2 py-1 rounded-full mr-2 mt-1"
                          >
                            <Text className="text-xs text-gray-600">
                              {amenity}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
