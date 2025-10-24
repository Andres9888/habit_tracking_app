/**
 * App Navigator
 * Tab-based navigation for Home, Analytics, and Settings
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import TabBar, { type TabId } from './TabBar';
// import AnalyticsScreen from '../screens/AnalyticsScreen';
// Temporarily disabled to test Skia issue

interface AppNavigatorProps {
  children: React.ReactNode; // Home screen content
  settingsOpen: boolean;
  onSettingsPress: () => void;
}

export function AppNavigator({ children, settingsOpen, onSettingsPress }: AppNavigatorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const handleTabChange = (tab: TabId) => {
    if (tab === 'settings') {
      onSettingsPress();
      // Don't change active tab, just open settings modal
      return;
    }
    setActiveTab(tab);
  };

  // Render active screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return children;
      case 'analytics':
        // Temporarily disabled for Skia debugging
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Analytics (temporarily disabled)</Text>
          </View>
        );
      case 'settings':
        return children; // Settings is a modal, so show home
      default:
        return children;
    }
  };

  return (
    <View style={styles.container}>
      {/* Active Screen */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Tab Bar */}
      <TabBar activeTab={settingsOpen ? 'settings' : activeTab} onTabChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default AppNavigator;
