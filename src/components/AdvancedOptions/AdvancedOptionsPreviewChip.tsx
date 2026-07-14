/** Small rounded preview pill used in the collapsed summary row. */
import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';

interface Props {
  icon: ReactNode;
  label: string;
  backgroundColor: string;
  foregroundColor: string;
}

export function AdvancedOptionsPreviewChip({
  icon,
  label,
  backgroundColor,
  foregroundColor,
}: Props) {
  return (
    <View
      className='flex-row items-center gap-1 rounded-full px-2.5 py-1'
      style={{ backgroundColor }}
    >
      {icon}
      <Text
        style={{
          ...typography.caption,
          fontSize: 11,
          fontWeight: fontWeights.semibold,
          color: foregroundColor,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
