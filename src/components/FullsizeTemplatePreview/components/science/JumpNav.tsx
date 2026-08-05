/**
 * Sticky-style unit chips for jumping between science drill-down sections —
 * active chip tracks scroll position (see useJumpNav).
 */

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { jumpNavStyles as s } from '../../styles/scienceJumpNav.styles';
import type { JumpNavItem } from './jumpNavItems';

interface JumpNavProps {
  items: readonly JumpNavItem[];
  activeKey: string;
  accentColor: string;
  onPress: (key: string) => void;
}

export function JumpNav({ items, activeKey, accentColor, onPress }: JumpNavProps) {
  if (items.length < 2) return null;
  return (
    <View style={s.wrap}>
      <ScrollView
        horizontal
        contentContainerStyle={s.row}
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              accessibilityRole='button'
              accessibilityState={{ selected: active }}
              style={[
                s.chip,
                active ? { backgroundColor: accentColor, borderColor: accentColor } : null,
              ]}
              onPress={() => onPress(item.key)}
            >
              <Text style={[s.chipText, active ? s.chipTextActive : null]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
