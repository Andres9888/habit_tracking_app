import { useRef } from 'react';
import { AccessibilityInfo, Animated, Pressable, Text, View } from 'react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { HUBERMAN_PHASES, PHASE_ORDER, type HubermanPhase } from '../../../constants/hubermanPhases';

/**
 * Maps each Huberman phase to a default reminder time
 * - Phase 1 (Push/Morning): 7:00 AM
 * - Phase 2 (Pivot/Afternoon): 12:00 PM
 * - Phase 3 (Pull/Evening): 8:00 PM
 */
export const PHASE_REMINDER_TIMES: Record<HubermanPhase, { hour: number; minute: number }> = {
  phase1_push: { hour: 7, minute: 0 },
  phase2_pivot: { hour: 12, minute: 0 },
  phase3_pull: { hour: 20, minute: 0 },
};

/**
 * Creates a Date object for the reminder time based on the selected phase
 */
export const getReminderTimeForPhase = (phase: HubermanPhase): Date => {
  const time = PHASE_REMINDER_TIMES[phase];
  const date = new Date();
  date.setHours(time.hour, time.minute, 0, 0);
  return date;
};

interface TimeOfDayButtonProps {
  phase: HubermanPhase;
  isSelected: boolean;
  onPress: () => void;
}

const TimeOfDayButton = ({ phase, isSelected, onPress }: TimeOfDayButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const phaseInfo = HUBERMAN_PHASES[phase];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={`${phaseInfo.shortLabel} - ${phaseInfo.timeRange}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className="flex-1"
    >
      <Animated.View
        className="items-center justify-center rounded-xl px-3 py-3"
        style={[
          {
            backgroundColor: isSelected ? '#22C55E' : '#fafaf9',
            borderWidth: 1.5,
            borderColor: isSelected ? '#16A34A' : '#e7e5e4',
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text className="mb-1 text-lg">{phaseInfo.icon}</Text>
        <Text
          className="text-sm font-semibold"
          style={{ color: isSelected ? '#FFFFFF' : '#1c1917' }}
        >
          {phaseInfo.shortLabel}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

interface TimeOfDaySelectorProps {
  selectedPhase: HubermanPhase | null;
  onSelectPhase: (phase: HubermanPhase) => void;
}

export const TimeOfDaySelector = ({
  selectedPhase,
  onSelectPhase,
}: TimeOfDaySelectorProps) => {
  const { triggerSelection } = useHapticFeedback();

  const handleSelectPhase = (phase: HubermanPhase) => {
    triggerSelection();
    onSelectPhase(phase);
    // Announce time of day selection for screen readers
    const phaseInfo = HUBERMAN_PHASES[phase];
    AccessibilityInfo.announceForAccessibility(`Selected ${phaseInfo.shortLabel}, ${phaseInfo.timeRange}`);
  };

  return (
    <View className="mb-6 rounded-2xl bg-white p-4">
      <Text className="mb-3 text-base font-semibold text-stone-800">When</Text>
      <View className="flex-row gap-3">
        {PHASE_ORDER.map((phase) => (
          <TimeOfDayButton
            key={phase}
            phase={phase}
            isSelected={selectedPhase === phase}
            onPress={() => handleSelectPhase(phase)}
          />
        ))}
      </View>
    </View>
  );
};

export default TimeOfDaySelector;
