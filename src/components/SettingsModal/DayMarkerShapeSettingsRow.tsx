/** DayMarkerShapeSettingsRow — Appearance row hosting the circle/square picker */
import { Circle, Square } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { DayShapePicker } from './DayShapePicker';
import { SettingsRow } from './SettingsRow';
import { useThemeColors } from '../../theme/ThemeContext';

type DayShape = 'circle' | 'square';

interface Props {
  selected: DayShape;
  onSelect: (shape: DayShape) => void | Promise<void>;
}

export function DayMarkerShapeSettingsRow({ selected, onSelect }: Props) {
  const { settings } = useThemeColors();
  const iconSize = iconSizes.small;

  return (
    <SettingsRow
      icon={
        selected === 'circle' ? (
          <Circle color={settings.dayMarker.icon} size={iconSize} />
        ) : (
          <Square color={settings.dayMarker.icon} size={iconSize} />
        )
      }
      iconBackgroundColor={settings.dayMarker.bg}
      label='Day marker shape'
      rightAccessory={
        <DayShapePicker
          selected={selected}
          onSelect={(v) => void onSelect(v)}
        />
      }
      type='info'
    />
  );
}
