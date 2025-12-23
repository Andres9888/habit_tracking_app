import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppleLogo, GoogleLogo } from './logos';

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * SocialLoginButtons - OAuth login buttons for Google and Apple
 *
 * Features:
 * - Google and Apple OAuth flows via Clerk
 * - Professional SVG brand logos
 * - Press animations with spring physics
 * - Individual loading states per button
 * - User-friendly error messages
 * - Accessibility support with labels and hints
 *
 * @example
 * <SocialLoginButtons />
 */
export function SocialLoginButtons() {
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const googleScale = useSharedValue(1);
  const appleScale = useSharedValue(1);

  const googleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: googleScale.value }],
  }));

  const appleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: appleScale.value }],
  }));

  const handlePressIn = (scale: SharedValue<number>) => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = (scale: SharedValue<number>) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  /**
   * Converts OAuth errors into user-friendly messages
   * @param err - The error object from OAuth flow
   * @returns User-friendly error message or null if error should be ignored
   */
  const getErrorMessage = (err: any): string | null => {
    const errorCode = err.errors?.[0]?.code;
    const errorMessage = err.errors?.[0]?.message;

    // Handle common error scenarios with user-friendly messages
    if (errorCode === 'session_exists') {
      return 'You are already signed in. Please sign out and try again.';
    }
    if (errorCode === 'oauth_access_denied') {
      return 'Access was denied. Please try again or use a different sign-in method.';
    }
    if (errorMessage?.includes('cancelled') || errorMessage?.includes('canceled')) {
      return null; // Don't show error for user cancellation
    }
    if (err.message?.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }

    return errorMessage || 'An unexpected error occurred. Please try again.';
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { createdSessionId, setActive } = await startGoogleFlow({
        redirectUrl: Linking.createURL('/'),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      const errorMessage = getErrorMessage(err);
      if (errorMessage) {
        Alert.alert('Sign In Failed', errorMessage);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      const { createdSessionId, setActive } = await startAppleFlow({
        redirectUrl: Linking.createURL('/'),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error('Apple OAuth error:', err);
      const errorMessage = getErrorMessage(err);
      if (errorMessage) {
        Alert.alert('Sign In Failed', errorMessage);
      }
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <View className="gap-3">
      <AnimatedTouchable
        className="flex-row items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white py-[14px]"
        onPress={handleGoogleSignIn}
        onPressIn={() => handlePressIn(googleScale)}
        onPressOut={() => handlePressOut(googleScale)}
        disabled={googleLoading || appleLoading}
        accessible={true}
        accessibilityLabel="Sign in with Google"
        accessibilityRole="button"
        accessibilityHint="Opens Google sign in flow"
        style={googleAnimatedStyle}
      >
        {googleLoading ? (
          <ActivityIndicator size="small" color="#4285F4" />
        ) : (
          <GoogleLogo size={20} />
        )}
        <Text
          className="text-[13px] font-bold tracking-[2px] text-slate-900"
          style={{ opacity: googleLoading ? 0.6 : 1 }}
        >
          CONTINUE WITH GOOGLE
        </Text>
      </AnimatedTouchable>

      <AnimatedTouchable
        className="flex-row items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white py-[14px]"
        onPress={handleAppleSignIn}
        onPressIn={() => handlePressIn(appleScale)}
        onPressOut={() => handlePressOut(appleScale)}
        disabled={googleLoading || appleLoading}
        accessible={true}
        accessibilityLabel="Sign in with Apple"
        accessibilityRole="button"
        accessibilityHint="Opens Apple sign in flow"
        style={appleAnimatedStyle}
      >
        {appleLoading ? (
          <ActivityIndicator size="small" color="#000000" />
        ) : (
          <AppleLogo size={20} />
        )}
        <Text
          className="text-[13px] font-bold tracking-[2px] text-slate-900"
          style={{ opacity: appleLoading ? 0.6 : 1 }}
        >
          CONTINUE WITH APPLE
        </Text>
      </AnimatedTouchable>

      <View
        className="my-4 flex-row items-center gap-4"
        accessible={true}
        accessibilityRole="none"
        importantForAccessibility="no-hide-descendants"
      >
        <View className="h-[1px] flex-1 bg-slate-200" />
        <Text className="text-xs text-slate-400" aria-hidden={true}>OR</Text>
        <View className="h-[1px] flex-1 bg-slate-200" />
      </View>
    </View>
  );
}
