/** Secondary action links for ErrorFallback. Theme-aware. */

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useErrorTheme } from './useErrorTheme';

interface SecondaryActionsProps {
  onOpenSettings?: () => void;
  onContactSupport: () => void;
}

export function SecondaryActions({
  onOpenSettings,
  onContactSupport,
}: SecondaryActionsProps) {
  const { colors } = useErrorTheme();

  return (
    <View style={styles.actions}>
      {onOpenSettings && (
        <Pressable
          accessibilityLabel='Open app settings'
          accessibilityRole='link'
          style={styles.link}
          onPress={onOpenSettings}
        >
          <Text style={[styles.linkText, { color: colors.primary[600] }]}>
            Go to Settings
          </Text>
        </Pressable>
      )}
      <Pressable
        accessibilityLabel='Contact support via email'
        accessibilityRole='link'
        style={styles.link}
        onPress={onContactSupport}
      >
        <Text style={[styles.linkText, { color: colors.primary[600] }]}>
          Contact Support
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 16, marginTop: 16 },
  link: { padding: 8 },
  linkText: { fontSize: 13, fontWeight: '500' },
});
