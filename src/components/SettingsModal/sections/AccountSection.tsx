/** AccountSection — Profile row + Sign Out in one card */
import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useUser } from '@clerk/clerk-expo';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { SettingsSection } from '../SettingsSection';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrastMode: boolean;
  isSigningOut: boolean;
  onSignOut: () => void;
}

export function AccountSection({
  highContrastMode,
  isSigningOut,
  onSignOut,
}: Props) {
  const { user } = useUser();
  const { colors: themeColors, isDark } = useThemeColors();

  const name = user?.firstName ?? user?.username ?? 'User';
  const email = user?.primaryEmailAddress?.emailAddress;
  const initial = name.charAt(0).toUpperCase();

  return (
    <SettingsSection highContrastMode={highContrastMode} title='Account'>
      {/* Profile row */}
      <View className='flex-row items-center px-4 py-3.5' style={{ gap: 12 }}>
        <View
          className='items-center justify-center'
          style={{
            backgroundColor: '#7c3aed',
            borderRadius: 22,
            height: 44,
            width: 44,
          }}
        >
          <Text className='text-[18px] font-bold text-white'>{initial}</Text>
        </View>
        <View className='flex-1'>
          <Text
            className='text-[16px] font-semibold'
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
        </View>
        <ChevronRight color={themeColors.text.secondary} size={16} />
      </View>

      {/* Divider */}
      <View
        style={{
          height: 0.5,
          backgroundColor: highContrastMode ? '#2f2f2f' : (isDark ? '#333' : '#e7e5e4'),
          marginHorizontal: 14,
        }}
      />

      {/* Sign Out */}
      <AnimatedPressable
        accessibilityLabel='Sign Out'
        accessibilityRole='button'
        onPress={onSignOut}
      >
        <View className='items-center py-3.5'>
          <Text
            className='text-[15px] font-semibold'
            style={{ color: '#ef4444' }}
          >
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </Text>
        </View>
      </AnimatedPressable>
    </SettingsSection>
  );
}
