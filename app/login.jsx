import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
  const router = useRouter();

  const handleLogin = () => {
    // Mock login - in a real app, you'd validate credentials
    if (email && password) {
      router.replace("/(tabs)");
    }
  };

  const handleGuestLogin = () => {
    router.replace("/(tabs)");
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
            className="bg-white rounded-lg py-4 mt-6"
            onPress={handleLogin}
          >
            <Text className="text-orange-600 text-center font-bold text-lg">
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent border-2 border-white rounded-lg py-4 mt-3"
            onPress={handleGuestLogin}
          >
            <Text className="text-white text-center font-bold text-lg">
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-white">Don't have an account? </Text>
          <TouchableOpacity>
            <Text className="text-white font-bold underline">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
