/** Lower settings, spec 4a: premium banner → Support card → one-line footer */
import Constants from 'expo-constants';
import Animated from 'react-native-reanimated';
import {
  AboutFooter,
  AboutSupportSection,
  ProSettingsCard,
  usePremiumBannerVisible,
} from '../sections';
import { sectionEnterAnim } from '../SettingsContent.constants';
import { sectionHasMatch, useSettingsSearch } from '../search';

interface SecondarySectionsProps {
  sectionIconColor: string;
  isPremium: boolean;
  onFeedback: () => void;
  onRate: () => void;
  onShare: () => void;
  onWhatsNew: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onPremiumUpsell?: () => void;
}

/** Primary sections occupy 0-3 (hero, Look & Feel, Reminders, Habits). */
const SECONDARY_START_INDEX = 4;

export function SettingsSecondarySections(p: SecondarySectionsProps) {
  const { query, isSearching } = useSettingsSearch();
  const showBanner = usePremiumBannerVisible(p.isPremium);

  // Indexes used to be hardcoded 5/6/7 — one slot past the primary block, and
  // frozen whether or not the banner rendered. Premium users paid a delay for a
  // card they never see, and the whole tail arrived late.
  let index = SECONDARY_START_INDEX;
  const nextIndex = () => index++;
  const bannerIndex = showBanner && !isSearching ? nextIndex() : null;
  const supportIndex = nextIndex();
  const footerIndex = isSearching ? null : nextIndex();

  return (
    <>
      {/* Spec 4a puts the one dark card near the bottom, above the footer. */}
      {bannerIndex === null ? null : (
        <Animated.View entering={sectionEnterAnim(bannerIndex)}>
          <ProSettingsCard
            isPremium={p.isPremium}
            onUpgrade={p.onPremiumUpsell}
          />
        </Animated.View>
      )}
      {sectionHasMatch(query, 'support') ? (
        <Animated.View
          entering={isSearching ? undefined : sectionEnterAnim(supportIndex)}
        >
          <AboutSupportSection
            sectionIconColor={p.sectionIconColor}
            onFeedback={p.onFeedback}
            onRate={p.onRate}
            onShare={p.onShare}
            onWhatsNew={p.onWhatsNew}
          />
        </Animated.View>
      ) : null}
      {/* About footer hidden during search to keep results tight */}
      {footerIndex === null ? null : (
        <Animated.View entering={sectionEnterAnim(footerIndex)}>
          <AboutFooter
            buildNumber={Constants.expoConfig?.ios?.buildNumber ?? '1'}
            version={Constants.expoConfig?.version ?? '1.0.0'}
            onPrivacy={p.onPrivacy}
            onTerms={p.onTerms}
          />
        </Animated.View>
      )}
    </>
  );
}
