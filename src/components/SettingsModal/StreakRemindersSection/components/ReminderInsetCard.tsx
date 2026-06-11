import { Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { componentSpacing, spacing } from '@/theme/spacing';
import { ReminderTimeRow } from './ReminderTimeRow';
import { PremiumUpsellRow } from './PremiumUpsellRow';
import { timeStringToDate } from '../../timeHelpers';

interface ReminderInsetCardProps {
  insetBackground: string;
  insetBorder: string;
  insetCardBackground: string;
  highContrastMode: boolean;
  reminderTime: string;
  isPremium: boolean;
  showTimePicker: boolean;
  insetExpandStyle: ReturnType<
    typeof import('react-native-reanimated').useAnimatedStyle
  >;
  pickerExpandStyle: ReturnType<
    typeof import('react-native-reanimated').useAnimatedStyle
  >;
  enabled: boolean;
  onInsetLayout: (event: import('react-native').LayoutChangeEvent) => void;
  onPickerLayout: (event: import('react-native').LayoutChangeEvent) => void;
  onToggleTimePicker: () => void;
  onTimeChange: (event: unknown, date?: Date) => void;
  onPremiumUpsell?: () => void;
}

export function ReminderInsetCard(p: ReminderInsetCardProps) {
  const insetPad = componentSpacing.avatar.size + spacing.base;

  return (
    <Animated.View
      pointerEvents={p.enabled ? 'auto' : 'none'}
      style={p.insetExpandStyle}
    >
      <View
        style={{
          backgroundColor: p.insetBackground,
          paddingBottom: 10,
          paddingLeft: insetPad,
          paddingRight: 10,
          paddingTop: 8,
        }}
      >
        <View
          className='overflow-hidden rounded-2xl'
          style={{
            backgroundColor: p.insetCardBackground,
            borderColor: p.insetBorder,
            borderWidth: p.highContrastMode ? 1 : 0,
          }}
          onLayout={p.onInsetLayout}
        >
          <ReminderTimeRow
            highContrastMode={p.highContrastMode}
            reminderTime={p.reminderTime}
            onToggleTimePicker={p.onToggleTimePicker}
          />
          <Animated.View
            pointerEvents={
              p.showTimePicker && Platform.OS === 'ios' ? 'auto' : 'none'
            }
            style={p.pickerExpandStyle}
          >
            <View
              style={{
                borderTopColor: p.insetBorder,
                borderTopWidth: 1,
                paddingBottom: 8,
                paddingHorizontal: 8,
              }}
              onLayout={p.onPickerLayout}
            >
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  display='spinner'
                  mode='time'
                  value={timeStringToDate(p.reminderTime)}
                  onChange={p.onTimeChange}
                />
              ) : null}
            </View>
          </Animated.View>
          {p.isPremium ? null : (
            <PremiumUpsellRow
              insetBorder={p.insetBorder}
              onPremiumUpsell={p.onPremiumUpsell}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
}
