/**
 * Card Component
 *
 * Reusable card wrapper with consistent styling and entrance animation.
 * Used for grouping related form sections.
 */

import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface CardProps {
  children: ReactNode;
  title?: string;
  icon?: string;
  delay?: number;
}

export function Card({ children, title, icon, delay = 0 }: CardProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(280).delay(delay).springify().damping(20)}
      style={styles.card}
    >
      {title && (
        <View className='mb-4 flex-row items-center'>
          {icon && <Text className='mr-2 text-lg'>{icon}</Text>}
          <Text
            className='text-lg font-semibold text-stone-800'
            style={{ letterSpacing: -0.25 }}
          >
            {title}
          </Text>
        </View>
      )}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 2,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
});
