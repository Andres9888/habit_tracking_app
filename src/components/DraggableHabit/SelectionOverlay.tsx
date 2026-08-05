/**
 * SelectionOverlay — Animated checkbox shown on the left of a habit card
 * during selection mode.
 */

import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Checkbox } from '../Checkbox';

interface SelectionOverlayProps {
  isSelected: boolean;
  onToggle: () => void;
}

function SelectionOverlayComponent({ isSelected, onToggle }: SelectionOverlayProps) {
  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={s.wrap}>
      <Checkbox checked={isSelected} size="md" variant="primary" onPress={onToggle} />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});

export const SelectionOverlay = memo(SelectionOverlayComponent);
