/** SettingsContent - Settings layout: Profile → Look & Feel → Reminders → Habits → Premium → Support */
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
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
import { SettingsScrollProvider } from './SettingsScrollContext';
import { useEnsureVisible } from './useEnsureVisible';
import { SettingsToastProvider } from './SettingsToast';
// No search field — filter plumbing retained so rows/sections can self-filter
// if a search entry point ever returns.
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
  // Fade the hairline in across the first 12px of travel. A hard 0→1 flip at
  // 4px reads as a flicker on the small scrolls that rubber-band back to top.
  const borderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, 12],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  const actions = useAccountActions();
  const { ensureVisible, onScrollViewLayout, scrollRef } =
    useEnsureVisible(scrollY);

  return (
    <SettingsToastProvider>
      <View style={SCROLL_STYLES.wrapper}>
        <Animated.View
          style={[
            { height: 1, backgroundColor: themeColors.border },
            borderStyle,
          ]}
        />
        <Animated.ScrollView
          ref={scrollRef}
          className='flex-1 px-4'
          contentContainerStyle={{
            paddingBottom: bottomPadding,
            paddingTop: 4,
          }}
          keyboardShouldPersistTaps='handled'
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: themeColors.background }}
          onLayout={onScrollViewLayout}
          onScroll={scrollHandler}
        >
          <SettingsSearchProvider query=''>
            <SettingsScrollProvider ensureVisible={ensureVisible}>
              <View style={{ gap: airy.sectionGap }}>
                <SettingsSectionList
                  {...p}
                  sectionIconColor={sectionIconColor}
                  onFeedback={actions.handleFeedback}
                  onPrivacy={actions.openPrivacy}
                  onRate={actions.handleRateApp}
                  onShare={actions.handleShare}
                  onTerms={actions.openTerms}
                  onWhatsNew={actions.handleWhatsNew}
                />
              </View>
            </SettingsScrollProvider>
          </SettingsSearchProvider>
        </Animated.ScrollView>
        <FeedbackModal
          visible={actions.showFeedbackModal}
          onClose={actions.closeFeedback}
        />
      </View>
    </SettingsToastProvider>
  );
}
