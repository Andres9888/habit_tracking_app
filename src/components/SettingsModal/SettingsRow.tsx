import { ReactNode } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface SettingsRowProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  type: 'toggle' | 'navigation' | 'selection';
  value?: boolean | string;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showBorder?: boolean;
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
}: SettingsRowProps) {
  const content = (
    <View
      className={`flex-row items-center px-4 py-4 ${showBorder ? 'border-b border-gray-100' : ''}`}
    >
      {/* Icon */}
      <View
        className="mr-4 size-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: iconBackgroundColor }}
      >
        {icon}
      </View>

      {/* Label */}
      <Text className="flex-1 text-[16px] font-semibold text-[#1a1a1a]">
        {label}
      </Text>

      {/* Right side content */}
      {type === 'toggle' && (
        <Switch
          value={value as boolean}
          onValueChange={onToggle}
          trackColor={{ false: '#d1d5db', true: '#1a1a1a' }}
          thumbColor="#ffffff"
          ios_backgroundColor="#d1d5db"
        />
      )}

      {type === 'selection' && (
        <View className="flex-row items-center gap-1">
          <Text className="text-[16px] font-medium text-[#8a8a8a]">
            {value as string}
          </Text>
          <ChevronRight size={16} color="#8a8a8a" />
        </View>
      )}

      {type === 'navigation' && <ChevronRight size={16} color="#8a8a8a" />}
    </View>
  );

  if (type === 'toggle') {
    return content;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  );
}
