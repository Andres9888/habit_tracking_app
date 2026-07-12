/** Flat emerald "Edit ›" pill — press feedback comes from the parent row. */
import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { fontWeights, typography } from '@/theme/typography';
import { useAdvancedTokens } from './useAdvancedTokens';

export function AdvancedOptionEditAffordance() {
  const t = useAdvancedTokens();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minHeight: 36,
        paddingLeft: 14,
        paddingRight: 10,
        borderRadius: 999,
        backgroundColor: t.accentTile,
      }}
    >
      <Text
        style={{
          ...typography.caption,
          fontWeight: fontWeights.bold,
          color: t.accentText,
          letterSpacing: 0.2,
        }}
      >
        Edit
      </Text>
      <ChevronRight color={t.accentText} size={14} strokeWidth={2.5} />
    </View>
  );
}
