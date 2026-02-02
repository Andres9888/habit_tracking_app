/**
 * Action buttons for MilestoneCelebration
 */

import React, { useCallback } from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Button } from '../Button/Button';
import { styles } from './styles';

interface MilestoneActionsProps {
  onShare?: () => void;
  onClose: () => void;
  shareButtonStyle: StyleProp<ViewStyle>;
  continueButtonStyle: StyleProp<ViewStyle>;
}

export function MilestoneActions({
  onShare,
  onClose,
  shareButtonStyle,
  continueButtonStyle,
}: MilestoneActionsProps) {
  const handleShare = useCallback(() => {
    if (onShare) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onShare();
    }
  }, [onShare]);

  const handleContinue = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  return (
    <View style={styles.actions}>
      {/* Share Button */}
      {onShare && (
        <Animated.View style={[styles.shareButton, shareButtonStyle]}>
          <Button
            accessible
            accessibilityHint='Opens share card preview'
            accessibilityLabel='Share your achievement'
            size='large'
            variant='primary'
            onPress={handleShare}
          >
            Share Your Achievement
          </Button>
        </Animated.View>
      )}

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
