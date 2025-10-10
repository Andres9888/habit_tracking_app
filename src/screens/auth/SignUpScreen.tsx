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
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to verify email");
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1 px-6 pt-15">
          <Text className="text-[32px] font-extrabold tracking-tight text-slate-900 mb-2">
            Verify Email
          </Text>
          <Text className="text-base text-slate-500 mb-10">
            We've sent a verification code to {emailAddress}
          </Text>

          <View className="gap-6">
            <View className="gap-2">
              <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">
                VERIFICATION CODE
              </Text>
              <TextInput
                value={code}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#94a3b8"
                onChangeText={setCode}
                className="rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-base font-medium text-slate-900"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              onPress={onVerifyPress}
              disabled={isLoading || code.length !== 6}
              className={`rounded-3xl border border-slate-900 bg-slate-900 py-4 items-center mt-4 ${
                isLoading || code.length !== 6 ? 'opacity-40' : ''
              }`}
            >
              <Text className="text-[13px] tracking-[3px] text-white font-bold">
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
      <View className="flex-1 px-6 pt-15">
        <Text className="text-[32px] font-extrabold tracking-tight text-slate-900 mb-2">
          Create Account
        </Text>
        <Text className="text-base text-slate-500 mb-10">
          Start tracking your habits today
        </Text>

        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">
              EMAIL
            </Text>
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
            <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">
              PASSWORD
            </Text>
            <TextInput
              value={password}
              placeholder="Create a password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              onChangeText={setPassword}
              className="rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-base font-medium text-slate-900"
              autoComplete="password-new"
            />
          </View>

          <TouchableOpacity
            onPress={onSignUpPress}
            disabled={isLoading || !emailAddress || !password}
            className={`rounded-3xl border border-slate-900 bg-slate-900 py-4 items-center mt-4 ${
              isLoading || !emailAddress || !password ? 'opacity-40' : ''
            }`}
          >
            <Text className="text-[13px] tracking-[3px] text-white font-bold">
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
