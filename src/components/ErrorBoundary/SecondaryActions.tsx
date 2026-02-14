/** Secondary action links for ErrorFallback. */

import { Pressable, Text, View } from 'react-native';

import { styles } from './errorFallbackStyles';

interface SecondaryActionsProps {
  onOpenSettings?: () => void;
  onContactSupport: () => void;
}

export function SecondaryActions({
  onOpenSettings,
  onContactSupport,
}: SecondaryActionsProps) {
  return (
    <View style={styles.actions}>
      {onOpenSettings && (
        <Pressable style={styles.link} onPress={onOpenSettings}>
          <Text style={styles.linkText}>Go to Settings</Text>
        </Pressable>
      )}
      <Pressable style={styles.link} onPress={onContactSupport}>
        <Text style={styles.linkText}>Contact Support</Text>
      </Pressable>
    </View>
  );
}
