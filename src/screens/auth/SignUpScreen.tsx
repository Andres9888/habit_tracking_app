import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        Alert.alert("Error", "Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Failed to verify email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-white">
        <View className="pt-15 flex-1 px-6">
          <Text className="mb-2 text-[32px] font-extrabold tracking-tight text-slate-900">
            Verify Email
          </Text>
          <Text className="mb-10 text-base text-slate-500">
            We've sent a verification code to {emailAddress}
          </Text>

          <View className="gap-6">
            <View className="gap-2">
              <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">
                VERIFICATION CODE
              </Text>
              <TextInput
                className="rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-base font-medium text-slate-900"
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#94a3b8"
                value={code}
                onChangeText={setCode}
              />
            </View>

            <TouchableOpacity
              className={`mt-4 items-center rounded-3xl border border-slate-900 bg-slate-900 py-4 ${
                isLoading || code.length !== 6 ? "opacity-40" : ""
              }`}
              disabled={isLoading || code.length !== 6}
              onPress={onVerifyPress}
            >
              <Text className="text-[13px] font-bold tracking-[3px] text-white">
                {isLoading ? "VERIFYING..." : "VERIFY EMAIL"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="pt-15 flex-1 px-6">
        <Text className="mb-2 text-[32px] font-extrabold tracking-tight text-slate-900">
          Create Account
        </Text>
        <Text className="mb-10 text-base text-slate-500">
          Start tracking your habits today
        </Text>

        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">
              EMAIL
            </Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              className="rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-base font-medium text-slate-900"
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor="#94a3b8"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>

          <View className="gap-2">
            <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">
              PASSWORD
            </Text>
            <TextInput
              secureTextEntry
              autoComplete="password-new"
              className="rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-base font-medium text-slate-900"
              placeholder="Create a password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className={`mt-4 items-center rounded-3xl border border-slate-900 bg-slate-900 py-4 ${
              isLoading || !emailAddress || !password ? "opacity-40" : ""
            }`}
            disabled={isLoading || !emailAddress || !password}
            onPress={onSignUpPress}
          >
            <Text className="text-[13px] font-bold tracking-[3px] text-white">
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
