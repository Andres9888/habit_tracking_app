import { Pressable, Text, View } from 'react-native';

import { hasClerkPublishableKey, hasConvexUrl } from '../lib/appConfig';
import { colors as palette } from '../theme/colors';

function reloadWebPage(): void {
  if (globalThis.window) {
    globalThis.window.location.reload();
  }
}

export function MissingConfigFallback() {
  const missingKeys = [];
  if (!hasClerkPublishableKey)
    missingKeys.push('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
  if (!hasConvexUrl) missingKeys.push('EXPO_PUBLIC_CONVEX_URL');

  return (
    <View
      className='flex-1 items-center justify-center bg-white p-6'
      style={{
        alignItems: 'center',
        backgroundColor: palette.light.background,
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      <Text
        className='mb-3 text-2xl font-bold'
        style={{ color: palette.gray[900], marginBottom: 12 }}
      >
        Setup Required
      </Text>
      <Text
        className='mb-6 text-center text-base'
        style={{
          color: palette.gray[600],
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        App config is incomplete. Set the missing environment variables and
        restart Metro.
      </Text>
      {missingKeys.map((key) => (
        <Text
          className='mb-2 rounded-lg px-3 py-2 text-sm font-medium'
          style={{
            backgroundColor: palette.gray[50],
            borderRadius: 8,
            color: palette.gray[700],
            marginBottom: 8,
            padding: 8,
          }}
          key={key}
        >
          {key}
        </Text>
      ))}
      <Pressable
        accessibilityLabel='Reload app after updating environment variables'
        className='mt-2 rounded-lg bg-black px-4 py-3'
        style={{
          backgroundColor: palette.gray[900],
          borderRadius: 8,
          marginTop: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
        onPress={reloadWebPage}
      >
        <Text
          className='text-base font-semibold text-white'
          style={{ color: palette.text.inverse }}
        >
          Retry
        </Text>
      </Pressable>
    </View>
  );
}
