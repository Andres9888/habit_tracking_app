/** AccountPage — Sub-page: profile hero, premium, account actions, danger zone */
import Constants from 'expo-constants';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { DeleteAccountSheet } from '../DeleteAccountSheet';
import { typography } from '../../theme/typography';
import { ScreenHeader } from '../ScreenHeader';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { AccountSection } from './AccountSection';
import { ProfileCard } from './ProfileCard';
import { PremiumStatus } from './sections';
import { AccountActionsCard } from './sections/AccountActionsCard';
import { AccountDangerCard } from './sections/AccountDangerCard';
import { useAccountActions } from './useAccountActions';
import { useThemeColors } from '../../theme/ThemeContext';

interface AccountPageProps {
  isPremium: boolean;
  onBack: () => void;
  onClose: () => void;
  onPremiumUpsell?: () => void;
  onExportHabitsData?: () => void | Promise<void>;
}

export function AccountPage({
  isPremium,
  onBack,
  onClose,
  onPremiumUpsell,
  onExportHabitsData,
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
            <AccountActionsCard />
          </AccountSection>
          <AccountSection index={2} reduceMotion={reduceMotion}>
            <PremiumStatus isPremium={isPremium} onUpgrade={onPremiumUpsell} />
          </AccountSection>
          <AccountSection index={3} reduceMotion={reduceMotion}>
            <AccountDangerCard
              isDeletingAccount={actions.isDeletingAccount}
              isSigningOut={actions.isSigningOut}
              onDeleteAccount={actions.handleDeleteAccount}
              onSignOut={actions.handleSignOut}
            />
          </AccountSection>
          <Text
            className='pt-1 text-center'
            style={{ ...typography.caption, color: themeColors.text.tertiary }}
          >
            Chain Day · Version {Constants.expoConfig?.version ?? '1.0.0'} (
            {Constants.expoConfig?.ios?.buildNumber ?? '1'})
          </Text>
        </View>
      </Animated.ScrollView>
      <DeleteAccountSheet
        acknowledged={actions.deleteAcknowledged}
        isDeleting={actions.isDeletingAccount}
        visible={actions.isDeleteSheetOpen}
        onCancel={actions.closeDeleteSheet}
        onConfirm={actions.confirmDeleteAccount}
        onExportHabitsData={onExportHabitsData}
        onToggleAcknowledged={actions.setDeleteAcknowledged}
      />
    </View>
  );
}
