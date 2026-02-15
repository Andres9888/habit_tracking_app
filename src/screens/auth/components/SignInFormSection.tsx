/**
 * SignInFormSection - Social buttons, email/password form, and submit
 */

import React, { useRef } from 'react';
import { TextInput, View } from 'react-native';

import Animated from 'react-native-reanimated';

import type { SignInFormSectionProps } from './SignInFormSection.types';
import { AuthDivider } from './AuthDivider';
import { AuthError } from './AuthError';
import { ForgotPasswordLink } from './ForgotPasswordLink';
import { FormInput } from './FormInput';
import { PasswordInput } from './PasswordInput';
import { SocialSignInButton } from './SocialSignInButton';
import { SubmitButton } from './SubmitButton';
import { styles } from '../SignInScreen.styles';

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

  const passwordRef = useRef<TextInput>(null);

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
          blurOnSubmit={false}
          editable={!isAnyLoading}
          error={emailError ?? undefined}
          keyboardType='email-address'
          label='Email'
          placeholder='your@email.com'
          returnKeyType='next'
          value={emailAddress}
          onBlur={onEmailBlur}
          onChangeText={setEmailAddress}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <PasswordInput
          ref={passwordRef}
          autoComplete='password'
          editable={!isAnyLoading}
          labelRight={<ForgotPasswordLink onPress={onForgotPassword} />}
          placeholder='Enter your password'
          returnKeyType='go'
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleSignIn}
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
