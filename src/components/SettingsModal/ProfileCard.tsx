/** ProfileCard — User identity anchor at top of settings */
import { Text, View } from 'react-native';
import { ChevronRight, Crown } from 'lucide-react-native';
import { useUser } from '@clerk/clerk-expo';
import { useThemeColors } from '../../theme/ThemeContext';

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

  const cardBg = highContrastMode ? '#111111' : themeColors.card;
  const borderColor = highContrastMode ? '#2f2f2f' : undefined;

  return (
    <View
      className='overflow-hidden rounded-2xl'
      style={{
        backgroundColor: cardBg,
        borderColor,
        borderWidth: highContrastMode ? 1 : 0,
        elevation: highContrastMode ? 0 : 3,
        shadowColor: isDark ? '#000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: highContrastMode ? 0 : 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='flex-row items-center px-4 py-4' style={{ gap: 14 }}>
        <View
          className='items-center justify-center'
          style={{
            backgroundColor: '#7c3aed',
            borderRadius: 26,
            height: 52,
            width: 52,
          }}
        >
          <Text className='text-[22px] font-bold text-white'>{initial}</Text>
        </View>
        <View className='flex-1'>
          <Text
            className='text-[18px] font-bold'
            style={{ color: themeColors.text.primary }}
          >
            {name}
          </Text>
          {email ? (
            <Text
              className='mt-0.5 text-[13px]'
              style={{ color: themeColors.text.secondary }}
            >
              {email}
            </Text>
          ) : null}
          {isPremium ? (
            <View
              className='mt-1.5 flex-row items-center self-start rounded-md px-2 py-0.5'
              style={{ backgroundColor: isDark ? '#3d2e06' : '#fef3c7', gap: 4 }}
            >
              <Crown color={isDark ? '#fbbf24' : '#92400e'} size={11} />
              <Text
                className='text-[11px] font-bold'
                style={{ color: isDark ? '#fbbf24' : '#92400e' }}
              >
                PRO
              </Text>
            </View>
          ) : null}
        </View>
        <ChevronRight color={themeColors.text.secondary} size={18} />
      </View>
    </View>
  );
}
