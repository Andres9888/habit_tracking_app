/** Lower settings: Support card + quiet About footer (Privacy/Terms/Version) */
import Constants from 'expo-constants';
import Animated from 'react-native-reanimated';
import { AboutFooter, AboutSupportSection } from '../sections';
import { sectionEnterAnim } from '../SettingsContent.constants';
import { sectionHasMatch, useSettingsSearch } from '../search';

interface SecondarySectionsProps {
  sectionIconColor: string;
  onFeedback: () => void;
  onRate: () => void;
  onShare: () => void;
  onWhatsNew: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function SettingsSecondarySections(p: SecondarySectionsProps) {
  const { query, isSearching } = useSettingsSearch();

  return (
    <>
      {sectionHasMatch(query, 'support') ? (
        <Animated.View entering={isSearching ? undefined : sectionEnterAnim(6)}>
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
      {isSearching ? null : (
        <Animated.View entering={sectionEnterAnim(7)}>
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
