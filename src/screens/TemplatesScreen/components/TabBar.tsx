/**
 * Tab bar component with animated indicator (theme-aware)
 */

import { Pressable, Text, type LayoutChangeEvent } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import type { BrowseTab } from '../TemplatesScreen.types';
import { styles } from '../../templates/templatesScreenStyles';
import { useThemeColors } from '../../../theme/ThemeContext';

interface TabBarProps {
  activeTab: BrowseTab;
  allCount: number;
  categoriesCount: number;
  onLayout: (event: LayoutChangeEvent) => void;
  onTabPress: (tab: BrowseTab) => void;
  tabBarAnimatedStyle: AnimatedStyle;
  tabIndicatorStyle: AnimatedStyle;
}

export function TabBar({
  activeTab,
  allCount,
  categoriesCount,
  onLayout,
  onTabPress,
  tabBarAnimatedStyle,
  tabIndicatorStyle,
}: TabBarProps) {
  const { colors, isDark } = useThemeColors();

  const handleCategoriesPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress('categories');
  };

  const handleAllPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress('all');
  };

  // Theme-aware active colors
  const activeColor = colors.primary[400];
  const activeTextColor = colors.primary[700];
  const indicatorBgColor = isDark ? colors.gray[700] : colors.card;
  const indicatorShadowColor = colors.primary[300];

  return (
    <Animated.View
      style={[styles.tabBar, { backgroundColor: colors.surface }, tabBarAnimatedStyle]}
      onLayout={onLayout}
    >
      <Animated.View 
        style={[
          styles.tabIndicator, 
          { 
            backgroundColor: indicatorBgColor,
            shadowColor: indicatorShadowColor,
          }, 
          tabIndicatorStyle
        ]} 
      />
      <Pressable
        accessible
        accessibilityLabel={`Categories tab, ${categoriesCount} categories`}
        accessibilityRole='tab'
        accessibilityState={{ selected: activeTab === 'categories' }}
        style={styles.tab}
        onPress={handleCategoriesPress}
      >
        <Text
          style={[
            styles.tabText,
            { color: colors.text.secondary },
            activeTab === 'categories' && [styles.tabTextActive, { color: activeTextColor }],
          ]}
        >
          Categories
        </Text>
        <Text
          style={[
            styles.tabCount,
            { color: colors.text.tertiary },
            activeTab === 'categories' && [styles.tabCountActive, { color: activeColor }],
          ]}
        >
          {categoriesCount}
        </Text>
      </Pressable>
      <Pressable
        accessible
        accessibilityLabel={`View All tab, ${allCount} templates`}
        accessibilityRole='tab'
        accessibilityState={{ selected: activeTab === 'all' }}
        style={styles.tab}
        onPress={handleAllPress}
      >
        <Text
          style={[
            styles.tabText,
            { color: colors.text.secondary },
            activeTab === 'all' && [styles.tabTextActive, { color: activeTextColor }],
          ]}
        >
          View All
        </Text>
        <Text
          style={[
            styles.tabCount,
            { color: colors.text.tertiary },
            activeTab === 'all' && [styles.tabCountActive, { color: activeColor }],
          ]}
        >
          {allCount}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
