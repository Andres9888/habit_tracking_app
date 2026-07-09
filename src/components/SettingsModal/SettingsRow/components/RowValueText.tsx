/** Flash-aware value text for selection/info rows — tints green on change. */
import Animated from 'react-native-reanimated';
import { typography, fontWeights } from '@/theme/typography';
import { useValueFlash } from '../SettingsRow.hooks';

const FLASH_PADDING = {
  borderRadius: 6,
  paddingHorizontal: 4,
} as const;

interface RowValueTextProps {
  value: string;
  color: string;
  variant: 'selection' | 'info';
}

export function RowValueText({ value, color, variant }: RowValueTextProps) {
  const flashStyle = useValueFlash(value);

  if (variant === 'selection') {
    return (
      <Animated.Text
        style={[
          {
            ...typography.body,
            fontWeight: fontWeights.medium,
            color,
            ...FLASH_PADDING,
          },
          flashStyle,
        ]}
      >
        {value}
      </Animated.Text>
    );
  }

  return (
    <Animated.Text
      className='ml-2'
      numberOfLines={1}
      style={[
        {
          ...typography.bodySmall,
          fontWeight: fontWeights.medium,
          color,
          flexShrink: 1,
          maxWidth: 140,
          textAlign: 'right',
          ...FLASH_PADDING,
        },
        flashStyle,
      ]}
    >
      {value}
    </Animated.Text>
  );
}
