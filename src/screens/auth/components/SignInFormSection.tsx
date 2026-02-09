/**
 * SignInFormSection - Social buttons, email/password form, and submit
 */

import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  AuthDivider,
  AuthError,
  ForgotPasswordLink,
  FormInput,
  SocialSignInButton,
  SubmitButton,
} from './index';
import { styles } from '../SignInScreen.styles';
import type { SignInFormSectionProps } from './SignInFormSection.types';

export function SignInFormSection(props: SignInFormSectionProps) {
  const {
    contentStyle,
    emailAddress,
    setEmailAddress,
    emailError,
    onEmailBlur,
    password,
    setPassword,
    isLoading,
    isAnyLoading,
    canSubmit,
    oauthLoading,
    oauthError,
    clearError,
    handleSignIn,
    signInWithApple,
    signInWithGoogle,
    onForgotPassword,
  } = props;

  return (
    <Animated.View style={[styles.authContent, contentStyle]}>
      {oauthError && <AuthError message={oauthError} onDismiss={clearError} />}
      <View style={styles.socialButtons}>
        <SocialSignInButton
          disabled={isAnyLoading}
          isLoading={oauthLoading === 'oauth_apple'}
          provider='apple'
          onPress={signInWithApple}
        />
        <SocialSignInButton
          disabled={isAnyLoading}
          isLoading={oauthLoading === 'oauth_google'}
          provider='google'
          onPress={signInWithGoogle}
        />
      </View>
      <AuthDivider />
      <View style={styles.formSection}>
        <FormInput
          autoCapitalize='none'
          autoComplete='email'
          editable={!isAnyLoading}
          error={emailError ?? undefined}
          keyboardType='email-address'
          label='Email'
          placeholder='your@email.com'
          value={emailAddress}
          onBlur={onEmailBlur}
          onChangeText={setEmailAddress}
        />
        <FormInput
          secureTextEntry
          autoComplete='password'
          editable={!isAnyLoading}
          label='Password'
          labelRight={<ForgotPasswordLink onPress={onForgotPassword} />}
          placeholder='Enter your password'
          value={password}
          onChangeText={setPassword}
        />
        <SubmitButton
          disabled={!canSubmit || isAnyLoading}
          isLoading={isLoading}
          label='Continue'
          loadingLabel='Signing in...'
          onPress={handleSignIn}
        />
      </View>
    </Animated.View>
  );
}
