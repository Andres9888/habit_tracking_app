/**
 * Action buttons for MilestoneCelebration
 */

import React, { useCallback } from 'react';
import { View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { Button } from '../Button/Button';
import { styles } from './styles';
import { triggerHaptic } from '@/utils/haptics';

interface MilestoneActionsProps {
  onClose: () => void;
  continueButtonStyle: AnimatedStyle<ViewStyle>;
}

export function MilestoneActions({
  onClose,
  continueButtonStyle,
}: MilestoneActionsProps) {
  const handleContinue = useCallback(() => {
    triggerHaptic('tap');
    onClose();
  }, [onClose]);

  return (
    <View style={styles.actions}>
      {/* Continue Button */}
      <Animated.View style={continueButtonStyle}>
        <Button
          accessible
          accessibilityHint='Dismiss celebration and return to app'
          accessibilityLabel='Continue'
          size='large'
          variant='ghost'
          onPress={handleContinue}
        >
          Continue
        </Button>
      </Animated.View>
    </View>
  );
}
