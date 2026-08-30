import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

interface RowChevronProps {
  color: string;
  /** Disclosure state for rows that expand IN PLACE. Omit for navigation rows.
   *  A right-chevron is the platform sign for "pushes a new screen"; rows that
   *  open a tray below themselves get a down-chevron that flips when open. */
  expanded?: boolean;
}

export function RowChevron({ color, expanded }: RowChevronProps) {
  if (expanded === undefined) {
    return <ChevronRight color={color} size={iconSizes.small} strokeWidth={2} />;
  }

  const Icon = expanded ? ChevronDown : ChevronRight;
  return <Icon color={color} size={iconSizes.small} strokeWidth={2} />;
}
