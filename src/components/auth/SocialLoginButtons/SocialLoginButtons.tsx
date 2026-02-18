import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { View, Text } from 'react-native';

import { AppleLogo, GoogleLogo } from '../logos';
import { Divider } from './Divider';
import { getErrorMessage } from './errorUtils';
import { OAuthButton } from './OAuthButton';

WebBrowser.maybeCompleteAuthSession();

/**
 * SocialLoginButtons - OAuth login buttons for Google and Apple
 * Shows inline error messages instead of Alert dialogs for better UX
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
  const [error, setError] = useState<string | null>(null);

  const anyLoading = googleLoading || appleLoading;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { createdSessionId, setActive } = await startGoogleFlow({
        redirectUrl: Linking.createURL('/'),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error: unknown) {
      if (__DEV__) console.error('Google OAuth error:', error);
      const errorMessage = getErrorMessage(error);
      if (errorMessage) {
        setError(errorMessage);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    setError(null);
    try {
      const { createdSessionId, setActive } = await startAppleFlow({
        redirectUrl: Linking.createURL('/'),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error: unknown) {
      if (__DEV__) console.error('Apple OAuth error:', error);
      const errorMessage = getErrorMessage(error);
      if (errorMessage) {
        setError(errorMessage);
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
      {error && (
        <View
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          className='rounded-xl border border-red-200 bg-red-50 px-4 py-3'
        >
          <Text className='text-center text-sm font-medium text-red-700'>
            {error}
          </Text>
        </View>
      )}
      <Divider />
    </View>
  );
}
