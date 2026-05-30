/** AccountRowContent — shared avatar + identity + chevron for both account-row variants */
import { Text, View } from 'react-native';
import { ChevronRight, Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { borderRadius } from '../../theme/spacing';

export interface AccountRowPalette {
  avatarBg: string;
  avatarBorderColor: string;
  avatarBorderWidth: number;
  avatarTextColor: string;
  textColor: string;
  subColor: string;
  chevronColor: string;
  badgeBg: string;
  badgeFg: string;
}

interface Props {
  name: string;
  email?: string;
  initial: string;
  isPremium: boolean;
  avatarSize: number;
  nameSize: number;
  palette: AccountRowPalette;
}

export function AccountRowContent({
  name,
  email,
  initial,
  isPremium,
  avatarSize,
  nameSize,
  palette: p,
}: Props) {
  return (
    <View className='flex-row items-center px-4 py-3.5' style={{ gap: 14 }}>
      <View
        className='items-center justify-center'
        style={{
          backgroundColor: p.avatarBg,
          borderColor: p.avatarBorderColor,
          borderWidth: p.avatarBorderWidth,
          borderRadius: borderRadius.full,
          height: avatarSize,
          width: avatarSize,
        }}
      >
        <Text
          style={{
            color: p.avatarTextColor,
            fontSize: Math.round(avatarSize * 0.42),
            fontWeight: fontWeights.bold,
          }}
        >
          {initial}
        </Text>
      </View>
      <View className='flex-1'>
        <View className='flex-row items-center' style={{ gap: 6 }}>
          <Text
            style={{
              ...typography.bodySmall,
              fontSize: nameSize,
              fontWeight: fontWeights.bold,
              color: p.textColor,
            }}
          >
            {name}
          </Text>
          {isPremium ? (
            <View
              className='flex-row items-center rounded-md px-1.5 py-0.5'
              style={{ backgroundColor: p.badgeBg, gap: 3 }}
            >
              <Crown color={p.badgeFg} size={iconSizes.micro} />
              <Text style={{ ...typography.tabBar, fontWeight: fontWeights.bold, color: p.badgeFg }}>
                PRO
              </Text>
            </View>
          ) : null}
        </View>
        {email ? (
          <Text
            className='mt-0.5'
            numberOfLines={1}
            style={{ ...typography.caption, color: p.subColor }}
          >
            {email}
          </Text>
        ) : null}
      </View>
      <ChevronRight color={p.chevronColor} size={iconSizes.medium} />
    </View>
  );
}
