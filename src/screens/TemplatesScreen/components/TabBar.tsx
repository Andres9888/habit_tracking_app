/**
 * Tab bar component with animated indicator (theme-aware)
 */

import { Pressable, Text, type LayoutChangeEvent } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { styles } from '../../templates/templatesScreenStyles';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { BrowseTab } from '../TemplatesScreen.types';

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
  const { colors } = useThemeColors();

  const handleCategoriesPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress('categories');
  };

  const handleAllPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress('all');
  };

  return (
    <Animated.View
      style={[styles.tabBar, { backgroundColor: colors.surface }, tabBarAnimatedStyle]}
      onLayout={onLayout}
    >
      <Animated.View style={[styles.tabIndicator, { backgroundColor: colors.card }, tabIndicatorStyle]} />
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
            activeTab === 'categories' && styles.tabTextActive,
          ]}
        >
          Categories
        </Text>
        <Text
          style={[
            styles.tabCount,
            { color: colors.text.tertiary },
            activeTab === 'categories' && styles.tabCountActive,
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
            activeTab === 'all' && styles.tabTextActive,
          ]}
        >
          View All
        </Text>
        <Text
          style={[
            styles.tabCount,
            { color: colors.text.tertiary },
            activeTab === 'all' && styles.tabCountActive,
          ]}
        >
          {allCount}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
