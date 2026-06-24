/** Scrollable section list for SettingsContent */
import { SettingsPrimarySections } from './SettingsPrimarySections';
import { SettingsSecondarySections } from './SettingsSecondarySections';
import type { SettingsContentProps } from '../SettingsContent.types';

interface SettingsSectionListProps extends SettingsContentProps {
  sectionIconColor: string;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onFeedback: () => void;
  onRate: () => void;
  onShare: () => void;
  onWhatsNew: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onDeleteAccount: () => void;
  isDeletingAccount: boolean;
}

export function SettingsSectionList(p: SettingsSectionListProps) {
  return (
    <>
      <SettingsPrimarySections
        {...p}
        searchQuery={p.searchQuery}
        sectionIconColor={p.sectionIconColor}
        onChangeSearchQuery={p.onChangeSearchQuery}
      />
      <SettingsSecondarySections
        sectionIconColor={p.sectionIconColor}
        onFeedback={p.onFeedback}
        onPrivacy={p.onPrivacy}
        onRate={p.onRate}
        onShare={p.onShare}
        onTerms={p.onTerms}
        onWhatsNew={p.onWhatsNew}
      />
    </>
  );
}
