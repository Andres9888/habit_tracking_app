/** DataAboutSection — export, advocacy and feedback in one closing card.
 *  Merges the old Data & Privacy and Help & About sections; the changelog
 *  stays in the footer. */
import { Download, Heart, MessageSquare } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { useThemeColors } from '../../../theme/ThemeContext';

interface DataAboutSectionProps {
  onExportHabitsData?: () => void | Promise<void>;
  onLoveChainDay: () => void;
  onFeedback: () => void;
}

export function DataAboutSection(p: DataAboutSectionProps) {
  const { settings } = useThemeColors();
  const iconSize = iconSizes.small;

  // No toast here: the downstream flow asks the user to pick CSV or JSON and
  // can be cancelled — claiming "Export started…" before any of that is a lie.
  const handleExport = () => {
    if (!p.onExportHabitsData) return;
    void p.onExportHabitsData();
  };

  return (
    <SettingsSection title='Data & about'>
      <SettingsRow
        icon={<Download color={settings.export.icon} size={iconSize} />}
        iconBackgroundColor={settings.export.bg}
        label='Export my data'
        subtitle='CSV or JSON'
        type='navigation'
        onPress={handleExport}
      />
      <SettingsRow
        icon={<Heart color={settings.star.icon} size={iconSize} />}
        iconBackgroundColor={settings.star.bg}
        label='Love Chain Day?'
        subtitle='Rate it or share with a friend'
        type='navigation'
        onPress={p.onLoveChainDay}
      />
      <SettingsRow
        icon={<MessageSquare color={settings.feedback.icon} size={iconSize} />}
        iconBackgroundColor={settings.feedback.bg}
        label='Send feedback'
        type='navigation'
        onPress={p.onFeedback}
      />
    </SettingsSection>
  );
}
