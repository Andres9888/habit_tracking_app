import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { AppleLogo, GoogleLogo } from '../logos';
import { Divider } from './Divider';
import { getErrorMessage } from './errorUtils';
import { OAuthButton } from './OAuthButton';

WebBrowser.maybeCompleteAuthSession();

/**
 * SocialLoginButtons - OAuth login buttons for Google and Apple
 */
export function SocialLoginButtons() {
  const { startOAuthFlow: startGoogleFlow } = useOAuth({
    strategy: 'oauth_google',
  });
  const { startOAuthFlow: startAppleFlow } = useOAuth({
    strategy: 'oauth_apple',
  });

  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const anyLoading = googleLoading || appleLoading;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { createdSessionId, setActive } = await startGoogleFlow({
        redirectUrl: Linking.createURL('/'),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error_: unknown) {
      if (__DEV__) console.error('Google OAuth error:', error_);
      const errorMessage = getErrorMessage(error_);
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
    } catch (error_: unknown) {
      if (__DEV__) console.error('Apple OAuth error:', error_);
      const errorMessage = getErrorMessage(error_);
      if (errorMessage) {
        Alert.alert('Sign In Failed', errorMessage);
      }
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <View className='gap-3'>
      <OAuthButton
        accessibilityHint='Opens Google sign in flow'
        accessibilityLabel='Sign in with Google'
        disabled={anyLoading}
        loading={googleLoading}
        loadingColor='#4285F4'
        Logo={GoogleLogo}
        providerName='GOOGLE'
        onPress={handleGoogleSignIn}
      />
      <OAuthButton
        accessibilityHint='Opens Apple sign in flow'
        accessibilityLabel='Sign in with Apple'
        disabled={anyLoading}
        loading={appleLoading}
        loadingColor='#000000'
        Logo={AppleLogo}
        providerName='APPLE'
        onPress={handleAppleSignIn}
      />
      <Divider />
    </View>
  );
}
