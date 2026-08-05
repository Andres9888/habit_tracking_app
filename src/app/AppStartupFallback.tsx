import { Pressable, Text, View } from 'react-native';

import { colors as palette } from '../theme/colors';

function handleCriticalRetry(): void {
  if (globalThis.location) {
    globalThis.location.reload();
  }
}

export function AppStartupFallback() {
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
        Startup Error
      </Text>
      <Text
        className='mb-6 text-center text-base'
        style={{
          color: palette.gray[600],
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        The app did not finish loading. Tap retry to reload.
      </Text>
      <Pressable
        accessibilityLabel='Retry startup'
        className='mb-4 rounded-lg bg-black px-4 py-3'
        style={{
          backgroundColor: palette.gray[900],
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
        onPress={handleCriticalRetry}
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
