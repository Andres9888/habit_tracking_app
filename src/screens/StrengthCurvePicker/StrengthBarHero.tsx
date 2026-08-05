/** StrengthBarHero — V5 giant bar with milestones, animated fill. */
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useThemeColors } from '@/theme/ThemeContext';
import { View } from 'react-native';
import { useStrengthBarFill } from './StrengthBarHero.hooks';
import { StrengthBarMilestones } from './StrengthBarMilestones';
import { StrengthBarTrack } from './StrengthBarTrack';
import { MODE_STYLES } from './strengthCurveModeStyles';

export function StrengthBarHero({
  mode,
  scale = 1,
}: {
  mode: AlgorithmMode;
  scale?: number;
}) {
  const { colors, isDark } = useThemeColors();
  const accent = MODE_STYLES[mode].curveColor;
  const empty = isDark ? 'rgba(255,255,255,0.10)' : '#E8E5DD';
  const { fillStyle } = useStrengthBarFill(mode);

  return (
    <View
      className='mx-4 rounded-2xl'
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        marginTop: 8 * scale,
        padding: 16 * scale,
      }}
    >
      <StrengthBarMilestones mode={mode} accent={accent} scale={scale} />
      <StrengthBarTrack
        accent={accent}
        empty={empty}
        scale={scale}
        fillStyle={fillStyle}
      />
    </View>
  );
}
