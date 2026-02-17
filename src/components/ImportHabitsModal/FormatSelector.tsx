/* FormatSelector - Choose CSV format (Streaks, Habitica, Generic) */
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import type { CSVFormat } from './csvParser';

export interface FormatSelectorProps {
  selected: CSVFormat;
  onSelect: (format: CSVFormat) => void;
}

const FORMATS: Array<{
  key: CSVFormat;
  label: string;
  description: string;
  columns: string;
}> = [
  {
    key: 'generic',
    label: 'Generic CSV',
    description: 'Any CSV with habit names and optional metadata',
    columns: 'name, frequency, icon, notes',
  },
  {
    key: 'streaks',
    label: 'Streaks',
    description: 'Export from Streaks app',
    columns: 'Task, Frequency, Icon, Color',
  },
  {
    key: 'habitica',
    label: 'Habitica',
    description: 'Export from Habitica',
    columns: 'habit, type, notes, tags',
  },
];

export function FormatSelector({ selected, onSelect }: FormatSelectorProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View className="gap-3">
      {FORMATS.map(({ key, label, description, columns }) => {
        const isSelected = selected === key;

        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            className="rounded-2xl p-4"
            style={{
              backgroundColor: isSelected
                ? isDark
                  ? '#065f46'
                  : '#d1fae5'
                : colors.card,
              borderWidth: 2,
              borderColor: isSelected ? colors.primary[600] : 'transparent',
            }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text
                  className="mb-1 text-[17px] font-semibold"
                  style={{
                    color: isSelected
                      ? isDark
                        ? '#34d399'
                        : '#047857'
                      : colors.text.primary,
                  }}
                >
                  {label}
                </Text>
                <Text
                  className="mb-2 text-[13px]"
                  style={{
                    color: isSelected
                      ? isDark
                        ? '#86efac'
                        : '#059669'
                      : colors.text.secondary,
                  }}
                >
                  {description}
                </Text>
                <Text
                  className="text-[12px] font-mono"
                  style={{
                    color: isSelected
                      ? isDark
                        ? '#86efac'
                        : '#059669'
                      : colors.text.tertiary,
                  }}
                >
                  {columns}
                </Text>
              </View>

              {isSelected && (
                <View
                  className="ml-3 h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.primary[600] }}
                >
                  <Check color="#fff" size={16} />
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
