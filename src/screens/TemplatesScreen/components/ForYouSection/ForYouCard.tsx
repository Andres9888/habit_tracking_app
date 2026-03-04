/**
 * ForYouCard — individual recommendation card with connection cue and add button.
 *
 * Horizontal layout: emoji icon | text column | circular add button.
 * Connection cue uses green-highlighted lead phrase for Mere Exposure effect.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { AddButton } from '../TrendingCard/AddButton';
import type { ForYouCardProps } from './ForYouSection.types';

const ICON_SIZE = 44;
const ADD_BUTTON_SIZE = 38;

export function ForYouCard({
  connectionCue,
  cueHighlight,
  icon,
  iconColor,
  isImported,
  isImporting,
  name,
  onImport,
  onPress,
}: ForYouCardProps) {
  const highlightIndex = connectionCue.indexOf(cueHighlight);
  const before = highlightIndex > 0 ? connectionCue.slice(0, highlightIndex) : '';
  const after = connectionCue.slice(highlightIndex + cueHighlight.length);

  return (
    <Pressable accessibilityRole='button' style={s.card} onPress={onPress}>
      <View style={[s.iconBox, { backgroundColor: `${iconColor}1A` }]}>
        <Text style={s.iconEmoji}>{icon}</Text>
      </View>
      <View style={s.textColumn}>
        <Text numberOfLines={1} style={s.name}>{name}</Text>
        <Text numberOfLines={2} style={s.cue}>
          {before ? <Text>{before}</Text> : null}
          <Text style={s.cueHighlight}>{cueHighlight}</Text>
          <Text>{after}</Text>
        </Text>
      </View>
      <View style={s.addWrap}>
        <AddButton
          isImported={isImported}
          isImporting={isImporting}
          name={name}
          onImport={onImport}
        />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    ...shadows.subtle,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ede8df',
    borderRadius: borderRadius.large,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: ICON_SIZE,
    justifyContent: 'center',
    width: ICON_SIZE,
  },
  iconEmoji: { fontSize: 24 },
  textColumn: { flex: 1, gap: 2 },
  name: { color: colors.text.primary, fontSize: 14, fontWeight: '700' },
  cue: { color: colors.text.secondary, fontSize: 12, lineHeight: 16 },
  cueHighlight: { color: colors.primary[700], fontWeight: '600' },
  addWrap: { transform: [{ scale: ADD_BUTTON_SIZE / 44 }] },
});
