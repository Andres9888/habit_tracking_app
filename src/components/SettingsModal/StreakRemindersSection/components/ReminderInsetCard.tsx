import { Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ReminderTimeRow } from './ReminderTimeRow';
import { PremiumUpsellRow } from './PremiumUpsellRow';
import { timeStringToDate } from '../../timeHelpers';

interface ReminderInsetCardProps {
  insetBackground: string;
  insetBorder: string;
  insetCardBackground: string;
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
  return (
    <Animated.View
      pointerEvents={p.enabled ? 'auto' : 'none'}
      style={p.insetExpandStyle}
    >
      <View
        className='pb-2.5 pl-14 pr-2.5 pt-2'
        style={{ backgroundColor: p.insetBackground }}
      >
        <View
          className='overflow-hidden rounded-2xl'
          style={{
            backgroundColor: p.insetCardBackground,
            borderColor: p.insetBorder,
            borderWidth: 0,
          }}
          onLayout={p.onInsetLayout}
        >
          <ReminderTimeRow
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
              className='border-t px-3.5 pb-3'
              style={{ borderTopColor: p.insetBorder }}
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
