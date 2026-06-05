/** ProfileStatItem — single column in the profile stats row */
import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';

interface ProfileStatItemProps {
  color: string;
  icon: LucideIcon;
  label: string;
  showDivider?: boolean;
  value: number;
}

export function ProfileStatItem({
  color,
  icon: Icon,
  label,
  showDivider = false,
  value,
}: ProfileStatItemProps) {
  return (
    <View className='flex-1 flex-row items-center'>
      {showDivider ? (
        <View className='mr-3 h-10 w-px' style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
      ) : null}
      <View className='flex-1 items-center'>
        <Icon color={color} size={iconSizes.small} />
        <Text
          className='mt-1'
          style={{ ...typography.heading3, color, fontWeight: fontWeights.bold }}
        >
          {value}
        </Text>
        <Text
          className='mt-0.5 text-center'
          numberOfLines={2}
          style={{ ...typography.caption, color: 'rgba(0,0,0,0.45)' }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}
