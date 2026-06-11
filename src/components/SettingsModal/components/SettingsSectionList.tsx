/** Scrollable section list for SettingsContent */
import { SettingsPrimarySections } from './SettingsPrimarySections';
import { SettingsSecondarySections } from './SettingsSecondarySections';
import { SECTION_IDS } from '../useSettingsSectionStates';
import type { SettingsContentProps } from '../SettingsContent.types';

interface SettingsSectionListProps extends SettingsContentProps {
  sectionIconColor: string;
  sectionStates: Record<
    (typeof SECTION_IDS)[keyof typeof SECTION_IDS],
    boolean
  >;
  toggleSection: (id: (typeof SECTION_IDS)[keyof typeof SECTION_IDS]) => void;
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
      <SettingsPrimarySections
        {...p}
        sectionIconColor={p.sectionIconColor}
        sectionStates={p.sectionStates}
        toggleSection={p.toggleSection}
      />
      <SettingsSecondarySections
        highContrastMode={p.isHighContrastActive}
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
