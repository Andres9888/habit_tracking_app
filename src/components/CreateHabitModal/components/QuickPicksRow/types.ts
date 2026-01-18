import type { HubermanPhase } from '../../../../constants/hubermanPhases';

export interface QuickPickTemplate {
  id: string;
  name: string;
  emoji: string;
  color: string;
  timeOfDay: HubermanPhase;
}

export interface QuickPickCardProps {
  template: QuickPickTemplate;
  isSelected: boolean;
  onPress: () => void;
}

export interface QuickPicksRowProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (template: QuickPickTemplate) => void;
  onBrowseAll?: () => void;
}
