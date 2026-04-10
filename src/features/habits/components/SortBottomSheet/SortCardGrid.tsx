import { View } from 'react-native';

import type { HabitSortMode } from '../../types';
import { SORT_CARDS } from './constants';
import { SortCard } from './SortCard';

interface SortCardGridProps {
  sortMode: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

/** 2×2 card grid for selecting sort mode with inline direction toggles */
export function SortCardGrid({ sortMode, onSelect }: SortCardGridProps) {
  return (
    <View style={{ gap: 8, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {SORT_CARDS.slice(0, 2).map((card) => (
          <View key={card.mode} style={{ flex: 1 }}>
            <SortCard card={card} sortMode={sortMode} onSelect={onSelect} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {SORT_CARDS.slice(2, 4).map((card) => (
          <View key={card.mode} style={{ flex: 1 }}>
            <SortCard card={card} sortMode={sortMode} onSelect={onSelect} />
          </View>
        ))}
      </View>
    </View>
  );
}
