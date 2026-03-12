# Plan: Add Subtitles to Settings Preference & Data Rows

## Context
The settings page preference items mostly lack descriptive subtitles. The `SettingsRow` component already supports a `subtitle` prop (used by "Completion icon"), so this is a text-only addition — no component changes needed.

## Changes

### File: `src/components/SettingsModal/SettingsContent.tsx`

Add `subtitle` prop to 6 existing `SettingsRow` instances:

**Preferences section (lines 86–129):**
- "Circular day markers" → `subtitle="Use circles instead of squares on the calendar"`
- "Gradient streak fill" → `subtitle="Add a color gradient to active streak cells"`
- "Play sound on habit completion" → `subtitle="Hear a sound effect when you check off a habit"`
- "Sort Order" → `subtitle="Choose how your habits are ordered"`

**Data section (lines 149–169):**
- "Export habits & stats" → `subtitle="Download your data as a file"`
- "Archived Habits" → `subtitle="View and restore hidden habits"`

## No other files need changes
`SettingsRow.tsx` already renders subtitles correctly (13px, secondary text color, max 2 lines).

## Verification
- Open the app → Settings → confirm all 7 preference/data items show subtitles
- Check light mode, dark mode, and high contrast mode
- Verify text doesn't truncate on small screens
