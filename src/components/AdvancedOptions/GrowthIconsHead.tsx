/** Title row for inline Growth Icons — accent icon tile. */
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import { advancedRowSpec, advancedRowTextInset } from './advancedRowSpec';
import { useAdvancedTokens } from './useAdvancedTokens';

export function GrowthIconsHead({ starting }: { starting: string }) {
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
            backgroundColor: t.accentTile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18 }}>{starting}</Text>
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
          marginLeft: advancedRowTextInset,
          marginBottom: 10,
        }}
      >
        How your habit’s strength looks as it grows.
      </Text>
    </>
  );
}
