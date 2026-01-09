/**
 * Vision Board Images API
 * Photo grid of motivational images for habits
 *
 * Scientific Basis:
 * - Visual motivation reinforces goals through mental imagery
 * - Personal images > stock images for emotional connection (Brewer, 2018)
 * - Mirror neurons activate when viewing goal-related imagery
 * - Mental contrasting with visual cues improves goal pursuit (Oettingen, 2014)
 *
 * Business Model:
 * - Premium feature: storage costs, personalization, high perceived value
 * - Users pay for customization (Notion model)
 * - 4-image grid per habit, unlimited for premium users
 *
 * Story T12: Vision Board
 *
 * Decomposed structure:
 * - visionBoardImages/ - Types, constants, validators, helpers
 * - visionBoardImagesQueries.ts - Query operations
 * - visionBoardImagesMutations.ts - Create/update mutations
 * - visionBoardImagesDelete.ts - Delete with cleanup
 */

// Re-export types and helpers
export {
  MAX_IMAGES_PER_HABIT,
  MAX_CAPTION_LENGTH,
  visionBoardImageObjectValidator,
  visionBoardImageDbValidator,
} from './visionBoardImages/index';

// Query operations
export {
  listByHabit,
  get,
  countByHabit,
  listByUser,
  listRecent,
} from './visionBoardImagesQueries';

// Create mutation
export { create } from './visionBoardImagesCreate';

// Update mutations
export { updateCaption, reorder } from './visionBoardImagesMutations';

// Delete operation
export { remove } from './visionBoardImagesDelete';
