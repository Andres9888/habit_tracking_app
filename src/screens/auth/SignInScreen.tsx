import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        // Handle additional verification steps if needed
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Sign in incomplete. Please check your credentials.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-[60px]">
        <Text className="text-[32px] font-extrabold tracking-tight text-slate-900 mb-2">Welcome Back</Text>
        <Text className="text-base text-slate-500 mb-10">Sign in to continue tracking your habits</Text>

        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">EMAIL</Text>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#94a3b8"
              onChangeText={setEmailAddress}
              className="rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-base font-medium text-slate-900"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View className="gap-2">
            <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">PASSWORD</Text>
            <TextInput
              value={password}
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              onChangeText={setPassword}
              className="rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-base font-medium text-slate-900"
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            onPress={onSignInPress}
            disabled={isLoading || !emailAddress || !password}
            className={`rounded-3xl border border-slate-900 bg-slate-900 py-4 items-center mt-4 ${
              isLoading || !emailAddress || !password ? 'opacity-40' : ''
            }`}
          >
            <Text className="text-[13px] tracking-[3px] text-white font-bold">
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
