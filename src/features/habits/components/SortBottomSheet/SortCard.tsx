import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '@/theme/typography';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { CARD_ICON_SIZE, CARD_ICON_STROKE_WIDTH, ICON_ON_GRADIENT_COLOR } from './constants';
import { DirectionToggle } from './DirectionToggle';
import type { SortCardConfig } from './types';
import type { HabitSortMode } from '../../types';

interface SortCardProps {
  card: SortCardConfig;
  sortMode: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

export function SortCard({ card, sortMode, onSelect }: SortCardProps) {
  const { colors } = useThemeColors();
  const { trigger } = useHaptics();

  const isSelected = sortMode === card.mode || sortMode === card.altMode;
  const isAsc = sortMode === card.mode;
  const hasToggle = card.altMode !== undefined;

  const handlePress = (mode: HabitSortMode) => {
    trigger('tap');
    onSelect(mode);
  };

  return (
    <Pressable
      accessibilityLabel={card.label}
      accessibilityRole='radio'
      accessibilityState={{ checked: isSelected }}
      style={{
        backgroundColor: isSelected ? colors.status.successLight : colors.card,
        borderColor: isSelected ? colors.primary[300] : 'transparent',
        borderRadius: 16,
        borderWidth: 1.5,
        gap: 8,
        padding: 12,
      }}
      onPress={() => handlePress(isAsc ? card.mode : card.altMode ?? card.mode)}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        <LinearGradient
          colors={card.iconBgColors}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{ alignItems: 'center', borderRadius: 8, height: 32, justifyContent: 'center', width: 32 }}
        >
          <card.Icon color={ICON_ON_GRADIENT_COLOR} size={CARD_ICON_SIZE} strokeWidth={CARD_ICON_STROKE_WIDTH} />
        </LinearGradient>
        {isSelected && (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.primary[500],
              borderRadius: 9999,
              height: 20,
              justifyContent: 'center',
              width: 20,
            }}
          >
            <Check color={ICON_ON_GRADIENT_COLOR} size={12} strokeWidth={2.5} />
          </View>
        )}
      </View>

      <Text style={[typography.bodySmall, { color: colors.text.primary, fontWeight: '600' }]}>
        {card.label}
      </Text>

      {hasToggle ? (
        <DirectionToggle
          ascLabel={card.ascLabel!}
          descLabel={card.descLabel!}
          isAsc={isAsc || !isSelected}
          onSelectAsc={() => handlePress(card.mode)}
          onSelectDesc={() => handlePress(card.altMode!)}
        />
      ) : (
        <Text style={[typography.caption, { color: colors.text.secondary, fontWeight: '400' }]}>
          {card.description}
        </Text>
      )}
    </Pressable>
  );
}
