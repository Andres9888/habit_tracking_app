import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

export function SocialLoginButtons() {
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow({
        redirectUrl: Linking.createURL('/'),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to sign in with Google');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startAppleFlow({
        redirectUrl: Linking.createURL('/'),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error('Apple OAuth error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to sign in with Apple');
    }
  };

  return (
    <View className="gap-3">
      <TouchableOpacity
        className="flex-row items-center justify-center gap-3 rounded-3xl border border-stone-200 bg-white py-[14px]"
        onPress={handleGoogleSignIn}
      >
        <Text className="text-2xl">G</Text>
        <Text className="text-[13px] font-bold tracking-[2px] text-stone-900">
          CONTINUE WITH GOOGLE
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center justify-center gap-3 rounded-3xl border border-stone-200 bg-white py-[14px]"
        onPress={handleAppleSignIn}
      >
        <Text className="text-2xl"></Text>
        <Text className="text-[13px] font-bold tracking-[2px] text-stone-900">
          CONTINUE WITH APPLE
        </Text>
      </TouchableOpacity>

      <View className="my-4 flex-row items-center gap-4">
        <View className="h-[1px] flex-1 bg-stone-200" />
        <Text className="text-xs text-stone-400">OR</Text>
        <View className="h-[1px] flex-1 bg-stone-200" />
      </View>
    </View>
  );
}
