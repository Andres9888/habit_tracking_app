/** CompletionIconSettingsRow — Appearance row hosting the chain/checkbox picker */
import { Check, Link2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { CompletionIconPicker } from './CompletionIconPicker';
import { SettingsRow } from './SettingsRow';
import { useThemeColors } from '../../theme/ThemeContext';

type CompletionIcon = 'chain' | 'checkbox';

interface Props {
  selected: CompletionIcon;
  onSelect: (icon: CompletionIcon) => void | Promise<void>;
}

export function CompletionIconSettingsRow({ selected, onSelect }: Props) {
  const { settings } = useThemeColors();
  const iconSize = iconSizes.small;

  return (
    <SettingsRow
      icon={
        selected === 'checkbox' ? (
          <Check color={settings.checkbox.icon} size={iconSize} />
        ) : (
          <Link2 color={settings.checkbox.icon} size={iconSize} />
        )
      }
      iconBackgroundColor={settings.checkbox.bg}
      label='Completion icon'
      rightAccessory={
        <CompletionIconPicker
          selected={selected}
          onSelect={(v) => void onSelect(v)}
        />
      }
      type='info'
    />
  );
}
