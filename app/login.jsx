/**
 * Purpose: Login screen for user authentication
 * Author: Nicholas Maddox
 * Date: 06/07/2026
 */

import { isDemoMode } from "@/config/mode";
import { useAuth } from "@/context/AuthContextAppwrite";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert("Login Failed", result.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className="bg-orange-500"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo/Header */}
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4">
            <Text className="text-5xl">🔥</Text>
          </View>
          <Text className="text-white text-4xl font-bold">Campfire</Text>
          <Text className="text-white opacity-80 text-lg mt-2">
            Plan your next adventure
          </Text>
        </View>

        {/* Login Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-white mb-2 font-semibold">Email</Text>
            <TextInput
              className="bg-white rounded-lg px-4 py-3 text-gray-800"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mt-4">
            <Text className="text-white mb-2 font-semibold">Password</Text>
            <TextInput
              className="bg-white rounded-lg px-4 py-3 text-gray-800"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className={`rounded-lg py-4 mt-6 ${isLoading ? "bg-white/70" : "bg-white"}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ea580c" />
            ) : (
              <Text className="text-orange-600 text-center font-bold text-lg">
                Log In
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-white">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text className="text-white font-bold underline">Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Mode Indicator */}
        {isDemoMode() && (
          <View className="bg-white/20 rounded-lg p-4 mt-6">
            <Text className="text-white text-center font-semibold mb-1">
              🎮 Demo Mode Active
            </Text>
            <Text className="text-white/90 text-center text-sm">
              Enter any email and password to try the app
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
