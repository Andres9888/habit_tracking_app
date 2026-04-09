/** StaticSectionLabel - Non-collapsible section title label */
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface StaticSectionLabelProps {
  title: string;
  subtitle?: string;
  highContrastMode?: boolean;
}

export function StaticSectionLabel({
  title,
  subtitle,
  highContrastMode = false,
}: StaticSectionLabelProps) {
  const { colors: themeColors } = useThemeColors();
  const titleColor = highContrastMode ? '#facc15' : themeColors.text.secondary;

  return (
    <View className="flex-row items-center px-4">
      <View className="mr-4 w-10" />
      <Text
        className="text-[12px] font-medium uppercase tracking-[1.5px]"
        style={{ color: titleColor }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
          style={{
            backgroundColor: themeColors.status.warningLight,
            color: themeColors.status.warningText,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
