/** AccountPage — Sub-page for profile, premium, sign out, and delete account */
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import { ScreenHeader } from '../ScreenHeader';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { ProfileCard } from './ProfileCard';
import { PremiumStatus, SignOutCard, DeleteAccountButton } from './sections';
import { useAccountActions } from './useAccountActions';
import { useThemeColors } from '../../theme/ThemeContext';

interface AccountPageProps {
  highContrastMode: boolean;
  isPremium: boolean;
  onBack: () => void;
  onClose: () => void;
  onPremiumUpsell?: () => void;
}

const anim = (index: number) => FadeInDown.delay(index * durations.stagger).springify().damping(18);

export function AccountPage({
  highContrastMode,
  isPremium,
  onBack,
  onClose,
  onPremiumUpsell,
}: AccountPageProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();
  const actions = useAccountActions();
  const bottomPadding = Math.max((insets.bottom ?? 0) + 16, 24);

  return (
    <View className='flex-1' style={{ backgroundColor: themeColors.background }}>
      <View style={{ backgroundColor: themeColors.background }}>
        <ScreenHeader
          leftAction='back'
          rightAction={<ModalCloseButton label='Close settings' onClose={onClose} />}
          title='Account'
          onBack={onBack}
        />
      </View>
      <Animated.ScrollView
        className='flex-1 px-4'
        contentContainerStyle={{ paddingBottom: bottomPadding, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
      >
        <View className='gap-5'>
          <Animated.View entering={anim(0)}>
            <ProfileCard highContrastMode={highContrastMode} isPremium={isPremium} />
          </Animated.View>
          <Animated.View entering={anim(1)}>
            <PremiumStatus highContrast={highContrastMode} isPremium={isPremium} onUpgrade={onPremiumUpsell} />
          </Animated.View>
          <Animated.View entering={anim(2)}>
            <SignOutCard highContrastMode={highContrastMode} isLoading={actions.isSigningOut} onSignOut={actions.handleSignOut} />
          </Animated.View>
          <Animated.View entering={anim(3)}>
            <DeleteAccountButton highContrastMode={highContrastMode} isDeletingAccount={actions.isDeletingAccount} onDeleteAccount={actions.handleDeleteAccount} />
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
