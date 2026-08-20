/** Lower settings, spec 4a: premium banner → Support card → one-line footer */
import Constants from 'expo-constants';
import Animated from 'react-native-reanimated';
import { AboutFooter, AboutSupportSection, ProSettingsCard } from '../sections';
import { sectionEnterAnim } from '../SettingsContent.constants';
import { sectionHasMatch, useSettingsSearch } from '../search';

interface SecondarySectionsProps {
  sectionIconColor: string;
  isPremium: boolean;
  onFeedback: () => void;
  onLoveChainDay: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onWhatsNew: () => void;
  onPremiumUpsell?: () => void;
}

export function SettingsSecondarySections(p: SecondarySectionsProps) {
  const { query, isSearching } = useSettingsSearch();

  return (
    <>
      {isSearching ? null : (
        <Animated.View entering={sectionEnterAnim(5)}>
          <ProSettingsCard
            isPremium={p.isPremium}
            onUpgrade={p.onPremiumUpsell}
          />
        </Animated.View>
      )}
      {sectionHasMatch(query, 'support') ? (
        <Animated.View entering={isSearching ? undefined : sectionEnterAnim(6)}>
          <AboutSupportSection
            sectionIconColor={p.sectionIconColor}
            onFeedback={p.onFeedback}
            onLoveChainDay={p.onLoveChainDay}
          />
        </Animated.View>
      ) : null}
      {isSearching ? null : (
        <Animated.View entering={sectionEnterAnim(7)}>
          <AboutFooter
            buildNumber={Constants.expoConfig?.ios?.buildNumber ?? '1'}
            version={Constants.expoConfig?.version ?? '1.0.0'}
            onPrivacy={p.onPrivacy}
            onTerms={p.onTerms}
            onWhatsNew={p.onWhatsNew}
          />
        </Animated.View>
      )}
    </>
  );
}
