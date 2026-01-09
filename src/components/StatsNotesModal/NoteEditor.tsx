/**
 * NoteEditor - Re-export barrel
 *
 * This file maintains backward compatibility while the component
 * has been decomposed into smaller files in the NoteEditor/ folder.
 */

export {
  default,
  NoteEditor,
  HabitSelector,
  NoteEditorActions,
  useNoteEditor,
  type NoteEditorProps,
  type HabitSelectorProps,
  type NoteEditorActionsProps,
} from './NoteEditor/index';
