/** Title row for inline Growth Icons — accent icon tile. */
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import { sectionHeadTile, sectionHeadTileStyle } from './sectionHeadTile';
import { useAdvancedTokens } from './useAdvancedTokens';

export function GrowthIconsHead({ starting }: { starting: string }) {
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
          <Text style={{ fontSize: 16 }}>{starting}</Text>
        </View>
        <Text
          style={{
            ...typography.body,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
            color: t.fg,
          }}
        >
          Growth Icons
        </Text>
      </View>
      <Text
        style={{
          ...typography.caption,
          color: t.meta,
          marginLeft: sectionHeadTile.inset,
          marginBottom: 10,
        }}
      >
        How your habit’s strength looks as it grows.
      </Text>
    </>
  );
}
