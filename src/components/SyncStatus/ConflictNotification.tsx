/**
 * ConflictNotification - Shows when server data overrides local changes
 *
 * Implements conflict resolution UX (Audit Priority 4)
 */

import React from 'react';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { styles } from './ConflictNotification.styles';
import { useConflictAnimation } from './ConflictNotification.hooks';
import { ConflictNotificationContent } from './components/ConflictNotificationContent';
import type { ConflictNotificationProps } from './ConflictNotification.types';

export type {
  ConflictNotificationProps,
  UseConflictNotificationResult,
} from './ConflictNotification.types';
export { useConflictNotification } from './ConflictNotification.hooks';

export function ConflictNotification({
  visible,
  conflictCount,
  onDismiss,
  testID = 'conflict-notification',
}: ConflictNotificationProps) {
  const { colors } = useThemeColors();
  const animatedStyle = useConflictAnimation({ visible, onDismiss });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.status.warning || '#F59E0B',
        },
        animatedStyle,
      ]}
      testID={testID}
    >
      <ConflictNotificationContent
        conflictCount={conflictCount}
        onDismiss={onDismiss}
      />
    </Animated.View>
  );
}
