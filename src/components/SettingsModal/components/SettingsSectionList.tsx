/** Scrollable section list for SettingsContent */
import { SettingsPrimarySections } from './SettingsPrimarySections';
import { SettingsSecondarySections } from './SettingsSecondarySections';
import type { SettingsContentProps } from '../SettingsContent.types';
import type { SettingsGroup } from '../search/settingsSearchRegistry';

interface SettingsSectionListProps extends SettingsContentProps {
  sectionIconColor: string;
  onFeedback: () => void;
  onRate: () => void;
  onShare: () => void;
  onWhatsNew: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onDeleteAccount: () => void;
  isDeletingAccount: boolean;
  onSectionLayout?: (group: SettingsGroup, y: number) => void;
}

export function SettingsSectionList(p: SettingsSectionListProps) {
  return (
    <>
      <SettingsPrimarySections
        {...p}
        sectionIconColor={p.sectionIconColor}
        onSectionLayout={p.onSectionLayout}
      />
      <SettingsSecondarySections
        sectionIconColor={p.sectionIconColor}
        onFeedback={p.onFeedback}
        onPrivacy={p.onPrivacy}
        onRate={p.onRate}
        onShare={p.onShare}
        onTerms={p.onTerms}
        onWhatsNew={p.onWhatsNew}
        onSectionLayout={p.onSectionLayout}
      />
    </>
  );
}
