/** Scrollable section list for SettingsContent */
import { SettingsPrimarySections } from './SettingsPrimarySections';
import { SettingsSecondarySections } from './SettingsSecondarySections';
import type { SettingsContentProps } from '../SettingsContent.types';

interface SettingsSectionListProps extends SettingsContentProps {
  sectionIconColor: string;
  onFeedback: () => void;
  onRate: () => void;
  onShare: () => void;
  onWhatsNew: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function SettingsSectionList(p: SettingsSectionListProps) {
  return (
    <>
      <SettingsPrimarySections {...p} sectionIconColor={p.sectionIconColor} />
      <SettingsSecondarySections
        isPremium={p.isPremium}
        sectionIconColor={p.sectionIconColor}
        onFeedback={p.onFeedback}
        onPremiumUpsell={p.onPremiumUpsell}
        onPrivacy={p.onPrivacy}
        onRate={p.onRate}
        onShare={p.onShare}
        onTerms={p.onTerms}
        onWhatsNew={p.onWhatsNew}
      />
    </>
  );
}
