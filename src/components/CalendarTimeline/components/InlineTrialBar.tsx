import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface InlineTrialBarProps {
  daysRemaining: number;
  onUpgrade: () => void;
}

/** Value-framed trial bar that sits flush at the top of the CalendarTimeline card */
export const InlineTrialBar: React.FC<InlineTrialBarProps> = ({
  daysRemaining,
  onUpgrade,
}) => (
  <Pressable onPress={onUpgrade}>
    <LinearGradient
      colors={['#f59e0b', '#ef4444']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 6,
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: '700', color: '#ffffff' }}>
        Your progress is growing — keep it going
      </Text>
      <Text style={{ fontSize: 10, fontWeight: '600', color: '#fef3c7' }}>
        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
      </Text>
    </LinearGradient>
  </Pressable>
);
