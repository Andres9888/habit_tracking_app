/**
 * Tab bar component with animated indicator — dark-mode aware.
 */

import { Pressable, Text, type LayoutChangeEvent } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import { tabStyles as styles } from '../../templates/styles/tabStyles';
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
  const { colors, isDark } = useThemeColors();

  const handleCategoriesPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress('categories');
  };

  const handleAllPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress('all');
  };

  /* ---- theme-derived colours ---- */
  const trackBg = colors.gray[100];
  const pillBg = isDark ? colors.gray[200] : '#FFFFFF';
  const pillShadow = colors.primary[500];
  const activeTextColor = colors.primary[600];
  const inactiveTextColor = colors.text.tertiary;
  const activeBadgeColor = colors.primary[500];
  const inactiveBadgeColor = colors.text.tertiary;

  return (
    <Animated.View
      style={[
        styles.tabBar,
        { backgroundColor: trackBg },
        tabBarAnimatedStyle,
      ]}
      onLayout={onLayout}
    >
      <Animated.View
        style={[
          styles.tabIndicator,
          { backgroundColor: pillBg, shadowColor: pillShadow },
          tabIndicatorStyle,
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
            {
              color:
                activeTab === 'categories'
                  ? activeTextColor
                  : inactiveTextColor,
            },
          ]}
        >
          Categories
        </Text>
        <Text
          style={[
            styles.tabCount,
            {
              color:
                activeTab === 'categories'
                  ? activeBadgeColor
                  : inactiveBadgeColor,
            },
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
            {
              color:
                activeTab === 'all' ? activeTextColor : inactiveTextColor,
            },
          ]}
        >
          View All
        </Text>
        <Text
          style={[
            styles.tabCount,
            {
              color:
                activeTab === 'all' ? activeBadgeColor : inactiveBadgeColor,
            },
          ]}
        >
          {allCount}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
