/** SettingsContent - Settings layout: Account → Appearance → Behavior → Notifications → Support → About */
import { View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useAccountActions } from './useAccountActions';
import { handleManageSubscription } from './sections/PremiumStatus.helpers';
import { FeedbackModal } from '../FeedbackModal';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SettingsContentProps } from './types';
import { SCROLL_STYLES } from './SettingsContent.constants';
import { SettingsSectionList } from './components/SettingsSectionList';

const useSectionIconColor = () => {
  const { settings } = useThemeColors();
  // Uniform soft-green brand tint for every section glyph (#047857 / #34D399).
  return settings.user.icon;
};

export function SettingsContent(p: SettingsContentProps) {
  const { colors: themeColors } = useThemeColors();
  const sectionIconColor = useSectionIconColor();
  const bottomPadding = Math.max((p.bottomInset ?? 0) + 16, 24);
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  const borderStyle = useAnimatedStyle(() => ({
    opacity: scrollY.value > 4 ? 1 : 0,
  }));

  const actions = useAccountActions();

  return (
    <View style={SCROLL_STYLES.wrapper}>
      <Animated.View
        style={[
          { height: 1, backgroundColor: themeColors.border },
          borderStyle,
        ]}
      />
      <Animated.ScrollView
        className='flex-1 px-4'
        contentContainerStyle={{ paddingBottom: bottomPadding, paddingTop: 4 }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: themeColors.background }}
        onScroll={scrollHandler}
      >
        <View className='gap-5'>
          <SettingsSectionList
            {...p}
            sectionIconColor={sectionIconColor}
            isDeletingAccount={actions.isDeletingAccount}
            isSigningOut={actions.isSigningOut}
            onDeleteAccount={actions.handleDeleteAccount}
            onFeedback={actions.handleFeedback}
            onManageSubscription={handleManageSubscription}
            onPrivacy={actions.openPrivacy}
            onRate={actions.handleRateApp}
            onShare={actions.handleShare}
            onSignOut={actions.handleSignOut}
            onTerms={actions.openTerms}
            onWhatsNew={actions.handleWhatsNew}
          />
        </View>
      </Animated.ScrollView>
      <FeedbackModal
        visible={actions.showFeedbackModal}
        onClose={actions.closeFeedback}
      />
    </View>
  );
}
