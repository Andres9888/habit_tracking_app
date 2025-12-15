import { Text, TouchableOpacity, View } from 'react-native';
import {
  type HubermanPhase,
  HUBERMAN_PHASES,
  PHASE_ORDER,
} from '../../../constants/hubermanPhases';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface PhaseSelectorProps {
  selectedPhase: HubermanPhase | null;
  onSelect: (phase: HubermanPhase | null) => void;
}

export const PhaseSelector = ({ selectedPhase, onSelect }: PhaseSelectorProps) => {
  const { triggerSelection } = useHapticFeedback();

  const handlePhasePress = (phase: HubermanPhase) => {
    triggerSelection();
    // Toggle off if already selected
    onSelect(selectedPhase === phase ? null : phase);
  };

  return (
    <View className='mb-6 rounded-2xl border-2 border-[#8B5CF6]/20 bg-gradient-to-r p-4' style={{ backgroundColor: '#FAFAFF' }}>
      <View className='mb-2 flex-row items-center'>
        <Text className='text-lg'>🧠</Text>
        <Text className='ml-2 text-base font-bold text-[#1a1a1a]'>
          Huberman Day Phase
        </Text>
        <View className='ml-2 rounded-full bg-[#8B5CF6]/10 px-2 py-0.5'>
          <Text className='text-[10px] font-semibold text-[#8B5CF6]'>SCIENCE-BACKED</Text>
        </View>
      </View>
      <Text className='mb-4 text-[12px] text-[#64748b]'>
        Match your habit to optimal times based on circadian biology
      </Text>

      <View className='gap-2'>
        {PHASE_ORDER.map((phaseId) => {
          const phase = HUBERMAN_PHASES[phaseId];
          const isSelected = selectedPhase === phaseId;

          return (
            <TouchableOpacity
              key={phaseId}
              accessibilityLabel={`Select ${phase.label}`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              className={`flex-row items-center rounded-xl border-2 px-3 py-3 ${
                isSelected
                  ? 'border-[#3B82F6] bg-[#EFF6FF]'
                  : 'border-transparent bg-[#F5F5F5]'
              }`}
              onPress={() => handlePhasePress(phaseId)}
            >
              <Text className='mr-2 text-lg'>{phase.icon}</Text>
              <View className='flex-1'>
                <View className='flex-row items-center'>
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-[#3B82F6]' : 'text-[#1a1a1a]'
                    }`}
                  >
                    {phase.shortLabel}
                  </Text>
                  <Text className='ml-2 text-xs text-[#64748b]'>
                    {phase.timeRange}
                  </Text>
                </View>
                <Text className='mt-0.5 text-xs text-[#64748b]'>
                  {phase.description}
                </Text>
              </View>
              {isSelected && (
                <View className='h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6]'>
                  <Text className='text-xs text-white'>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedPhase && (
        <View className='mt-3 rounded-lg bg-[#F0FDF4] p-3'>
          <Text className='text-xs font-medium text-[#166534]'>
            Best for: {HUBERMAN_PHASES[selectedPhase].activities.slice(0, 3).join(', ')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PhaseSelector;
