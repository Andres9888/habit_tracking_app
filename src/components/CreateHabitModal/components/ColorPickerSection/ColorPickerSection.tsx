
import { memo } from 'react';

import type { ColorPickerSectionProps } from './types';
import { ColorPickerContent } from './ColorPickerContent';

const ColorPickerSectionComponent = ({
  colors,
  selectedColor,
  onSelectColor,
  onCustomPress,
  hideLabel = false,
}: ColorPickerSectionProps) => (
  <ColorPickerContent
    colors={colors}
    hideLabel={hideLabel}
    selectedColor={selectedColor}
    onCustomPress={onCustomPress}
    onSelectColor={onSelectColor}
  />
);

export const ColorPickerSection = memo(ColorPickerSectionComponent);
