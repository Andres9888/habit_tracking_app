import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Link } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AuthDivider, AuthError, SocialSignInButton } from './components';
import { styles } from './WelcomeScreen.styles';

interface WelcomeContentProps {
  insets: { top: number };
  signInWithGoogle: () => void;
  signInWithApple: () => void;
  isLoading: string | null;
  error: string | null;
  clearError: () => void;
  iconStyle: object;
  titleStyle: object;
  subtitleStyle: object;
  buttonsStyle: object;
  onSignUp: () => void;
  onSignIn: () => void;
}

export function WelcomeContent({
  insets,
  signInWithGoogle,
  signInWithApple,
  isLoading,
  error,
  clearError,
  iconStyle,
  titleStyle,
  subtitleStyle,
  buttonsStyle,
  onSignUp,
  onSignIn,
}: WelcomeContentProps) {
  return (
    <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
      <View style={styles.heroSection}>
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <Link color='#1c1917' size={40} strokeWidth={2} />
        </Animated.View>
        <Animated.Text style={[styles.title, titleStyle]}>
          Chain Day
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Build habits that stick
        </Animated.Text>
      </View>
      <Animated.View style={[styles.actionSection, buttonsStyle]}>
        {error && <AuthError message={error} onDismiss={clearError} />}
        <SocialSignInButton
          disabled={!!isLoading}
          isLoading={isLoading === 'oauth_apple'}
          provider='apple'
          onPress={signInWithApple}
        />
        <SocialSignInButton
          disabled={!!isLoading}
          isLoading={isLoading === 'oauth_google'}
          provider='google'
          onPress={signInWithGoogle}
        />
        <AuthDivider />
        <AnimatedPressable
          accessibilityLabel='Create free account with Chain Day'
          accessibilityRole='button'
          accessibilityState={{ disabled: !!isLoading }}
          disableAnimation={!!isLoading}
          disabled={!!isLoading}
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={onSignUp}
        >
          <Text style={styles.primaryButtonText}>Create Free Account</Text>
        </AnimatedPressable>
        <AnimatedPressable
          accessibilityLabel='Sign in to existing account'
          accessibilityRole='link'
          accessibilityState={{ disabled: !!isLoading }}
          disableAnimation={!!isLoading}
          disabled={!!isLoading}
          style={styles.textLink}
          onPress={onSignIn}
        >
          <Text style={styles.textLinkLabel}>Already have an account?</Text>
          <Text style={styles.textLinkAction}> Sign in</Text>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
