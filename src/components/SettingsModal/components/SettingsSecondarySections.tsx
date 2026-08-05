/** Lower settings: Support card + quiet About footer (Privacy/Terms/Version) */
import Constants from 'expo-constants';
import { useReducedMotion } from 'react-native-reanimated';
import { AboutFooter, HelpAndAboutSection } from '../sections';
import { SectionEnter } from './SectionEnter';

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
  const reduceMotion = useReducedMotion();

  return (
    <>
      <SectionEnter index={6} reduceMotion={reduceMotion}>
        <HelpAndAboutSection
          sectionIconColor={p.sectionIconColor}
          onFeedback={p.onFeedback}
          onRate={p.onRate}
          onShare={p.onShare}
          onWhatsNew={p.onWhatsNew}
        />
      </SectionEnter>
      <SectionEnter index={7} reduceMotion={reduceMotion}>
        <AboutFooter
          buildNumber={Constants.expoConfig?.ios?.buildNumber ?? '1'}
          version={Constants.expoConfig?.version ?? '1.0.0'}
          onPrivacy={p.onPrivacy}
          onTerms={p.onTerms}
        />
      </SectionEnter>
    </>
  );
}
