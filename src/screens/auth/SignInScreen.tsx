import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue tracking your habits</Text>

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
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            onPress={onSignInPress}
            disabled={isLoading || !emailAddress || !password}
            style={[styles.button, (isLoading || !emailAddress || !password) && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
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
