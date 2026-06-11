import { Text, View } from "react-native";
import { APP_MODE } from "../config/mode";

/**
 * Demo Mode Banner
 * Shows a banner at the top when running in demo mode
 */
export const DemoModeBanner = () => {
  if (APP_MODE !== "demo") return null;

  return (
    <View className="bg-orange-500 px-4 py-2">
      <Text className="text-white text-center text-sm font-medium">
        🎮 Demo Mode - Using Mock Data
      </Text>
    </View>
  );
};
