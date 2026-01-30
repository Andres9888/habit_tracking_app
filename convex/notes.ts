/**
 * Notes API
 * Simple note-taking linked to habits with date tracking
 */

// Re-export types, constants, and validators
export * from './notes/index';

// Re-export queries
export { get, list, search } from './notesQueries';

// Re-export mutations
export { create, remove, update } from './notesMutations';
