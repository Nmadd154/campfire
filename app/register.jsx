import { useAuth } from "@/context/AuthContextAppwrite";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Missing Password", "Please enter a password.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(email, password, name);
      if (result.success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Registration Failed",
          result.error || "Registration failed",
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Error",
        "An error occurred during registration. Please try again.",
      );
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
              className={`rounded-lg py-4 mt-6 ${isLoading || !name || !email || !password || !confirmPassword || password !== confirmPassword ? "bg-white/70" : "bg-white"}`}
              onPress={handleRegister}
              disabled={
                isLoading ||
                !name ||
                !email ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              }
            >
              {isLoading ? (
                <ActivityIndicator color="#ea580c" />
              ) : (
                <Text className="text-orange-600 text-center font-bold text-lg">
                  Create Account
                </Text>
              )}
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
