import { Pressable, Text, TextInput, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';

const QUICK_PICKS = [15, 30, 45, 60];

interface LogTimeSheetBodyProps {
  value: string;
  onChangeValue: (v: string) => void;
  onQuickPick: (mins: number) => void;
}

export function LogTimeSheetBody({
  value,
  onChangeValue,
  onQuickPick,
}: LogTimeSheetBodyProps) {
  const { colors } = useThemeColors();

  return (
    <>
      <View className='mb-3 flex-row items-center justify-center' style={{ gap: 8 }}>
        <TextInput
          className='rounded-xl px-4 py-3 text-center'
          keyboardType='number-pad'
          maxLength={4}
          placeholder='0'
          placeholderTextColor={colors.text.tertiary}
          style={{
            backgroundColor: colors.surface,
            color: colors.text.primary,
            fontSize: 28,
            fontWeight: fontWeights.semibold,
            minWidth: 120,
          }}
          value={value}
          onChangeText={onChangeValue}
        />
        <Text style={{ ...typography.body, color: colors.text.secondary }}>minutes</Text>
      </View>
      <View className='mb-5 flex-row justify-center' style={{ gap: 8 }}>
        {QUICK_PICKS.map((mins) => (
          <Pressable
            key={mins}
            accessibilityRole='button'
            className='rounded-full px-4 py-2'
            style={{ backgroundColor: colors.surface }}
            onPress={() => onQuickPick(mins)}
          >
            <Text style={{ ...typography.bodySmall, color: colors.text.primary, fontWeight: fontWeights.semibold }}>
              {mins}m
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
