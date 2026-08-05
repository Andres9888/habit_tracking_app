import { Pressable, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { fontWeights } from '@/theme/typography';
import type { SemanticColors } from '@/theme/darkColors';

interface ModalHeaderActionsProps {
  colors: SemanticColors;
  habitCount: number;
  selectionMode: boolean;
  onBack: () => void;
  onSelectPress: () => void;
}

export function ModalHeaderActions({
  colors,
  habitCount,
  selectionMode,
  onBack,
  onSelectPress,
}: ModalHeaderActionsProps) {
  const selectDisabled = !selectionMode && habitCount === 0;
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 16,
      }}
    >
      <Pressable
        accessibilityLabel='Back to settings'
        accessibilityRole='button'
        style={{
          alignItems: 'center',
          height: 40,
          justifyContent: 'center',
          opacity: 0.5,
          width: 40,
        }}
        onPress={onBack}
      >
        <ChevronLeft
          color={colors.text.primary}
          size={iconSizes.large}
          strokeWidth={2}
        />
      </Pressable>
      <Pressable
        accessibilityLabel={
          selectionMode ? 'Cancel selection' : 'Enter selection mode'
        }
        accessibilityRole='button'
        accessibilityState={{ disabled: selectDisabled }}
        disabled={selectDisabled}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          borderRadius: 8,
          opacity: selectDisabled ? 0.4 : 1,
          paddingHorizontal: 10,
          paddingVertical: 8,
        }}
        onPress={onSelectPress}
      >
        <Text
          style={{
            color: selectionMode
              ? colors.text.secondary
              : colors.status.success,
            fontSize: 14,
            fontWeight: fontWeights.semibold,
            letterSpacing: -0.1,
          }}
        >
          {selectionMode ? 'Cancel' : 'Select'}
        </Text>
      </Pressable>
    </View>
  );
}
