import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

type AuthMode = "welcome" | "signin" | "signup";

export default function WelcomeScreen() {
  const [mode, setMode] = useState<AuthMode>("welcome");

  if (mode === "signin") {
    return (
      <View className="flex-1 bg-white">
        <SignInScreen />
        <TouchableOpacity
          onPress={() => setMode("welcome")}
          className="absolute top-[60px] left-6 z-10"
        >
          <Text className="text-base text-slate-900 font-semibold">← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === "signup") {
    return (
      <View className="flex-1 bg-white">
        <SignUpScreen />
        <TouchableOpacity
          onPress={() => setMode("welcome")}
          className="absolute top-[60px] left-6 z-10"
        >
          <Text className="text-base text-slate-900 font-semibold">← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-between pt-[100px] pb-[60px]">
        <View className="items-center gap-4">
          <Text className="text-[80px] mb-4">✓</Text>
          <Text className="text-[40px] font-extrabold tracking-tight text-slate-900 text-center">Habit Tracker</Text>
          <Text className="text-lg text-slate-500 text-center leading-7">
            Build better habits, one day at a time
          </Text>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            onPress={() => setMode("signup")}
            className="rounded-3xl bg-slate-900 py-[18px] items-center"
          >
            <Text className="text-[13px] tracking-[3px] text-white font-bold">GET STARTED</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode("signin")}
            className="rounded-3xl border border-slate-200 py-[18px] items-center"
          >
            <Text className="text-[13px] tracking-[3px] text-slate-900 font-bold">SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
