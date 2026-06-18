/** DetailHeroStats - Streak / best / total housed in a soft inset band. */
import { StyleSheet, Text, View } from 'react-native';
import { StatColumn, StatHairline } from '../../../components/ui';
import { useThemeColors } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { DetailHeroStatValue } from './DetailHeroStatValue';

interface DetailHeroStatsProps {
  bestStreak: number;
  currentStreak: number;
  totalCompletions: number;
}

export function DetailHeroStats({
  bestStreak,
  currentStreak,
  totalCompletions,
}: DetailHeroStatsProps) {
  const { colors } = useThemeColors();
  const labelColor = colors.text.secondary;

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderRadius: borderRadius.large,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        marginTop: spacing.lg,
        paddingVertical: spacing.base,
        width: '100%',
      }}
    >
      <View className='flex-1 items-center'>
        <DetailHeroStatValue value={currentStreak} />
        <Text
          style={{
            ...typography.caption,
            color: labelColor,
            fontSize: typography.overline.fontSize,
            marginTop: 2,
          }}
        >
          streak
        </Text>
      </View>
      <StatHairline />
      <StatColumn label='best' labelColor={labelColor} value={bestStreak} />
      <StatHairline />
      <StatColumn label='total' labelColor={labelColor} value={totalCompletions} />
    </View>
  );
}
