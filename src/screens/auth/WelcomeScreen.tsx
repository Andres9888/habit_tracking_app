import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

type AuthMode = "welcome" | "signin" | "signup";

export default function WelcomeScreen() {
  const [mode, setMode] = useState<AuthMode>("welcome");

  if (mode === "signin") {
    return (
      <View style={styles.container}>
        <SignInScreen />
        <TouchableOpacity
          onPress={() => setMode("welcome")}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === "signup") {
    return (
      <View style={styles.container}>
        <SignUpScreen />
        <TouchableOpacity
          onPress={() => setMode("welcome")}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>✓</Text>
          <Text style={styles.title}>Habit Tracker</Text>
          <Text style={styles.subtitle}>
            Build better habits, one day at a time
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => setMode("signup")}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>GET STARTED</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode("signin")}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>SIGN IN</Text>
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
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 60,
  },
  hero: {
    alignItems: 'center',
    gap: 16,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 28,
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    borderRadius: 24,
    backgroundColor: '#0f172a',
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 13,
    letterSpacing: 3,
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 13,
    letterSpacing: 3,
    color: '#0f172a',
    fontWeight: '700',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
});
