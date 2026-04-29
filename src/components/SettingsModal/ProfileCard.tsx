/** ProfileCard — User identity anchor at top of settings */
import { Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ProfileCardProps {
  isPremium: boolean;
  highContrastMode: boolean;
}

export function ProfileCard({ isPremium, highContrastMode }: ProfileCardProps) {
  const { user } = useUser();
  const { colors: themeColors, isDark } = useThemeColors();

  const name = user?.firstName ?? user?.username ?? 'User';
  const email = user?.primaryEmailAddress?.emailAddress;
  const initial = name.charAt(0).toUpperCase();

  const cardBg = highContrastMode ? (isDark ? themeColors.gray[900] : themeColors.text.primary) : themeColors.card;
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
      <View className='flex-row items-center px-4 py-4' style={{ gap: spacing.md }}>
        {highContrastMode ? (
          <View
            className='items-center justify-center'
            style={{
              backgroundColor: themeColors.text.primary,
              borderRadius: borderRadius.full,
              height: 52,
              width: 52,
            }}
          >
            <Text className='text-2xl font-bold' style={{ color: themeColors.text.inverse }}>
              {initial}
            </Text>
          </View>
        ) : (
          <LinearGradient
            colors={[themeColors.primary[700], themeColors.primary[600]]}
            style={{
              alignItems: 'center',
              borderRadius: borderRadius.full,
              height: 52,
              justifyContent: 'center',
              width: 52,
            }}
          >
            <Text className='text-2xl font-bold text-white'>{initial}</Text>
          </LinearGradient>
        )}
        <View className='flex-1'>
          <Text
            style={{ ...typography.heading3, color: themeColors.text.primary }}
          >
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
              className='mt-1.5 flex-row items-center self-start rounded-lg px-2 py-0.5'
              style={{ backgroundColor: themeColors.status.warningLight, gap: 4 }}
            >
              <Crown color={themeColors.status.warningText} size={iconSizes.micro} />
              <Text
                className='text-xs font-bold'
                style={{ color: themeColors.status.warningText }}
              >
                PRO
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
