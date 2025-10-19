import { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="gap-2">
      <Text className="px-2 text-[14px] font-semibold uppercase tracking-[0.7px] text-[#8a8a8a]">
        {title}
      </Text>
      <View className="overflow-hidden rounded-[16px] bg-white">
        {children}
      </View>
    </View>
  );
}
