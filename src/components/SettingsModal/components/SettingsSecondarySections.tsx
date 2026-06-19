/** Lower settings section: About & Support (static labels) */
import Constants from 'expo-constants';
import Animated from 'react-native-reanimated';
import { AboutSupportSection } from '../sections';
import { sectionEnterAnim } from '../SettingsContent.constants';
import type { SettingsGroup } from '../search/settingsSearchRegistry';

interface SecondarySectionsProps {
  sectionIconColor: string;
  onFeedback: () => void;
  onRate: () => void;
  onShare: () => void;
  onWhatsNew: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onSectionLayout?: (group: SettingsGroup, y: number) => void;
}

export function SettingsSecondarySections(p: SecondarySectionsProps) {
  return (
    <Animated.View
      entering={sectionEnterAnim(4)}
      onLayout={(e) =>
        p.onSectionLayout?.('About & Support', e.nativeEvent.layout.y)
      }
    >
      <AboutSupportSection
        buildNumber={Constants.expoConfig?.ios?.buildNumber ?? '1'}
        sectionIconColor={p.sectionIconColor}
        version={Constants.expoConfig?.version ?? '1.0.0'}
        onFeedback={p.onFeedback}
        onPrivacy={p.onPrivacy}
        onRate={p.onRate}
        onShare={p.onShare}
        onTerms={p.onTerms}
        onWhatsNew={p.onWhatsNew}
      />
    </Animated.View>
  );
}
