/**
 * SignInScreen - Premium sign in experience
 * Clean design with chain branding and smooth animations
 */

import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useSignInFlow } from './hooks/useSignInFlow';
import { useSignInAnimations } from './useSignInAnimations';
import {
  ForgotPasswordModal,
  SignInBrandSection,
  SignInFormSection,
} from './components';
import { styles } from './SignInScreen.styles';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { logoStyle, headerStyle, contentStyle } = useSignInAnimations();
  const signInFlow = useSignInFlow();
  const oAuth = useOAuthSignIn();

  const isAnyLoading = signInFlow.isLoading || !!oAuth.isLoading;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24, paddingTop: insets.top + 40 },
          ]}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <SignInBrandSection headerStyle={headerStyle} logoStyle={logoStyle} />

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

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ForgotPasswordModal
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </View>
  );
}
