/**
 * TabNavigator Component
 * 
 * Main tab-based navigation orchestrator that:
 * - Manages active tab state
 * - Renders appropriate screen content
 * - Provides smooth transitions between tabs
 * - Handles proper screen lifecycle
 */

import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { TabBar, type TabRoute } from './TabBar';
import HabitsApp from '../features/habits/HabitsApp';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import CharacterScreen from '../screens/CharacterScreen';
import { useThemeColors } from '../theme/ThemeContext';

const FADE_DURATION = 280;

export function TabNavigator() {
  const [activeTab, setActiveTab] = useState<TabRoute>('home');
  const { colors } = useThemeColors();

  // Badge state - could be driven by notifications, unread analytics, etc.
  const badges = {
    analytics: false, // Could show if new insights available
    character: false, // Could show if new achievements unlocked
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Screen Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <Animated.View
            key="home"
            entering={FadeIn.duration(FADE_DURATION)}
            exiting={FadeOut.duration(FADE_DURATION)}
            style={{ flex: 1 }}
          >
            <HabitsApp />
          </Animated.View>
        )}
        
        {activeTab === 'analytics' && (
          <Animated.View
            key="analytics"
            entering={FadeIn.duration(FADE_DURATION)}
            exiting={FadeOut.duration(FADE_DURATION)}
            style={{ flex: 1 }}
          >
            <AnalyticsScreen />
          </Animated.View>
        )}
        
        {activeTab === 'character' && (
          <Animated.View
            key="character"
            entering={FadeIn.duration(FADE_DURATION)}
            exiting={FadeOut.duration(FADE_DURATION)}
            style={{ flex: 1 }}
          >
            <CharacterScreen onBack={() => setActiveTab('home')} />
          </Animated.View>
        )}
      </View>

      {/* Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badges={badges}
      />
    </View>
  );
}
