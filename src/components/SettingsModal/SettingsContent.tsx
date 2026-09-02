/** SettingsContent — Account → Appearance → Habits → Data & about */
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
import { SettingsSections } from './components/SettingsSections';
import { SettingsToastProvider } from './SettingsToast';

export function SettingsContent(p: SettingsContentProps) {
  const { colors: themeColors } = useThemeColors();
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
    <SettingsToastProvider>
      <View style={SCROLL_STYLES.wrapper}>
        <Animated.View
          style={[
            { height: 1, backgroundColor: themeColors.border },
            borderStyle,
          ]}
        />
        <Animated.ScrollView
          className='flex-1'
          contentContainerStyle={{
            paddingBottom: bottomPadding,
            paddingTop: 4,
          }}
          keyboardShouldPersistTaps='handled'
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          // One gutter for the whole screen. The header sat at 20, the scroll
          // container at 16 and section labels at 24 (px-2 inside px-4), so
          // nothing on the page shared a left edge.
          style={{
            backgroundColor: themeColors.background,
            paddingHorizontal: airy.screenPadH,
          }}
          onScroll={scrollHandler}
        >
          <View style={{ gap: airy.sectionGap }}>
            <SettingsSections
              {...p}
              onFeedback={actions.handleFeedback}
              onLoveChainDay={actions.handleLoveChainDay}
              onPrivacy={actions.openPrivacy}
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
    </SettingsToastProvider>
  );
}
