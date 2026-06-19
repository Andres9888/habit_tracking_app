/** SettingsContent - Account header → search → grouped sections */
import { useRef } from 'react';
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
import { SCROLL_STYLES, sectionEnterAnim } from './SettingsContent.constants';
import { SettingsSectionList } from './components/SettingsSectionList';
import { AccountHeaderCard } from './AccountHeaderCard';
import { SettingsSearchField } from './search/SettingsSearchField';
import { SettingsSearchResults } from './search/SettingsSearchResults';
import { useSettingsSearch } from './search/useSettingsSearch';

const useSectionIconColor = () => {
  const { settings } = useThemeColors();
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
  // Animated.ScrollView exposes scrollTo; typed to the shape useSettingsSearch expects.
  const scrollRef = useRef<{
    scrollTo: (o: { y: number; animated: boolean }) => void;
  } | null>(null);
  const search = useSettingsSearch(scrollRef);

  return (
    <View style={SCROLL_STYLES.wrapper}>
      <Animated.View
        style={[
          { height: 1, backgroundColor: themeColors.border },
          borderStyle,
        ]}
      />
      <Animated.ScrollView
        ref={scrollRef as any}
        className='flex-1 px-4'
        contentContainerStyle={{ paddingBottom: bottomPadding, paddingTop: 4 }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: themeColors.background }}
        onScroll={scrollHandler}
      >
        <View className='gap-5'>
          <Animated.View entering={sectionEnterAnim(0)}>
            <AccountHeaderCard
              isPremium={p.isPremium}
              isSigningOut={actions.isSigningOut}
              onManageSubscription={handleManageSubscription}
              onOpenAccount={p.onOpenAccount}
              onSignOut={actions.handleSignOut}
            />
          </Animated.View>
          <SettingsSearchField
            value={search.query}
            onChangeText={search.setQuery}
          />
          {search.query.trim().length > 0 ? (
            <SettingsSearchResults
              results={search.results}
              onPickGroup={search.jumpToGroup}
            />
          ) : (
            <SettingsSectionList
              {...p}
              sectionIconColor={sectionIconColor}
              isDeletingAccount={actions.isDeletingAccount}
              onDeleteAccount={actions.handleDeleteAccount}
              onFeedback={actions.handleFeedback}
              onPrivacy={actions.openPrivacy}
              onRate={actions.handleRateApp}
              onSectionLayout={search.registerSection}
              onShare={actions.handleShare}
              onTerms={actions.openTerms}
              onWhatsNew={actions.handleWhatsNew}
            />
          )}
        </View>
      </Animated.ScrollView>
      <FeedbackModal
        visible={actions.showFeedbackModal}
        onClose={actions.closeFeedback}
      />
    </View>
  );
}
