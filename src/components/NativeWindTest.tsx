/**
 * Proof-of-Concept Component to Test NativeWind Configuration
 * This component tests various NativeWind utilities to ensure proper setup
 */
import React from "react";
import { Text, View } from "react-native";

export function NativeWindTest() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-100 p-4">
      <View className="bg-white rounded-lg shadow-md p-6 mb-4 border border-slate-200">
        <Text className="text-2xl font-bold text-slate-900 mb-2">
          NativeWind Test
        </Text>
        <Text className="text-sm text-slate-600">
          If you can see styled text with proper spacing, colors, and shadows,
          NativeWind is working correctly! ✅
        </Text>
      </View>

      <View className="flex-row gap-2">
        <View className="bg-green-500 px-4 py-2 rounded-md">
          <Text className="text-white font-medium">Success</Text>
        </View>
        <View className="bg-blue-500 px-4 py-2 rounded-md">
          <Text className="text-white font-medium">Primary</Text>
        </View>
        <View className="bg-red-500 px-4 py-2 rounded-md">
          <Text className="text-white font-medium">Danger</Text>
        </View>
      </View>
    </View>
  );
}

export default NativeWindTest;
