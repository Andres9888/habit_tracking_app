/** SettingsContent - Settings layout: Profile → Look & Feel → Habits → Reminders → Data & Privacy → About & Support */
import { View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useAccountActions } from './useAccountActions';
import { FeedbackModal } from '../FeedbackModal';
import { airy } from '../../theme/airyScale';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SettingsContentProps } from './types';
import { SCROLL_STYLES } from './SettingsContent.constants';
import { SettingsSectionList } from './components/SettingsSectionList';
// Search field temporarily removed — filter plumbing retained (see SPEC_03).
import { SettingsSearchProvider } from './search';

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
        keyboardShouldPersistTaps='handled'
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: themeColors.background }}
        onScroll={scrollHandler}
      >
        <SettingsSearchProvider query=''>
          <View style={{ gap: airy.sectionGap }}>
            <SettingsSectionList
              {...p}
              sectionIconColor={sectionIconColor}
              isDeletingAccount={actions.isDeletingAccount}
              onDeleteAccount={actions.handleDeleteAccount}
              onFeedback={actions.handleFeedback}
              onPrivacy={actions.openPrivacy}
              onRate={actions.handleRateApp}
              onShare={actions.handleShare}
              onTerms={actions.openTerms}
              onWhatsNew={actions.handleWhatsNew}
            />
          </View>
        </SettingsSearchProvider>
      </Animated.ScrollView>
      <FeedbackModal
        visible={actions.showFeedbackModal}
        onClose={actions.closeFeedback}
      />
    </View>
  );
}
