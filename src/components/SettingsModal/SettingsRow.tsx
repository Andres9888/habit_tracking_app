import { ReactNode } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { getSettingsRowColors } from './SettingsRow.colors';

interface SettingsRowProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  type: 'toggle' | 'navigation' | 'selection';
  value?: boolean | string;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showBorder?: boolean;
  highContrastMode?: boolean;
}

export function SettingsRow({
  icon,
  iconBackgroundColor,
  label,
  type,
  value,
  onPress,
  onToggle,
  showBorder = true,
  highContrastMode = false,
}: SettingsRowProps) {
  const colors = getSettingsRowColors(highContrastMode);

  const content = (
    <View
      className={`flex-row items-center px-4 py-4 ${showBorder ? 'border-b border-stone-100' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: showBorder ? colors.border : undefined,
      }}
    >
      {/* Icon */}
      <View
        className='mr-4 size-10 items-center justify-center rounded-lg'
        style={{
          backgroundColor: iconBackgroundColor,
          borderColor: highContrastMode ? '#facc15' : 'transparent',
          borderWidth: highContrastMode ? 2 : 0,
        }}
      >
        {icon}
      </View>

      {/* Label */}
      <Text
        className='flex-1 text-[17px] font-semibold'
        style={{ color: colors.label }}
      >
        {label}
      </Text>

      {/* Right side content */}
      {type === 'toggle' && (
        <Switch
          accessibilityLabel={label}
          ios_backgroundColor={colors.switchTrackFalse}
          thumbColor={colors.switchThumb}
          trackColor={{
            false: colors.switchTrackFalse,
            true: colors.switchTrackTrue,
          }}
          value={value as boolean}
          onValueChange={onToggle}
        />
      )}

      {type === 'selection' && (
        <View className='flex-row items-center gap-1'>
          <Text
            className='text-[17px] font-medium'
            style={{ color: colors.value }}
          >
            {value as string}
          </Text>
          <ChevronRight color={colors.chevron} size={16} />
        </View>
      )}

      {type === 'navigation' && (
        <ChevronRight color={colors.chevron} size={16} />
      )}
    </View>
  );

  if (type === 'toggle') {
    return content;
  }

  return (
    <TouchableOpacity
      accessibilityRole='button'
      activeOpacity={0.7}
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  );
}
