/**
 * TabBar Component
 * 
 * Bottom tab navigation with:
 * - Clean, minimal design matching app design system
 * - Clear icon states (active/inactive)
 * - Safe area insets for notched phones
 * - Dark mode support
 * - Smooth animations (280ms, springify damping 18)
 * - Badge/notification dot support
 * - Haptic feedback
 */

import React from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { 
  Home, 
  TrendingUp, 
  User,
} from 'lucide-react-native';
import { useThemeColors } from '../theme/ThemeContext';
import { colors as designColors } from '../theme/colors';

export type TabRoute = 'home' | 'analytics' | 'character';

interface TabBarProps {
  activeTab: TabRoute;
  onTabChange: (tab: TabRoute) => void;
  badges?: Partial<Record<TabRoute, boolean>>;
}

interface TabButtonProps {
  route: TabRoute;
  label: string;
  icon: typeof Home;
  isActive: boolean;
  onPress: () => void;
  hasBadge?: boolean;
}

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabButton({ 
  route, 
  label, 
  icon: Icon, 
  isActive, 
  onPress,
  hasBadge = false,
}: TabButtonProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(isActive ? 1.1 : 1);
  
  // Update icon scale when active state changes
  React.useEffect(() => {
    iconScale.value = withSpring(isActive ? 1.1 : 1, SPRING_CONFIG);
  }, [isActive, iconScale]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  const handlePress = () => {
    if (!isActive) {
      // Haptic feedback on tab change
      if (Platform.OS === 'ios') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        void Haptics.selectionAsync();
      }
    }
    onPress();
  };

  const iconColor = isActive ? designColors.primary[600] : colors.text.secondary;
  const labelColor = isActive ? designColors.primary[700] : colors.text.secondary;
  const fontWeight = isActive ? '600' : '500';

  return (
    <AnimatedPressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${label} tab`}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 4,
        },
        buttonAnimatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={{ position: 'relative' }}>
        <Animated.View style={iconAnimatedStyle}>
          <Icon
            size={24}
            color={iconColor}
            strokeWidth={isActive ? 2.5 : 2}
          />
        </Animated.View>
        {hasBadge && (
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: designColors.red[500],
              borderWidth: 1.5,
              borderColor: colors.background,
            }}
          />
        )}
      </View>
      <Text
        style={{
          marginTop: 4,
          fontSize: 11,
          fontWeight,
          color: labelColor,
          letterSpacing: -0.1,
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function TabBar({ activeTab, onTabChange, badges = {} }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  // Calculate bottom padding with safe area
  const bottomPadding = Math.max(insets.bottom, 8);

  const tabs: Array<{
    route: TabRoute;
    label: string;
    icon: typeof Home;
  }> = [
    { route: 'home', label: 'Home', icon: Home },
    { route: 'analytics', label: 'Analytics', icon: TrendingUp },
    { route: 'character', label: 'Character', icon: User },
  ];

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: bottomPadding,
        paddingTop: 8,
        flexDirection: 'row',
        // Shadow for elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      {tabs.map((tab) => (
        <TabButton
          key={tab.route}
          route={tab.route}
          label={tab.label}
          icon={tab.icon}
          isActive={activeTab === tab.route}
          onPress={() => onTabChange(tab.route)}
          hasBadge={badges[tab.route]}
        />
      ))}
    </View>
  );
}
