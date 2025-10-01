import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification code to {emailAddress}
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>VERIFICATION CODE</Text>
              <TextInput
                value={code}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#94a3b8"
                onChangeText={setCode}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              onPress={onVerifyPress}
              disabled={isLoading || code.length !== 6}
              style={[styles.button, (isLoading || code.length !== 6) && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "VERIFYING..." : "VERIFY EMAIL"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start tracking your habits today</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#94a3b8"
              onChangeText={setEmailAddress}
              style={styles.input}
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              value={password}
              placeholder="Create a password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
              autoComplete="password-new"
            />
          </View>

          <TouchableOpacity
            onPress={onSignUpPress}
            disabled={isLoading || !emailAddress || !password}
            style={[styles.button, (isLoading || !emailAddress || !password) && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    color: '#64748b',
  },
  input: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  button: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#0f172a',
    backgroundColor: '#0f172a',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 13,
    letterSpacing: 3,
    color: '#fff',
    fontWeight: '700',
  },
});
