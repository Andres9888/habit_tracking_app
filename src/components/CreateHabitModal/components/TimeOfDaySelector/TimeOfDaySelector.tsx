/**
 * TimeOfDaySelector Component
 * Allows users to select morning/afternoon/evening for habits
 */

import { AccessibilityInfo, Text, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { useThemeColors } from '../../../../theme/ThemeContext';
import {
  HUBERMAN_PHASES,
  PHASE_ORDER,
  type HubermanPhase,
} from '../../../../constants/hubermanPhases';
import { TimeOfDayButton } from './TimeOfDayButton';

interface TimeOfDaySelectorProps {
  selectedPhase: HubermanPhase | null;
  onSelectPhase: (phase: HubermanPhase) => void;
}

export const TimeOfDaySelector = ({
  selectedPhase,
  onSelectPhase,
}: TimeOfDaySelectorProps) => {
  const { triggerSelection } = useHapticFeedback();
  const { colors } = useThemeColors();

  const handleSelectPhase = (phase: HubermanPhase) => {
    triggerSelection();
    onSelectPhase(phase);
    const phaseInfo = HUBERMAN_PHASES[phase];
    AccessibilityInfo.announceForAccessibility(
      `Selected ${phaseInfo.shortLabel}, ${phaseInfo.timeRange}`
    );
  };

  return (
    <View className='mb-6 rounded-2xl p-4' style={{ backgroundColor: colors.card }}>
      <Text className='mb-3 text-base font-semibold' style={{ color: colors.text.primary }}>When</Text>
      <View className='flex-row gap-3'>
        {PHASE_ORDER.map((phase) => (
          <TimeOfDayButton
            key={phase}
            isSelected={selectedPhase === phase}
            phase={phase}
            onPress={() => handleSelectPhase(phase)}
          />
        ))}
      </View>
    </View>
  );
};

export default TimeOfDaySelector;
