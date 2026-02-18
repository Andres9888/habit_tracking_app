/**
 * ActionButtons — right-side button group for the BottomActionBar.
 *
 * Variant 2 "Raised Center Add": Templates pill, Settings gear,
 * and a raised Add button that breaks above the bar line.
 */

import { View, Pressable, Text } from 'react-native';
import { BookOpen, Settings, Plus } from 'lucide-react-native';
import { NotificationBadge } from '../../../../components/NotificationBadge';
import { useIsDark } from '../../../../theme/ThemeContext';
import { styles } from './BottomActionBar.styles';

interface ActionButtonsProps {
  showTemplateBadge: boolean;
  onAddHabit: () => void;
  onOpenSettings: () => void;
  onOpenTemplates: () => void;
  onDismissTemplateBadge: () => void;
}

export function ActionButtons({
  showTemplateBadge,
  onAddHabit,
  onOpenSettings,
  onOpenTemplates,
  onDismissTemplateBadge,
}: ActionButtonsProps) {
  const isDark = useIsDark();
  const iconColor = isDark ? '#D1D5DB' : '#44403c';
  const borderColor = isDark ? 'rgba(23,23,23,0.97)' : 'rgba(255,255,255,0.97)';

  return (
    <View style={styles.rightSection}>
      <View style={{ position: 'relative' }}>
        <Pressable
          accessibilityHint='Browse habit templates to add'
          accessibilityLabel='Browse habit templates'
          accessibilityRole='button'
          style={({ pressed }) => ({
            alignItems: 'center' as const,
            backgroundColor: pressed ? '#6d28d9' : '#7c3aed',
            borderRadius: 8,
            flexDirection: 'row' as const,
            gap: 4,
            height: 32,
            justifyContent: 'center' as const,
            paddingHorizontal: 8,
          })}
          onPress={() => {
            onDismissTemplateBadge();
            onOpenTemplates();
          }}
        >
          <BookOpen color='#ffffff' size={12} strokeWidth={2.25} />
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
            Templates
          </Text>
        </Pressable>
        <NotificationBadge count={1} visible={showTemplateBadge} />
      </View>

      <Pressable
        accessibilityHint='Open app settings'
        accessibilityLabel='Open settings'
        accessibilityRole='button'
        style={({ pressed }) => [
          styles.iconButton,
          isDark ? styles.iconButtonDark : styles.iconButtonLight,
          pressed && styles.iconButtonPressed,
        ]}
        onPress={onOpenSettings}
      >
        <Settings color={iconColor} size={14} strokeWidth={2.25} />
      </Pressable>

      <Pressable
        accessibilityHint='Open create habit modal'
        accessibilityLabel='Add habit'
        accessibilityRole='button'
        style={({ pressed }) => ({
          alignItems: 'center' as const,
          backgroundColor: pressed ? '#047857' : '#059669',
          borderColor,
          borderRadius: 24,
          borderWidth: 3,
          height: 48,
          justifyContent: 'center' as const,
          marginTop: -16,
          width: 48,
        })}
        onPress={onAddHabit}
      >
        <Plus color='#ffffff' size={22} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}
