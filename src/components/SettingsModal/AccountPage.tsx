/** AccountPage — Sub-page: profile hero, premium, account actions, danger zone */
import Constants from 'expo-constants';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { typography } from '../../theme/typography';
import { ScreenHeader } from '../ScreenHeader';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { ProfileCard } from './ProfileCard';
import { PremiumStatus } from './sections';
import { AccountActionsCard } from './sections/AccountActionsCard';
import { AccountDangerCard } from './sections/AccountDangerCard';
import { SignOutCard } from './sections/SignOutCard';
import { useAccountActions } from './useAccountActions';
import { useThemeColors } from '../../theme/ThemeContext';

interface AccountPageProps {
  isPremium: boolean;
  onBack: () => void;
  onClose: () => void;
  onPremiumUpsell?: () => void;
}

export function AccountPage({
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
          <ProfileCard isPremium={isPremium} />
          <PremiumStatus isPremium={isPremium} onUpgrade={onPremiumUpsell} />
          <AccountActionsCard />
          <SignOutCard
            isSigningOut={actions.isSigningOut}
            onSignOut={actions.handleSignOut}
          />
        </View>
        {/* Deliberate dead space: deleting an account should require leaving
            the rest of the page behind, not sit one row under Sign out. */}
        <View style={{ marginTop: 56 }}>
          <AccountDangerCard
            isDeletingAccount={actions.isDeletingAccount}
            needsIdentityCleanup={actions.needsIdentityCleanup}
            onDeleteAccount={actions.handleDeleteAccount}
          />
        </View>
        <Text
          selectable
          className='pt-6 text-center'
          style={{ ...typography.caption, color: themeColors.text.tertiary }}
        >
          Chain Day · Version {Constants.expoConfig?.version ?? '1.0.0'} (
          {Constants.expoConfig?.ios?.buildNumber ?? '1'})
        </Text>
      </Animated.ScrollView>
    </View>
  );
}
