/** Lower settings, Quiet Configuration Index order:
 *  Data & Privacy (archive + export) → Help & About → one-line footer.
 *  Conversion surfaces stay off this screen for now — see
 *  docs/settings-conversion-surfaces.md before adding one back. */
import Animated from 'react-native-reanimated';
import { AboutSupportSection } from '../sections';
import { AppVersionFooter } from './AppVersionFooter';
import { DataPrivacySection } from './DataPrivacySection';
import { sectionEnterAnim } from '../SettingsContent.constants';

interface SecondarySectionsProps {
  sectionIconColor: string;
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: () => void | Promise<void>;
  onFeedback: () => void;
  onLoveChainDay: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onWhatsNew: () => void;
}

export function SettingsSecondarySections(p: SecondarySectionsProps) {
  return (
    <>
      <Animated.View entering={sectionEnterAnim(4)}>
        <DataPrivacySection
          archivedHabitsCount={p.archivedHabitsCount}
          sectionIconColor={p.sectionIconColor}
          onExportHabitsData={p.onExportHabitsData}
          onOpenArchivedHabits={p.onOpenArchivedHabits}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(5)}>
        <AboutSupportSection
          sectionIconColor={p.sectionIconColor}
          onFeedback={p.onFeedback}
          onLoveChainDay={p.onLoveChainDay}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(6)}>
        <AppVersionFooter
          onPrivacy={p.onPrivacy}
          onTerms={p.onTerms}
          onWhatsNew={p.onWhatsNew}
        />
      </Animated.View>
    </>
  );
}
