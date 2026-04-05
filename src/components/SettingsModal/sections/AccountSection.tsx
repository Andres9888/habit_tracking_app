/** AccountSection — Profile row + Sign Out in one card */
import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
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
  const { colors: themeColors } = useThemeColors();

  const name = user?.firstName ?? user?.username ?? 'User';
  const email = user?.primaryEmailAddress?.emailAddress;
  const initial = name.charAt(0).toUpperCase();

  const handleSignOut = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSignOut();
  };

  return (
    <SettingsSection highContrastMode={highContrastMode} title='Account'>
      {/* Profile row */}
      <View
        className='flex-row items-center border-b px-4 py-4'
        style={{ borderColor: themeColors.border, gap: 12 }}
      >
        <View
          className='items-center justify-center'
          style={{
            backgroundColor: themeColors.status.premium,
            borderRadius: 22,
            height: 44,
            width: 44,
          }}
        >
          <Text className='text-[18px] font-bold text-white'>{initial}</Text>
        </View>
        <View className='flex-1'>
          <Text
            className='text-[17px] font-semibold'
            style={{ color: themeColors.text.primary }}
          >
            {name}
          </Text>
          {email ? (
            <Text
              className='mt-1 text-[13px]'
              style={{ color: themeColors.text.secondary }}
            >
              {email}
            </Text>
          ) : null}
        </View>
        <ChevronRight color={themeColors.text.secondary} size={16} />
      </View>

      {/* Sign Out */}
      <AnimatedPressable
        accessibilityLabel='Sign Out'
        accessibilityRole='button'
        onPress={handleSignOut}
      >
        <View className='items-center py-4'>
          <Text
            className='text-[15px] font-medium'
            style={{ color: themeColors.status.error }}
          >
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </Text>
        </View>
      </AnimatedPressable>
    </SettingsSection>
  );
}
