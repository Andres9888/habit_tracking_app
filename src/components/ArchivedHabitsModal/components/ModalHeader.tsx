import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { durations, enterEasing } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import { ModalHeaderActions } from './ModalHeaderActions';
import { ModalHeaderTitle } from './ModalHeaderTitle';

const ENTERING = FadeInDown.duration(durations.enter).easing(enterEasing);

interface ModalHeaderProps {
  insets: EdgeInsets;
  habitCount: number;
  selectionMode: boolean;
  onBack: () => void;
  onSelectPress: () => void;
}

export function ModalHeader({
  insets,
  habitCount,
  selectionMode,
  onBack,
  onSelectPress,
}: ModalHeaderProps) {
  const { colors, isDark } = useThemeColors();

  const subtitle =
    habitCount === 0
      ? 'No archived habits'
      : `habit${habitCount === 1 ? '' : 's'} archived · tap Resume to bring ${habitCount === 1 ? 'it' : 'them'} back`;

  return (
    <Animated.View entering={ENTERING}>
      <BlurView
        intensity={20}
        style={{ paddingBottom: 8, paddingTop: insets.top + 8 }}
        tint={isDark ? 'dark' : 'light'}
      >
        <ModalHeaderActions
          colors={colors}
          habitCount={habitCount}
          selectionMode={selectionMode}
          onBack={onBack}
          onSelectPress={onSelectPress}
        />
        <ModalHeaderTitle
          colors={colors}
          habitCount={habitCount}
          isDark={isDark}
          subtitle={subtitle}
        />
      </BlurView>
    </Animated.View>
  );
}
