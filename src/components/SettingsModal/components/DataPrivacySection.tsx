/** DataPrivacySection — Quiet Configuration Index §5: archive + export.
 *  Moved out of Habits so data lifecycle controls live in one place. */
import { ShieldCheck } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { HabitDataRows } from './HabitDataRows';

interface DataPrivacySectionProps {
  sectionIconColor: string;
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: () => void | Promise<void>;
}

export function DataPrivacySection(p: DataPrivacySectionProps) {
  return (
    <SettingsSection
      icon={<ShieldCheck color={p.sectionIconColor} size={iconSizes.small} />}
      title='Data & Privacy'
    >
      <HabitDataRows
        archivedHabitsCount={p.archivedHabitsCount}
        onExportHabitsData={p.onExportHabitsData}
        onOpenArchivedHabits={p.onOpenArchivedHabits}
      />
    </SettingsSection>
  );
}
