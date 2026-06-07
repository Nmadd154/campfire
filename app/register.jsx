import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = () => {
    if (name && email && password && password === confirmPassword) {
      // Create new user object
      const newUser = {
        id: Date.now(), // Simple ID generation
        name,
        email,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        bio: "Nature lover 🏕️",
      };
      register(newUser);
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className="bg-orange-500"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-8 py-12">
          {/* Logo/Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-3">
              <Text className="text-4xl">🔥</Text>
            </View>
            <Text className="text-white text-3xl font-bold">Join Campfire</Text>
            <Text className="text-white opacity-80 text-base mt-2">
              Create your adventure account
            </Text>
          </View>

          {/* Registration Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-white mb-2 font-semibold">Full Name</Text>
              <TextInput
                className="bg-white rounded-lg px-4 py-3 text-gray-800"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View className="mt-4">
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

            <View className="mt-4">
              <Text className="text-white mb-2 font-semibold">
                Confirm Password
              </Text>
              <TextInput
                className="bg-white rounded-lg px-4 py-3 text-gray-800"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {password && confirmPassword && password !== confirmPassword && (
              <Text className="text-red-200 text-sm mt-1">
                Passwords do not match
              </Text>
            )}

            <TouchableOpacity
              className="bg-white rounded-lg py-4 mt-6"
              onPress={handleRegister}
              disabled={
                !name ||
                !email ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              }
            >
              <Text className="text-orange-600 text-center font-bold text-lg">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Log in link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-white">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-white font-bold underline">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
