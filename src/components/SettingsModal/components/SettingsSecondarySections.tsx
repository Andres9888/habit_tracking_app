/** Lower settings sections: support and about (static labels) */
import { Heart, Info } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Constants from 'expo-constants';
import Animated from 'react-native-reanimated';
import { AppActions, AboutLegalSection } from '../sections';
import { sectionEnterAnim } from '../SettingsContent.constants';

interface SecondarySectionsProps {
  highContrastMode: boolean;
  sectionIconColor: string;
  onFeedback: () => void;
  onRate: () => void;
  onShare: () => void;
  onWhatsNew: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function SettingsSecondarySections(p: SecondarySectionsProps) {
  const iconSize = iconSizes.small;

  return (
    <>
      <Animated.View entering={sectionEnterAnim(4)}>
        <AppActions
          highContrast={p.highContrastMode}
          icon={<Heart color={p.sectionIconColor} size={iconSize} />}
          onFeedback={p.onFeedback}
          onRate={p.onRate}
          onShare={p.onShare}
          onWhatsNew={p.onWhatsNew}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(5)}>
        <AboutLegalSection
          buildNumber={Constants.expoConfig?.ios?.buildNumber ?? '1'}
          highContrast={p.highContrastMode}
          icon={<Info color={p.sectionIconColor} size={iconSize} />}
          version={Constants.expoConfig?.version ?? '1.0.0'}
          onPrivacy={p.onPrivacy}
          onTerms={p.onTerms}
        />
      </Animated.View>
    </>
  );
}
