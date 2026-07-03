import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useSettingsScale } from '../../useSettingsScale';

export function RowChevron({ color }: { color: string }) {
  const k = useSettingsScale();
  return <ChevronRight color={color} size={k(iconSizes.small)} strokeWidth={2} />;
}
