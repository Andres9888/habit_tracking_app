import { FadeInDown } from 'react-native-reanimated';

export const ENTERING = FadeInDown.duration(280).springify().damping(18);
export const STREAK_STYLE = { color: '#78716c', fontFamily: 'System' };
export const DATE_STYLE = { fontFamily: 'System', letterSpacing: -0.76 };

export const formatTodayDate = (): string => {
  const now = new Date();
  return `Today · ${now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
};
