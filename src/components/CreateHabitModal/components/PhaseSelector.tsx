import { Text, View } from 'react-native';
import {
  type HubermanPhase,
  HUBERMAN_PHASES,
  PHASE_ORDER,
} from '../../../constants/hubermanPhases';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { PhaseOption } from './PhaseOption';

interface PhaseSelectorProps {
  selectedPhase: HubermanPhase | null;
  onSelect: (phase: HubermanPhase | null) => void;
}

export const PhaseSelector = ({
  selectedPhase,
  onSelect,
}: PhaseSelectorProps) => {
  const { triggerSelection } = useHapticFeedback();

  const handlePhasePress = (phase: HubermanPhase) => {
    triggerSelection();
    onSelect(selectedPhase === phase ? null : phase);
  };

  return (
    <View
      className='mb-6 rounded-2xl border-2 border-[#8B5CF6]/20 bg-gradient-to-r p-4'
      style={{ backgroundColor: '#FAFAFF' }}
    >
      <View className='mb-2 flex-row items-center'>
        <Text className='text-lg'>🧠</Text>
        <Text className='ml-2 text-base font-bold text-stone-800'>
          Huberman Day Phase
        </Text>
        <View className='ml-2 rounded-full bg-[#8B5CF6]/10 px-2 py-0.5'>
          <Text className='text-[10px] font-semibold text-[#8B5CF6]'>
            SCIENCE-BACKED
          </Text>
        </View>
      </View>
      <Text className='mb-4 text-[13px] text-stone-500'>
        Match your habit to optimal times based on circadian biology
      </Text>

      <View className='gap-2'>
        {PHASE_ORDER.map((phaseId) => (
          <PhaseOption
            key={phaseId}
            isSelected={selectedPhase === phaseId}
            phaseId={phaseId}
            onPress={handlePhasePress}
          />
        ))}
      </View>

      {selectedPhase && (
        <View className='mt-3 rounded-lg bg-[#F0FDF4] p-3'>
          <Text className='text-xs font-medium text-[#166534]'>
            Best for:{' '}
            {HUBERMAN_PHASES[selectedPhase].activities.slice(0, 3).join(', ')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PhaseSelector;
