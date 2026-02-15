
import { Text, View } from 'react-native';

import {
  type HubermanPhase,
  getPhaseFromPreferredTime,
  getPhaseInfo,
} from '../../constants/hubermanPhases';

interface PhaseTagProps {
  /** Direct phase value */
  phase?: HubermanPhase | null;
  /** Legacy preferredTime value (will be mapped to phase) */
  preferredTime?: string;
  /** Show compact version (icon only) */
  compact?: boolean;
  /** Additional class names */
  className?: string;
}

export const PhaseTag = ({
  className = '',
  compact = false,
  phase,
  preferredTime,
}: PhaseTagProps) => {
  // Resolve phase from either direct value or legacy preferredTime
  const resolvedPhase = phase ?? getPhaseFromPreferredTime(preferredTime);
  const phaseInfo = getPhaseInfo(resolvedPhase ?? undefined);

  if (!phaseInfo) return null;

  if (compact) {
    return (
      <View
        accessibilityLabel={`${phaseInfo.label}: ${phaseInfo.description}`}
        accessibilityRole='text'
        className={`items-center justify-center rounded-full px-1.5 py-0.5 ${className}`}
        style={{ backgroundColor: phaseInfo.bgColor }}
      >
        <Text className='text-xs'>{phaseInfo.icon}</Text>
      </View>
    );
  }

  return (
    <View
      accessibilityLabel={`${phaseInfo.label}: ${phaseInfo.description}`}
      accessibilityRole='text'
      className={`flex-row items-center rounded-full px-2 py-1 ${className}`}
      style={{ backgroundColor: phaseInfo.bgColor }}
    >
      <Text className='mr-1 text-xs'>{phaseInfo.icon}</Text>
      <Text
        className='text-xs font-medium'
        style={{ color: phaseInfo.color }}
      >
        {phaseInfo.shortLabel}
      </Text>
    </View>
  );
};

export default PhaseTag;
