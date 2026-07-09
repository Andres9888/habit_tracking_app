/**
 * CalendarLookMiniPreview — glanceable strip of mini day cells on the
 * "Calendar look" settings row, reflecting the current day shape, tier fill
 * progression, and streak-connection setting. Reads settings directly (same
 * cached entry as GrowthIconsSettingsRow) so no props need threading.
 */
import { View } from 'react-native';

import { getMaterialTier } from '../HabitChainVisualizer/materialTier';
import { resolveTierColor } from '../../hooks/useAnimatedTier';
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSettingsRowColors } from './SettingsRow';

/** Mirrors CalendarPreviewWeek's strength ramp, plus one rest day. */
const CELL_STRENGTHS = [35, 55, 75, 92, null] as const;

const CELL_SIZE = 12;
const CONNECTOR_WIDTH = 3;

export function CalendarLookMiniPreview() {
  const { colors, isDark } = useThemeColors();
  const settings = useCachedQuery(
    api.settings.get,
    {},
    { entryName: 'settings.get' }
  );
  const dayShape = settings?.dayShape ?? 'square';
  const showConnections = settings?.showStreakConnections ?? true;
  const accent = colors.primary[500];
  const emptyBorder = getSettingsRowColors(isDark).border;
  const radius = dayShape === 'circle' ? CELL_SIZE / 2 : 3.5;

  return (
    <View
      accessibilityElementsHidden
      className='flex-row items-center'
      importantForAccessibility='no-hide-descendants'
      pointerEvents='none'
    >
      {CELL_STRENGTHS.map((strength, i) => {
        const completed = strength !== null;
        const nextCompleted = CELL_STRENGTHS[i + 1] != null;
        return (
          <View key={i} className='flex-row items-center'>
            <View
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius: radius,
                backgroundColor: completed
                  ? resolveTierColor(getMaterialTier(strength), accent)
                  : 'transparent',
                borderWidth: completed ? 0 : 1.5,
                borderColor: emptyBorder,
              }}
            />
            {i < CELL_STRENGTHS.length - 1 ? (
              <View
                style={{
                  width: CONNECTOR_WIDTH,
                  height: 2,
                  backgroundColor:
                    showConnections && completed && nextCompleted
                      ? accent
                      : 'transparent',
                }}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
