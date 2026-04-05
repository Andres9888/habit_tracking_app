/** AccountRow — Compact tappable card that opens the Account sub-page */
import { Text, View } from 'react-native';
import { ChevronRight, Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius, shadows } from '../../theme/spacing';

interface AccountRowProps {
  highContrastMode: boolean;
  isPremium: boolean;
  onPress: () => void;
}

export function AccountRow({ highContrastMode, isPremium, onPress }: AccountRowProps) {
  const { user } = useUser();
  const { colors: themeColors, isDark } = useThemeColors();

  const name = user?.firstName ?? user?.username ?? 'User';
  const email = user?.primaryEmailAddress?.emailAddress;
  const initial = name.charAt(0).toUpperCase();

  const cardBg = highContrastMode ? (isDark ? '#111111' : '#000000') : themeColors.card;
  const cardBorder = highContrastMode ? themeColors.border : undefined;

  return (
    <AnimatedPressable accessibilityLabel='Account settings' accessibilityRole='button' onPress={onPress}>
      <View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: cardBg,
          borderColor: cardBorder,
          borderWidth: highContrastMode ? 1 : 0,
          ...(highContrastMode ? { elevation: 0, shadowColor: 'transparent' } : shadows.card),
        }}
      >
        <View className='flex-row items-center px-4 py-3.5' style={{ gap: 14 }}>
          {highContrastMode ? (
            <View
              className='items-center justify-center'
              style={{ backgroundColor: themeColors.text.primary, borderRadius: borderRadius.full, height: 40, width: 40 }}
            >
              <Text className='text-[18px] font-bold' style={{ color: themeColors.text.inverse }}>{initial}</Text>
            </View>
          ) : (
            <LinearGradient
              colors={[themeColors.primary[700], themeColors.primary[600]]}
              style={{ alignItems: 'center', borderRadius: borderRadius.full, height: 40, justifyContent: 'center', width: 40 }}
            >
              <Text className='text-[18px] font-bold text-white'>{initial}</Text>
            </LinearGradient>
          )}
          <View className='flex-1'>
            <View className='flex-row items-center' style={{ gap: 6 }}>
              <Text className='text-[16px] font-semibold' style={{ color: themeColors.text.primary }}>{name}</Text>
              {isPremium ? (
                <View className='flex-row items-center rounded-md px-1.5 py-0.5' style={{ backgroundColor: themeColors.status.warningLight, gap: 3 }}>
                  <Crown color={themeColors.status.warningText} size={iconSizes.micro} />
                  <Text className='text-[10px] font-bold' style={{ color: themeColors.status.warningText }}>PRO</Text>
                </View>
              ) : null}
            </View>
            {email ? (
              <Text className='mt-0.5 text-[13px]' numberOfLines={1} style={{ color: themeColors.text.secondary }}>{email}</Text>
            ) : null}
          </View>
          <ChevronRight color={themeColors.text.tertiary} size={iconSizes.medium} />
        </View>
      </View>
    </AnimatedPressable>
  );
}
