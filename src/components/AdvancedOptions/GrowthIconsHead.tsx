/** Title row for inline Growth Icons — accent icon tile. */
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import { useAdvancedTokens } from './useAdvancedTokens';

export function GrowthIconsHead({ starting }: { starting: string }) {
  const t = useAdvancedTokens();
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            backgroundColor: t.accentTile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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
          marginLeft: 42,
          marginBottom: 10,
        }}
      >
        How your habit’s strength looks as it grows.
      </Text>
    </>
  );
}
