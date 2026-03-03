import { Text, View } from 'react-native';
import { Check, RotateCcw, Trash2 } from 'lucide-react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { colors } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AnimatedPressable } from '../../ui';

interface ActionButtonsProps {
  habitName: string;
  isRestoring: boolean;
  showSuccess: boolean;
  successIconStyle: AnimatedStyle;
  onRestorePress: () => void;
  onDeletePress: () => void;
}

export function ActionButtons({
  habitName,
  isRestoring,
  showSuccess,
  successIconStyle,
  onRestorePress,
  onDeletePress,
}: ActionButtonsProps) {
  const { isDark } = useThemeColors();

  const greenColor = isDark ? '#6EE7B7' : '#059669';
  const redColor = isDark ? '#FCA5A5' : '#DC2626';

  const restoreButtonStyle = showSuccess
    ? {
        backgroundColor: isDark ? '#064e3b' : '#ecfdf5',
        borderColor: isDark ? '#059669' : '#10b981',
      }
    : isRestoring
      ? {
          backgroundColor: isDark ? 'rgba(5,150,105,0.12)' : '#ECFDF5',
          borderColor: isDark ? 'rgba(5,150,105,0.2)' : '#D1FAE5',
          opacity: 0.7,
        }
      : {
          backgroundColor: isDark ? 'rgba(5,150,105,0.12)' : '#ECFDF5',
          borderColor: isDark ? 'rgba(5,150,105,0.2)' : '#D1FAE5',
        };

  return (
    <View className='flex-row gap-2'>
      <AnimatedPressable
        accessibilityLabel={`Restore ${habitName}`}
        accessibilityRole='button'
        className='flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-2.5'
        disabled={isRestoring}
        style={restoreButtonStyle}
        onPress={onRestorePress}
      >
        {showSuccess ? (
          <Animated.View
            className='flex-row items-center gap-2'
            style={successIconStyle}
          >
            <View
              className='h-5 w-5 items-center justify-center rounded-full'
              style={{ backgroundColor: isDark ? '#059669' : '#10b981' }}
            >
              <Check color={colors.text.inverse} size={14} strokeWidth={3} />
            </View>
            <Text style={{ color: greenColor, fontSize: 13, fontWeight: '600' }}>
              Restored!
            </Text>
          </Animated.View>
        ) : (
          <>
            <RotateCcw color={greenColor} size={15} strokeWidth={2.5} />
            <Text style={{ color: greenColor, fontSize: 13, fontWeight: '600' }}>
              {isRestoring ? 'Restoring...' : 'Restore'}
            </Text>
          </>
        )}
      </AnimatedPressable>
      <AnimatedPressable
        accessibilityLabel={`Permanently delete ${habitName}`}
        accessibilityRole='button'
        className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-2.5 ${
          isRestoring ? 'opacity-50' : ''
        }`}
        disabled={isRestoring}
        style={{
          backgroundColor: isDark ? 'rgba(220,38,38,0.1)' : '#FEF2F2',
          borderColor: isDark ? 'rgba(220,38,38,0.2)' : '#FECACA',
        }}
        onPress={onDeletePress}
      >
        <Trash2 color={redColor} size={15} strokeWidth={2.5} />
        <Text style={{ color: redColor, fontSize: 13, fontWeight: '600' }}>
          Delete
        </Text>
      </AnimatedPressable>
    </View>
  );
}
