/** ProfileStatItem — single column in the profile stats row */
import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';
import { typography, fontFamilies, fontWeights } from '../../theme/typography';
import { useSettingsScale } from './useSettingsScale';

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
  const k = useSettingsScale();
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
            <Icon color={labelColor} size={k(iconSizes.micro + 3)} />
            <Text
              className='mt-1'
              style={{
                fontFamily: fontFamilies.serif,
                fontSize: k(15.5),
                lineHeight: k(20),
                fontWeight: fontWeights.bold,
                fontVariant: ['tabular-nums'],
                color,
              }}
            >
              {value}
            </Text>
            <Text
              className='mt-0.5 text-center'
              numberOfLines={1}
              style={{
                ...typography.caption,
                fontSize: k(10.5),
                fontWeight: fontWeights.semibold,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                color: labelColor,
              }}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
