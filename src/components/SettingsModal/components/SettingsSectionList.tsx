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
        archivedHabitsCount={p.archivedHabitsCount}
        sectionIconColor={p.sectionIconColor}
        onExportHabitsData={p.onExportHabitsData}
        onFeedback={p.onFeedback}
        onLoveChainDay={p.onLoveChainDay}
        onOpenArchivedHabits={p.onOpenArchivedHabits}
        onPrivacy={p.onPrivacy}
        onTerms={p.onTerms}
        onWhatsNew={p.onWhatsNew}
      />
    </>
  );
}
