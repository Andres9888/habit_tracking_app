/**
 * WelcomeScreen - OAuth-only auth landing page
 */

import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AnimatedLogo,
  AuthError,
  SocialSignInButton,
} from './components';
import { LegalFooter } from './components/LegalFooter';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useWelcomeAnimations } from './hooks/useWelcomeAnimations';
import { useWelcomeStyles } from './WelcomeScreen.styles';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';

function WelcomeScreenContent() {
  const insets = useSafeAreaInsets();
  const styles = useWelcomeStyles();
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } =
    useOAuthSignIn();
  const handleApplePress = useCallback(() => { void signInWithApple(); }, [signInWithApple]);
  const handleGooglePress = useCallback(() => { void signInWithGoogle(); }, [signInWithGoogle]);
  const {
    iconStyle,
    titleStyle,
    subtitleStyle,
    buttonsStyle,
  } = useWelcomeAnimations();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={styles.gradientColors}
        locations={[0, 0.4, 1]}
        style={{ flex: 1 }}
      >
        <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
          <View style={styles.heroSection}>
            <Animated.View style={iconStyle}>
              <AnimatedLogo size={80} />
            </Animated.View>
            <Animated.Text style={[styles.title, titleStyle]}>
              Chain Day
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, subtitleStyle]}>
              Miss a day. Keep the chain.
            </Animated.Text>
          </View>

          <Animated.View style={[styles.actionSection, buttonsStyle]}>
            {error ? <AuthError message={error} onDismiss={clearError} /> : null}
            <SocialSignInButton
              disabled={!!isLoading}
              isLoading={isLoading === 'oauth_apple'}
              provider='apple'
              onPress={handleApplePress}
            />
            <SocialSignInButton
              disabled={!!isLoading}
              isLoading={isLoading === 'oauth_google'}
              provider='google'
              onPress={handleGooglePress}
            />
          </Animated.View>

          <View style={styles.footer}>
            <LegalFooter />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function WelcomeScreen() {
  return (
    <ScreenErrorBoundary screenName='Welcome'>
      <WelcomeScreenContent />
    </ScreenErrorBoundary>
  );
}
