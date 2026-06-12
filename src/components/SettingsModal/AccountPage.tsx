/** AccountPage — Sub-page for profile, premium, sign out, and delete account */
import { View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { ScreenHeader } from '../ScreenHeader';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { ProfileCard } from './ProfileCard';
import { PremiumStatus, SignOutCard, DeleteAccountButton } from './sections';
import { useAccountActions } from './useAccountActions';
import { useThemeColors } from '../../theme/ThemeContext';

interface AccountPageProps {
  isPremium: boolean;
  onBack: () => void;
  onClose: () => void;
  onPremiumUpsell?: () => void;
}

const anim = (index: number) =>
  FadeInDown.delay(index * durations.stagger)
    .duration(durations.enter)
    .easing(enterEasing);

function AccountSection({
  index,
  reduceMotion,
  children,
}: {
  index: number;
  reduceMotion: boolean;
  children: ReactNode;
}) {
  if (reduceMotion) return children;
  return <Animated.View entering={anim(index)}>{children}</Animated.View>;
}

export function AccountPage({
  isPremium,
  onBack,
  onClose,
  onPremiumUpsell,
}: AccountPageProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { colors: themeColors } = useThemeColors();
  const actions = useAccountActions();
  const bottomPadding = Math.max((insets.bottom ?? 0) + 16, 24);

  return (
    <View
      className='flex-1'
      style={{ backgroundColor: themeColors.background }}
    >
      <View style={{ backgroundColor: themeColors.background }}>
        <ScreenHeader
          leftAction='back'
          rightAction={
            <ModalCloseButton label='Close settings' onClose={onClose} />
          }
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
          <AccountSection index={0} reduceMotion={reduceMotion}>
            <ProfileCard isPremium={isPremium} />
          </AccountSection>
          <AccountSection index={1} reduceMotion={reduceMotion}>
            <PremiumStatus isPremium={isPremium} onUpgrade={onPremiumUpsell} />
          </AccountSection>
          <AccountSection index={2} reduceMotion={reduceMotion}>
            <SignOutCard
              isLoading={actions.isSigningOut}
              onSignOut={actions.handleSignOut}
            />
          </AccountSection>
          <AccountSection index={3} reduceMotion={reduceMotion}>
            <DeleteAccountButton
              isDeletingAccount={actions.isDeletingAccount}
              onDeleteAccount={actions.handleDeleteAccount}
            />
          </AccountSection>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
