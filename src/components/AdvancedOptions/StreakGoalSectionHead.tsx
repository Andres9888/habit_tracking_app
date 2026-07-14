/** Title + description for inline Streak Goal. */
import { Text, View } from 'react-native';
import { Target } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { fontWeights, typography } from '@/theme/typography';
import { advancedRowSpec, advancedRowTextInset } from './advancedRowSpec';
import { useAdvancedTokens } from './useAdvancedTokens';

export function StreakGoalSectionHead() {
  const t = useAdvancedTokens();
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: advancedRowSpec.gap,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            width: advancedRowSpec.iconSize,
            height: advancedRowSpec.iconSize,
            borderRadius: advancedRowSpec.iconRadius,
            backgroundColor: t.tile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Target color={t.tileIcon} size={iconSizes.small} strokeWidth={2} />
        </View>
        <Text
          style={{
            ...typography.body,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
            color: t.fg,
          }}
        >
          Streak Goal
        </Text>
      </View>
      <Text
        style={{
          ...typography.caption,
          color: t.meta,
          marginLeft: advancedRowTextInset,
          marginBottom: 6,
        }}
      >
        A visual target with no penalty if you miss it.
      </Text>
    </>
  );
}
