/**
 * VisionBoardPreview Constants
 */

import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export { SCREEN_HEIGHT, SCREEN_WIDTH };

export const DISMISS_THRESHOLD = 150;
export const SWIPE_VELOCITY_THRESHOLD = 500;
export const HORIZONTAL_SWIPE_THRESHOLD = 80;
