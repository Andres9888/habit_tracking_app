/** ProfileCard — User identity anchor at top of account page */
import { Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useUser } from '@clerk/clerk-expo';
import { useThemeColors } from '../../theme/ThemeContext';
import { shadows, spacing } from '../../theme/spacing';
import { typography, fontWeights } from '../../theme/typography';
import { ProfileStatsRow } from './ProfileStatsRow';
import { UserAvatar } from './UserAvatar';
import { useProfileStats } from './useProfileStats';

interface ProfileCardProps {
  isPremium: boolean;
  highContrastMode: boolean;
}

export function ProfileCard({ isPremium, highContrastMode }: ProfileCardProps) {
  const { user } = useUser();
  const { colors: themeColors } = useThemeColors();
  const stats = useProfileStats();

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'User';
  const email = user?.primaryEmailAddress?.emailAddress;
  const initial = name.charAt(0).toUpperCase();

  const cardBg = highContrastMode ? themeColors.card : themeColors.card;
  const cardBorder = highContrastMode ? themeColors.border : undefined;

  return (
    <View
      className='overflow-hidden rounded-2xl'
      style={{
        backgroundColor: cardBg,
        borderColor: cardBorder,
        borderWidth: highContrastMode ? 1 : 0,
        ...(highContrastMode
          ? { elevation: 0, shadowColor: 'transparent' }
          : shadows.card),
      }}
    >
      <View className='items-center px-4 pb-1 pt-5' style={{ gap: spacing.md }}>
        <UserAvatar
          imageUrl={user?.imageUrl}
          initial={initial}
          palette={{
            avatarBg: themeColors.primary[100],
            avatarBorderColor: themeColors.border,
            avatarBorderWidth: highContrastMode ? 1 : 0,
            avatarTextColor: themeColors.text.inverse,
            gradientColors: [themeColors.primary[700], themeColors.primary[600]],
          }}
          size={72}
          useGradient={!highContrastMode}
        />
        <View className='items-center'>
          <Text style={{ ...typography.heading3, color: themeColors.text.primary }}>
            {name}
          </Text>
          {email ? (
            <Text
              className='mt-0.5'
              style={{ ...typography.caption, color: themeColors.text.secondary }}
            >
              {email}
            </Text>
          ) : null}
          {isPremium ? (
            <View
              className='mt-1.5 flex-row items-center rounded-lg px-2 py-0.5'
              style={{ backgroundColor: themeColors.status.warningLight, gap: 4 }}
            >
              <Crown color={themeColors.status.warningText} size={iconSizes.micro} />
              <Text
                className='text-xs font-bold'
                style={{ color: themeColors.status.warningText, fontWeight: fontWeights.bold }}
              >
                PRO
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <ProfileStatsRow stats={stats} />
    </View>
  );
}
