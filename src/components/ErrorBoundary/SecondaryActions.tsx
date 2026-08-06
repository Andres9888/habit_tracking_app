/** Secondary action links for ErrorFallback. */

import { Pressable, Text, View, StyleSheet } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';

interface SecondaryActionsProps {
  onOpenSettings?: () => void;
  onContactSupport: () => void;
}

export function SecondaryActions({
  onOpenSettings,
  onContactSupport,
}: SecondaryActionsProps) {
  const { colors } = useThemeColors();

  const styles = StyleSheet.create({
    actions: { flexDirection: 'row', gap: 16, marginTop: 16 },
    link: { padding: 8 },
    linkText: { ...typography.caption, color: colors.primary[600] },
  });

  return (
    <View style={styles.actions}>
      {onOpenSettings ? <Pressable
          accessibilityLabel='Open app settings'
          accessibilityRole='link'
          style={styles.link}
          onPress={onOpenSettings}
        >
          <Text style={styles.linkText}>Go to Settings</Text>
        </Pressable> : null}
      <Pressable
        accessibilityLabel='Contact support via email'
        accessibilityRole='link'
        style={styles.link}
        onPress={onContactSupport}
      >
        <Text style={styles.linkText}>Contact Support</Text>
      </Pressable>
    </View>
  );
}
