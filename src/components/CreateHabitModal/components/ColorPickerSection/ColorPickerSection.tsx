import { memo } from 'react';
import { ColorPickerContent } from './ColorPickerContent';
import { ColorRow } from './ColorRow';
import type { ColorPickerSectionProps } from './types';

const ColorPickerSectionComponent = ({
  colors,
  selectedColor,
  onSelectColor,
  onCustomPress,
  hideLabel = false,
  variant = 'rows',
}: ColorPickerSectionProps) =>
  variant === 'row' ? (
    <ColorRow
      colors={colors}
      selectedColor={selectedColor}
      onSelectColor={onSelectColor}
    />
  ) : (
    <ColorPickerContent
      colors={colors}
      hideLabel={hideLabel}
      selectedColor={selectedColor}
      onCustomPress={onCustomPress}
      onSelectColor={onSelectColor}
    />
  );

export const ColorPickerSection = memo(ColorPickerSectionComponent);
