/**
 * SignInScreen - Premium sign in experience
 * Clean design with chain branding and smooth animations
 * OPTIMIZED: Gradient bg, form card depth, proper type scale
 */

import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useSignInFlow } from './hooks/useSignInFlow';
import { useSignInAnimations } from './useSignInAnimations';
import {
  ForgotPasswordModal,
  SignInBrandSection,
  SignInFormSection,
} from './components';
import { styles } from './SignInScreen.styles';

// eslint-disable-next-line max-lines-per-function
export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { logoStyle, headerStyle, contentStyle } = useSignInAnimations();
  const signInFlow = useSignInFlow();
  const oAuth = useOAuthSignIn();

  const isAnyLoading = signInFlow.isLoading || !!oAuth.isLoading;

  return (
    <View style={styles.container}>
      {/* OPTIMIZED: Gradient background for depth */}
      <LinearGradient
        colors={[colors.light.background, colors.light.gradientMid]}
        style={styles.gradientBg}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: insets.bottom + 24,
                paddingTop: insets.top + 40,
              },
            ]}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <SignInBrandSection
              headerStyle={headerStyle}
              logoStyle={logoStyle}
            />

            {/* OPTIMIZED: Form card with depth */}
            <Animated.View
              entering={FadeInDown.delay(100).springify().damping(18)}
              style={styles.formCard}
            >
              <SignInFormSection
                canSubmit={signInFlow.canSubmit}
                clearError={oAuth.clearError}
                contentStyle={contentStyle}
                emailAddress={signInFlow.emailAddress}
                emailError={signInFlow.emailError}
                handleSignIn={signInFlow.handleSignIn}
                isAnyLoading={isAnyLoading}
                isLoading={signInFlow.isLoading}
                oauthError={oAuth.error}
                oauthLoading={oAuth.isLoading}
                password={signInFlow.password}
                setEmailAddress={signInFlow.setEmailAddress}
                setPassword={signInFlow.setPassword}
                signInWithApple={oAuth.signInWithApple}
                signInWithGoogle={oAuth.signInWithGoogle}
                onEmailBlur={signInFlow.onEmailBlur}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            </Animated.View>

            {/* OPTIMIZED: Staggered footer with proper contrast */}
            <Animated.View
              entering={FadeInDown.delay(200).springify().damping(18)}
              style={styles.footer}
            >
              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
                <Text style={styles.footerLink}>Terms</Text> &{' '}
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      <ForgotPasswordModal
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </View>
  );
}
