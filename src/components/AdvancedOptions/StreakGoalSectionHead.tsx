/** Title + description for inline Streak Goal. */
import { Text, View } from 'react-native';
import { Target } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { fontWeights, typography } from '@/theme/typography';
import { sectionHeadTile, sectionHeadTileStyle } from './sectionHeadTile';
import { useAdvancedTokens } from './useAdvancedTokens';

export function StreakGoalSectionHead() {
  const t = useAdvancedTokens();
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: sectionHeadTile.gap,
          marginBottom: 4,
        }}
      >
        <View style={sectionHeadTileStyle(t.accentTile)}>
          <Target
            color={t.accentTileIcon}
            size={iconSizes.small}
            strokeWidth={2}
          />
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
          marginLeft: sectionHeadTile.inset,
          marginBottom: 6,
        }}
      >
        A visual target with no penalty if you miss it.
      </Text>
    </>
  );
}
