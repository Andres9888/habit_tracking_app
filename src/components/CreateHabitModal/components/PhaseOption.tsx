import { Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';
import type { HubermanPhase } from '../../../constants/hubermanPhases';
import { HUBERMAN_PHASES } from '../../../constants/hubermanPhases';
import { AnimatedPressable } from '../../ui';

interface PhaseOptionProps {
  phaseId: HubermanPhase;
  isSelected: boolean;
  onPress: (phaseId: HubermanPhase) => void;
}

export const PhaseOption = ({
  phaseId,
  isSelected,
  onPress,
}: PhaseOptionProps) => {
  const { colors: themeColors } = useThemeColors();
  const phase = HUBERMAN_PHASES[phaseId];

  return (
    <AnimatedPressable
      accessibilityLabel={`Select ${phase.label}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-row items-center rounded-xl border-2 px-3 py-3'
      style={{
        backgroundColor: isSelected ? colors.secondary[100] : themeColors.gray[50],
        borderColor: isSelected ? colors.secondary[500] : 'transparent',
      }}
      onPress={() => onPress(phaseId)}
    >
      <Text className='mr-2 text-lg'>{phase.icon}</Text>
      <View className='flex-1'>
        <View className='flex-row items-center'>
          <Text
            className='text-sm font-semibold'
            style={{
              color: isSelected ? colors.secondary[500] : themeColors.text.primary,
            }}
          >
            {phase.shortLabel}
          </Text>
          <Text className='ml-2 text-xs' style={{ color: themeColors.text.secondary }}>{phase.timeRange}</Text>
        </View>
        <Text className='mt-0.5 text-xs' style={{ color: themeColors.text.secondary }}>
          {phase.description}
        </Text>
      </View>
      {isSelected && (
        <View
          className='h-5 w-5 items-center justify-center rounded-full'
          style={{ backgroundColor: colors.secondary[500] }}
        >
          <Text className='text-xs' style={{ color: themeColors.text.inverse }}>✓</Text>
        </View>
      )}
    </AnimatedPressable>
  );
};
