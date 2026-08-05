/**
 * NotificationMockup - Fake phone notification visual for screen 8.
 *
 * Renders a mock push notification card with a Chain Day icon,
 * motivational title, and body text to preview reminder UX.
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

const NOTIFICATION = {
  body: 'Your morning routine is waiting. 14-day chain at stake!',
  icon: '\uD83D\uDD17',
  title: "Don't break the chain! \uD83D\uDD25",
} as const;

export function NotificationMockup() {
  const { colors } = useThemeColors();

  return (
    <View
      className="mx-4 rounded-2xl px-4 py-3.5"
      style={{
        backgroundColor: colors.card,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      }}
    >
      <View className="flex-row items-start">
        <IconCircle bgColor={colors.primary[100]} />
        <View className="ml-3 flex-1">
          <Text
            className="text-sm font-bold"
            style={{ color: colors.text.primary }}
          >
            {NOTIFICATION.title}
          </Text>
          <Text
            className="mt-1 text-sm leading-5"
            style={{ color: colors.text.secondary }}
          >
            {NOTIFICATION.body}
          </Text>
        </View>
      </View>
    </View>
  );
}

function IconCircle({ bgColor }: { bgColor: string }) {
  return (
    <View
      className="h-10 w-10 items-center justify-center rounded-full"
      style={{ backgroundColor: bgColor }}
    >
      <Text className="text-lg">{NOTIFICATION.icon}</Text>
    </View>
  );
}
