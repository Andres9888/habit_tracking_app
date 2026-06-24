/** ProfileStatItem — single column in the profile stats row */
import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';
import { typography, fontFamilies, fontWeights } from '../../theme/typography';

interface ProfileStatItemProps {
  color: string;
  dividerColor: string;
  icon: LucideIcon;
  isLoading?: boolean;
  label: string;
  labelColor: string;
  showDivider?: boolean;
  value: number;
}

export function ProfileStatItem({
  color,
  dividerColor,
  icon: Icon,
  isLoading = false,
  label,
  labelColor,
  showDivider = false,
  value,
}: ProfileStatItemProps) {
  return (
    <View className='flex-1 flex-row items-center'>
      {showDivider ? (
        <View
          className='mr-3 h-10 w-px'
          style={{ backgroundColor: dividerColor }}
        />
      ) : null}
      <View className='flex-1 items-center'>
        {isLoading ? (
          <>
            <SkeletonLoader borderRadius={6} height={18} width={18} />
            <SkeletonLoader
              borderRadius={6}
              height={22}
              style={{ marginTop: 6 }}
              width={28}
            />
            <SkeletonLoader
              borderRadius={4}
              height={12}
              style={{ marginTop: 6 }}
              width={52}
            />
          </>
        ) : (
          <>
            <Icon color={labelColor} size={iconSizes.small} />
            <Text
              className='mt-1'
              style={{
                fontFamily: fontFamilies.serif,
                fontSize: 18,
                lineHeight: 22,
                fontWeight: fontWeights.bold,
                fontVariant: ['tabular-nums'],
                color,
              }}
            >
              {value}
            </Text>
            <Text
              className='mt-0.5 text-center'
              numberOfLines={2}
              style={{ ...typography.caption, color: labelColor }}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
