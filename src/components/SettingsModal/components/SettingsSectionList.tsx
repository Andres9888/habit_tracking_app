/** Scrollable section list for SettingsContent */
import { SettingsPrimarySections } from './SettingsPrimarySections';
import { SettingsSecondarySections } from './SettingsSecondarySections';
import type { SettingsContentProps } from '../SettingsContent.types';

interface SettingsSectionListProps extends SettingsContentProps {
  sectionIconColor: string;
  onFeedback: () => void;
  onLoveChainDay: () => void;
  onWhatsNew: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onDeleteAccount: () => void;
  isDeletingAccount: boolean;
}

export function SettingsSectionList(p: SettingsSectionListProps) {
  return (
    <>
      <SettingsPrimarySections {...p} sectionIconColor={p.sectionIconColor} />
      <SettingsSecondarySections
        isPremium={p.isPremium}
        sectionIconColor={p.sectionIconColor}
        onFeedback={p.onFeedback}
        onLoveChainDay={p.onLoveChainDay}
        onPremiumUpsell={p.onPremiumUpsell}
        onPrivacy={p.onPrivacy}
        onTerms={p.onTerms}
        onWhatsNew={p.onWhatsNew}
      />
    </>
  );
}
