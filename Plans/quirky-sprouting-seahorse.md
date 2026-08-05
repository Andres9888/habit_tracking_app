# Rename "Import Habits" to "Habit Library"

## Context
The templates screen title currently says "Import Habits" which doesn't accurately convey the purpose of the page. Renaming to "Habit Library" better describes the curated collection of habit templates.

## Changes

### 1. `src/screens/TemplatesScreen/views/MainBrowseView.tsx` (line 30)
Change `title='Import Habits'` to `title='Habit Library'`

### 2. `src/screens/TemplatesScreen/components/TemplatesLoadingState.tsx` (line 24)
Change `Import Habits` text to `Habit Library`

## Verification
- Run the app and navigate to the templates screen
- Confirm the header says "Habit Library" in both the loaded state and the loading shimmer state
