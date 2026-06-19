/** SettingsSearchResults — list of matched settings entries with group breadcrumbs */
import { ScrollView, Text, View } from 'react-native';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { SettingsEntry, SettingsGroup } from './settingsSearchRegistry';

interface SettingsSearchResultsProps {
  results: SettingsEntry[];
  onPickGroup: (g: SettingsGroup) => void;
}

export function SettingsSearchResults({
  results,
  onPickGroup,
}: SettingsSearchResultsProps) {
  const { colors } = useThemeColors();

  if (results.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40 }}>
        <Text
          style={{
            ...typography.body,
            color: colors.text.secondary,
          }}
        >
          No settings match your search.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
    >
      {results.map((entry, index) => {
        const isLast = index === results.length - 1;
        return (
          <AnimatedPressable
            key={entry.id}
            accessibilityLabel={`${entry.label}, ${entry.group}`}
            accessibilityRole='button'
            onPress={() => onPickGroup(entry.group)}
          >
            <View
              style={{
                backgroundColor: colors.card,
                paddingHorizontal: 16,
                paddingVertical: 13,
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: colors.border,
              }}
            >
              <Text
                style={{
                  ...typography.body,
                  fontWeight: fontWeights.semibold,
                  color: colors.text.primary,
                }}
              >
                {entry.label}
              </Text>
              <Text
                style={{
                  ...typography.caption,
                  color: colors.text.secondary,
                  marginTop: 2,
                }}
              >
                {entry.group}
              </Text>
            </View>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}
