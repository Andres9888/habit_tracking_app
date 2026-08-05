// src/components/SettingsModal/ConnectorStyleSettingsRow.tsx
/** ConnectorStyleSettingsRow — Appearance row hosting the connector-style picker */
import { Link2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { ConnectorStylePicker } from './ConnectorStylePicker';
import { SettingsRow } from './SettingsRow';
import { useThemeColors } from '../../theme/ThemeContext';
import type { ConnectorStyle } from '../../../convex/settings/types';

const CIRCLE_OPTIONS: readonly ConnectorStyle[] = ['none', 'full'];
const SQUARE_OPTIONS: readonly ConnectorStyle[] = ['none', 'small', 'full'];

interface Props {
  dayShape: 'circle' | 'square';
  selected: ConnectorStyle;
  onSelect: (style: ConnectorStyle) => void | Promise<void>;
}

export function ConnectorStyleSettingsRow({
  dayShape,
  selected,
  onSelect,
}: Props) {
  const { settings } = useThemeColors();
  const options = dayShape === 'circle' ? CIRCLE_OPTIONS : SQUARE_OPTIONS;

  return (
    <SettingsRow
      icon={<Link2 color={settings.checkbox.icon} size={iconSizes.small} />}
      iconBackgroundColor={settings.checkbox.bg}
      label='Connector'
      rightAccessory={
        <ConnectorStylePicker
          options={options}
          selected={options.includes(selected) ? selected : 'full'}
          onSelect={(v) => void onSelect(v)}
        />
      }
      type='info'
    />
  );
}
