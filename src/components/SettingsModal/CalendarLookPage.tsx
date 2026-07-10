/** CalendarLookPage — Sub-page: live preview + day shape, fill, chain & icon */
import { Calendar } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { shadows } from '@/theme';
import { airy } from '@/theme/airyScale';
import { iconSizes } from '@/theme/iconSizes';
import { ScreenHeader } from '../ScreenHeader';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { CalendarPreview } from './CalendarPreview';
import { CompletionIconSettingsRow } from './CompletionIconSettingsRow';
import { ConnectorStyleSettingsRow } from './ConnectorStyleSettingsRow';
import { DayMarkerShapeSettingsRow } from './DayMarkerShapeSettingsRow';
import { SettingsRow } from './SettingsRow';
import { SettingsRowDividerProvider } from './SettingsRow/SettingsRowDivider.provider';
import { AppearanceChainRows } from './sections/AppearanceChainRows';
import { getRaisedSurface } from './raisedSurface';
import { useThemeColors } from '../../theme/ThemeContext';
import type { CalendarLookPageProps } from './CalendarLookPage.types';

export function CalendarLookPage(p: CalendarLookPageProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors, isDark, settings } = useThemeColors();
  const bottomPadding = Math.max((insets.bottom ?? 0) + 16, 24);
  const cardStyle = {
    backgroundColor: getRaisedSurface(isDark),
    borderColor: themeColors.border,
    borderRadius: airy.cardRadius,
    borderWidth: 1,
    ...shadows.card,
  };

  return (
    <View
      className='flex-1'
      style={{ backgroundColor: themeColors.background }}
    >
      <View style={{ backgroundColor: themeColors.background }}>
        <ScreenHeader
          leftAction='back'
          rightAction={
            <ModalCloseButton label='Close settings' onClose={p.onClose} />
          }
          title='Calendar look'
          onBack={p.onBack}
        />
      </View>
      <Animated.ScrollView
        className='flex-1 px-4'
        contentContainerStyle={{ paddingBottom: bottomPadding, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
      >
        <View className='overflow-hidden rounded-2xl' style={cardStyle}>
          <SettingsRowDividerProvider>
            <CalendarPreview
              compact={p.compactView}
              completionIcon={p.habitCompletionIcon}
              dayShape={p.dayShape}
              showGradientFill={p.showGradientFill}
              connectorStyle={p.connectorStyle}
            />
            <DayMarkerShapeSettingsRow
              selected={p.dayShape}
              onSelect={p.onChangeDayShape}
            />
            <AppearanceChainRows
              showGradientFill={p.showGradientFill}
              onChangeShowGradientFill={p.onChangeShowGradientFill}
            />
            <ConnectorStyleSettingsRow
              dayShape={p.dayShape}
              selected={p.connectorStyle}
              onSelect={p.onChangeConnectorStyle}
            />
            <CompletionIconSettingsRow
              selected={p.habitCompletionIcon}
              onSelect={p.onChangeHabitCompletionIcon}
            />
            <SettingsRow
              icon={
                <Calendar
                  color={settings.calendarHeader.icon}
                  size={iconSizes.small}
                />
              }
              iconBackgroundColor={settings.calendarHeader.bg}
              label='Sticky month header'
              subtitle='Month stays visible while scrolling'
              type='toggle'
              value={p.stickyCalendarHeader}
              onToggle={(v) => void p.onChangeStickyCalendarHeader(v)}
            />
          </SettingsRowDividerProvider>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
