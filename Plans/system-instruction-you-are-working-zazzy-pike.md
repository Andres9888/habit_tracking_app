# Remove PostImportSetupSheet (post-habit-add cue/why/identity option page)

## Context

After importing a habit template, the app currently opens a full-screen "Wake-Up Movement added! — Set yourself up for success in 30 seconds" sheet with three inputs (When & Where / Your Why / Your Identity) and "Save & start tracking" / "Skip — set up later" actions. The user (per the attached screenshot at `.context/attachments/image.png`) has decided this screen is unwanted and asked to remove it, including its code.

The underlying habit fields `cueAfterBehavior`, `why`, and `identity` must **remain** — they are part of the Convex `habits` schema and are consumed by other surfaces (notably `MotivationSystem/Activation/ActivationModal/*` and `HabitsModals/ActivationModalSection.tsx`). Only the post-import sheet flow is removed.

## Scope of change

### 1) Delete the sheet component (entire folder)
Directory: `src/screens/templates/PostImportSetupSheet/`
- `PostImportSetupSheet.tsx`
- `PostImportSetupSheet.types.ts`
- `SetupCard.tsx`
- `usePostImportSetup.ts`
- `index.ts`

### 2) Remove the sheet's wiring in TemplatesScreen
**`src/screens/TemplatesScreen/TemplatesScreen.tsx`**
- Remove the `PostImportSetupSheet` import (line 19).
- Remove the three state hooks: `setupHabitId`, `setupTemplate`, `showSetupSheet` (lines 28–33).
- Remove `handlePostImportSetup` (lines 35–42).
- Remove `handleCloseSetupSheet` (lines 50–54).
- Remove the `onPostImportSetup: handlePostImportSetup` argument to `useTemplatesScreenProps` (lines 44–46 → call with `()`).
- Remove both `<PostImportSetupSheet … />` render blocks (lines 139–144 and 228–233).
- Remove `Doc`/`Id` imports if they become unused after the above.

### 3) Remove the callback from the props hook
**`src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts`**
- Drop `onPostImportSetup` from `UseTemplatesScreenPropsOptions` (line 24).
- Drop `onPostImportSetup: options?.onPostImportSetup` from the handlers call (line 51).

### 4) Remove the callback from the handlers layer
**`src/screens/TemplatesScreen/TemplatesScreen.handlers.ts`**
- Remove `onPostImportSetup: opts.onPostImportSetup` from the passthrough (line 25).

**`src/screens/TemplatesScreen/TemplatesScreen.handlers.types.ts`**
- Remove the `onPostImportSetup?: …` field (line 18).

### 5) Remove the trigger in the import handlers
**`src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts`**
- Delete the two trigger blocks:
  - Lines 64–66 (inside `handleDirectImport`)
  - Lines 105–107 (inside `handleTemplateImport`)
- Remove `o.onPostImportSetup` from both dependency arrays (lines 77 and 118).
- Remove `o.previewTemplate` from the `handleDirectImport` dep array only if it becomes unused in the trimmed callback (it is no longer referenced after deleting lines 64–66, so drop it).

**`src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.types.ts`**
- Remove the `onPostImportSetup?: …` field (line 19).
- Remove unused `Doc` import if it becomes unused after the change.

## Files NOT to modify (intentionally)
- `convex/schema.ts`, `convex/habits/*` — the habit fields stay in the schema/mutations.
- `src/components/MotivationSystem/Activation/**` — independent consumer of the same fields.
- `src/features/habits/components/HabitsModals/ActivationModalSection.tsx` — independent consumer.
- Tests that reference `cueAfterBehavior` — they test the other surfaces, not this sheet.

## Verification

1. **Type check:** `npx tsc --noEmit` — no errors. Confirms all `onPostImportSetup` references are cleanly removed and no orphan imports remain.
2. **Lint on touched files:** `npx eslint src/screens/TemplatesScreen src/screens/templates` — no new warnings.
3. **Grep sanity:**
   - `grep -r "PostImportSetupSheet" src/` → 0 results.
   - `grep -r "onPostImportSetup" src/` → 0 results.
   - `grep -r "usePostImportSetup" src/` → 0 results.
4. **Runtime check (dev server):**
   - Start the app (`npm run ios` or Expo dev).
   - Open Templates screen → pick a template → tap Import (both direct-import and customize-then-import paths).
   - Expected: template imports successfully, success celebration/toast fires, fullscreen preview dismisses after ~1s, and **no setup sheet appears**.
   - Confirm no red box / console error referencing missing modules.
5. **Activation modal still works:** Open a habit that has `cueAfterBehavior`/`why`/`identity` set (or edit one) and confirm the activation modal in `MotivationSystem` still renders those values — proves schema removal was correctly avoided.

## Out of scope (explicitly)

- Removing the habit-level fields from the Convex schema.
- Refactoring/cleanup of unrelated TemplatesScreen code.
- Any i18n changes (strings are inline and gone with the files).
