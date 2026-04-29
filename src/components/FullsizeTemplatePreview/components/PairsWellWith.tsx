/**
 * "Pairs well with" section for FullsizeTemplatePreview
 * Shows companion habit categories based on static pairings data
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { CATEGORY_PAIRINGS } from '../../../screens/TemplatesScreen/data/habitPairings';
import { getCategoryMeta } from '../../../screens/TemplatesScreen/data/categoryMeta';

interface PairsWellWithProps {
  category: string;
  onPairPress?: (category: string) => void;
}

export function PairsWellWith({ category, onPairPress }: PairsWellWithProps) {
  const { colors } = useThemeColors();
  const pairings = CATEGORY_PAIRINGS[category];

  if (!pairings || pairings.length === 0) return null;

  return (
    <View style={pairStyles.container}>
      <Text style={[pairStyles.title, { color: colors.text }]}>
        Pairs well with
      </Text>
      <View style={pairStyles.list}>
        {pairings.map((pairing) => {
          const meta = getCategoryMeta(pairing.targetCategory);
          return (
            <Pressable
              key={pairing.targetCategory}
              style={[pairStyles.card, { backgroundColor: colors.card }]}
              onPress={() => onPairPress?.(pairing.targetCategory)}
            >
              <View
                style={[
                  pairStyles.iconBox,
                  { backgroundColor: meta.bgColor },
                ]}
              >
                <Text style={pairStyles.iconText}>{meta.icon}</Text>
              </View>
              <View style={pairStyles.cardText}>
                <Text
                  style={[pairStyles.cardTitle, { color: colors.text }]}
                >
                  {meta.label}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[
                    pairStyles.cardReason,
                    { color: colors.textSecondary },
                  ]}
                >
                  {pairing.reason}
                </Text>
              </View>
              <ChevronRight
                color={colors.textSecondary}
                size={iconSizes.small}
                strokeWidth={2}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const pairStyles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  cardReason: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
    lineHeight: 15,
  },
  cardText: { flex: 1, gap: 2 },
  cardTitle: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
  container: {
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  iconText: { fontSize: 20 },
  list: { gap: 8 },
  title: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 15,
    fontWeight: fontWeights.bold,
  },
});
