
import { Text, TouchableOpacity, View } from 'react-native';

import type { HubermanPhase } from '../../../constants/hubermanPhases';
import { HUBERMAN_PHASES } from '../../../constants/hubermanPhases';
import { colors } from '@/theme/colors';

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
  const phase = HUBERMAN_PHASES[phaseId];

  return (
    <TouchableOpacity
      accessibilityLabel={`Select ${phase.label}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-row items-center rounded-xl border-2 px-3 py-3'
      style={{
        backgroundColor: isSelected ? '#EFF6FF' : '#F5F5F5',
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
              color: isSelected ? colors.secondary[500] : colors.text.primary,
            }}
          >
            {phase.shortLabel}
          </Text>
          <Text className='ml-2 text-xs text-stone-500'>{phase.timeRange}</Text>
        </View>
        <Text className='mt-0.5 text-xs text-stone-500'>
          {phase.description}
        </Text>
      </View>
      {isSelected && (
        <View
          className='h-5 w-5 items-center justify-center rounded-full'
          style={{ backgroundColor: colors.secondary[500] }}
        >
          <Text className='text-xs text-white'>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
