import { Pressable, Text, View } from 'react-native';
import { typography } from '@/theme/typography';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface DirectionToggleProps {
  ascLabel: string;
  descLabel: string;
  isAsc: boolean;
  onSelectAsc: () => void;
  onSelectDesc: () => void;
}

/** Inline asc/desc toggle for sort cards */
export function DirectionToggle({ ascLabel, descLabel, isAsc, onSelectAsc, onSelectDesc }: DirectionToggleProps) {
  const { colors } = useThemeColors();
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      <ToggleBtn active={isAsc} label={ascLabel} onPress={onSelectAsc} />
      <ToggleBtn active={!isAsc} label={descLabel} onPress={onSelectDesc} />
    </View>
  );
}

function ToggleBtn({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  const { colors } = useThemeColors();
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ selected: active }}
      style={{
        alignItems: 'center',
        backgroundColor: active ? colors.primary[600] : colors.gray[50],
        borderColor: active ? colors.primary[600] : colors.border,
        borderRadius: 6,
        borderWidth: 1,
        flex: 1,
        paddingVertical: 5,
      }}
      onPress={onPress}
    >
      <Text style={[typography.caption, { color: active ? '#FFFFFF' : colors.text.secondary, fontSize: 11 }]}>
        {label}
      </Text>
    </Pressable>
  );
}
