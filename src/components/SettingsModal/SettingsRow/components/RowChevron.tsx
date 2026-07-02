import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

export function RowChevron({ color }: { color: string }) {
  return <ChevronRight color={color} size={iconSizes.small} strokeWidth={2} />;
}
