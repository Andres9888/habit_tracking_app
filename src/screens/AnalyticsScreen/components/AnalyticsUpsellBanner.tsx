/**
 * AnalyticsUpsellBanner - Soft premium upsell shown between
 * basic and advanced analytics sections.
 *
 * Shows after overview stats: "Want deeper insights?"
 * Non-intrusive — doesn't block content, just encourages upgrade.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BarChart3, TrendingUp, Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OPACITY } from '../../../constants';

interface AnalyticsUpsellBannerProps {
  onUpgrade: () => void;
}

const PREMIUM_INSIGHTS = [
  { icon: BarChart3, label: 'Trend charts & patterns', color: '#059669' },
  { icon: TrendingUp, label: 'Compliance tracking', color: '#0284c7' },
  { icon: Brain, label: 'AI-powered weekly insights', color: '#8b5cf6' },
];

export function AnalyticsUpsellBanner({ onUpgrade }: AnalyticsUpsellBannerProps) {
  return (
    <View
      className="mx-4 overflow-hidden rounded-2xl"
      style={{
        elevation: 4,
        shadowColor: '#047857',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      }}
    >
      <LinearGradient
        className="px-5 py-5"
        colors={['#064e3b', '#065f46']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      >
        <Text className="mb-1 text-[17px] font-semibold text-white">
          Want deeper insights? 📊
        </Text>
        <Text className="mb-4 text-[13px] leading-[18px] text-emerald-200">
          See exactly what's working — unlock charts, trends, and AI insights.
        </Text>

        <View className="mb-4 gap-2.5">
          {PREMIUM_INSIGHTS.map((item) => (
            <View key={item.label} className="flex-row items-center gap-2.5">
              <item.icon color="#6ee7b7" size={14} />
              <Text className="text-[13px] text-emerald-100">{item.label}</Text>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityLabel="Unlock premium analytics"
          accessibilityRole="button"
          className="items-center rounded-xl bg-white/20 py-3"
          style={({ pressed }) => ({
            opacity: pressed ? OPACITY.strong : OPACITY.full,
          })}
          onPress={onUpgrade}
        >
          <Text className="text-[15px] font-semibold text-white">
            Try Free for 7 Days →
          </Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}
