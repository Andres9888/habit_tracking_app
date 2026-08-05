/** Per-mode visual palette for the Strength Curve picker. */
import { Mountain, Sprout, TrendingUp } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';

export interface ModeStyle {
  curveColor: string;
  curveTint: string;
  iconColor: string;
  iconTileBackground: string;
  tierPillBg: string;
  tierPillFg: string;
  Icon: LucideIcon;
}

export const MODE_STYLES: Record<AlgorithmMode, ModeStyle> = {
  forgiving: {
    curveColor: colors.tone.orange.text,
    curveTint: 'rgba(217,122,58,0.12)',
    iconColor: colors.tone.orange.text,
    iconTileBackground: colors.tone.orange.bg,
    tierPillBg: colors.tone.orange.bg,
    tierPillFg: colors.tone.orange.text,
    Icon: Sprout,
  },
  balanced: {
    curveColor: colors.primary[700],
    curveTint: 'rgba(15,138,106,0.10)',
    iconColor: colors.primary[700],
    iconTileBackground: colors.primary[100],
    tierPillBg: colors.primary[100],
    tierPillFg: colors.primary[700],
    Icon: TrendingUp,
  },
  strict: {
    curveColor: colors.premium[500],
    curveTint: 'rgba(133,99,199,0.12)',
    iconColor: colors.premium[600],
    iconTileBackground: '#EEE7FA',
    tierPillBg: '#EEE7FA',
    tierPillFg: colors.premium[700],
    Icon: Mountain,
  },
};
