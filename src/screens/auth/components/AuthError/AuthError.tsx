import { Text, TouchableOpacity, View } from 'react-native';
import { AuthErrorProps } from './types';

export function AuthError({ message, onDismiss }: AuthErrorProps) {
  return (
    <View
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
      className="mb-4 rounded-2xl bg-red-50 p-4"
    >
      <Text className="text-sm text-red-800">{message}</Text>
      <TouchableOpacity
        accessibilityHint="Removes the error message from the screen"
        accessibilityLabel="Dismiss error"
        accessibilityRole="button"
        className="mt-2"
        onPress={onDismiss}
      >
        <Text className="text-sm font-medium text-red-600">Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}
