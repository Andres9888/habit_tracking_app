# Template Import Fix Specification

> Reference spec for agents fixing the "import template not working" bug.

## Problem Summary

Template import was broken due to **8 distinct bugs** across the frontend, backend, and deployment. Three were fixed in commit `bb2b4f58` (PR #409). Five additional fixes were applied in local changes.

---

## Bug 1: `customizations: undefined` crashes Convex validator (CRITICAL)

**File:** `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts`

**Root cause:** Convex's `v.optional()` validator rejects fields that are _present_ with `undefined` as a value. It expects the field to be _absent_ from the object entirely.

**Before (broken):**

```ts
const res = await o.importTemplate({
  customizations: undefined, // Convex rejects this!
  templateId: id,
});
```

**After (fixed):**

```ts
// handleDirectImport: omit customizations entirely
const res = await o.importTemplate({ templateId: id });

// handleTemplateImport: conditionally spread
const res = await o.importTemplate({
  ...(c ? { customizations: c } : {}),
  templateId: id,
});
```

**Key insight:** When calling Convex mutations, never pass `undefined` for optional fields. Omit the key instead.

---

## Bug 2: `maxOrder` calculated across ALL users (CRITICAL)

**File:** `convex/templates/importTemplate.ts`
**Fixed in:** commit `bb2b4f58`

**Root cause:** `ctx.db.query('habits').collect()` fetched every habit in the entire database to compute `maxOrder`, causing newly imported habits to get absurdly high `order` values and making the query expensive.

**Fix:** Filter by `userId` using the `by_userId` index:

```ts
const userHabits = await ctx.db
  .query('habits')
  .withIndex('by_userId', (q) => q.eq('userId', userId))
  .collect();
```

---

## Bug 3: `templateUsage` missing `userId`

**File:** `convex/templates/importTemplate.ts`
**Fixed in:** commit `bb2b4f58`

**Root cause:** The `templateUsage` insert didn't include `userId`, breaking analytics.

**Fix:** Add `userId` to the insert:

```ts
await ctx.db.insert('templateUsage', {
  habitId,
  importedAt: Date.now(),
  templateId: args.templateId,
  userId, // was missing
});
```

---

## Bug 4: `reminderTime` always set on customized imports

**File:** `src/screens/templates/TemplatePreviewModal/useTemplatePreview.ts`
**Fixed in:** commit `bb2b4f58`

**Root cause:** `customizations.reminderTime = reminderTime.toISOString()` ran unconditionally, so every customized import had `remindersEnabled: true` even when the user didn't touch the time picker.

**Fix:** Only set when `showTimePicker` is true:

```ts
if (showTimePicker) {
  customizations.reminderTime = reminderTime.toISOString();
}
```

---

## Bug 5: Nested Pressable — Import button fires card's onPress (CRITICAL UX)

**Files:** `src/components/MiniTemplateCard/MiniCardContainer.tsx`, `ImportButton.tsx`

**Root cause:** The `ImportButton` (`Pressable`) was a **child** of the card's `AnimatedPressable`. In React Native, `stopPropagation()` does NOT work like web DOM events — the responder system is fundamentally different. When the user tapped "Add", BOTH the import handler AND the card's `onPress` (which opens the preview modal) fired simultaneously.

**Initial broken fix:** `e.stopPropagation()` in ImportButton — does NOT work in React Native.

**Correct fix:** Sibling overlay pattern — move `ImportButton` outside the `AnimatedPressable`, making them siblings wrapped in a `View`:

```tsx
<View>
  <AnimatedPressable onPress={onPress}>
    {/* card content */}
  </AnimatedPressable>
  {onImport && (
    <ImportButton onImport={onImport} />  {/* sibling, not child */}
  )}
</View>
```

The `ImportButton` is absolutely positioned (`position: 'absolute', bottom: 14, right: 14`), so it visually overlaps the card but is NOT in the card's responder chain.

**Key insight:** In React Native, never nest Pressables expecting `stopPropagation()` to work. Use the "sibling overlay" pattern instead.

---

## Bug 6: `importedTemplateIds` not threaded to category view (UX)

**Files changed:**

- `src/components/CollapsibleCategorySection/CollapsibleCategorySection.tsx`
- `src/components/CollapsibleCategorySection/TemplatesList.tsx`
- `src/components/CollapsibleCategorySection/types.ts`
- `src/screens/TemplatesScreen/views/BrowseCategoriesTab.tsx`
- `src/screens/TemplatesScreen/views/BrowseView.tsx`

**Root cause:** The `importedTemplateIds` Set (managed in `TemplatesScreen.hooks.ts`) was passed to `TemplateModals` but NOT through the `BrowseView -> BrowseCategoriesTab -> CollapsibleCategorySection -> TemplatesList` chain. This meant `MiniTemplateCard` never received `isImported={true}`, so the "Added" state was never shown.

**Fix:** Thread `importedTemplateIds` prop down the full chain:

```
TemplatesScreen -> BrowseView -> BrowseCategoriesTab -> CollapsibleCategorySection -> TemplatesList -> MiniTemplateCard
```

Each component's types interface needed updating to accept the `importedTemplateIds?: Set<string>` prop.

---

## Bug 7: Missing habit validator fields (PARTIAL)

**File:** `convex/habits/validators.ts`

**Root cause:** The `fullHabitValidator` was missing fields that exist in the database schema (`vizFailureBody`, `vizFailureEmotion`, `vizFailureMind`, `vizSuccessBody`, `vizSuccessEmotion`, `vizSuccessMind`, `woopObstacle`, `woopOutcome`, `woopPlan`, `woopWish`). While not directly causing the import to fail, any query using this validator would fail for habits that had these fields populated.

**Fix:** Add all missing `v.optional(v.string())` fields to `fullHabitValidator`.

---

## Bug 8: Convex backend not deployed (CRITICAL)

**Root cause:** The Convex dev server (`npx convex dev`) was not running, so backend changes from commit `bb2b4f58` and local fixes were never deployed to the dev deployment (`valuable-guineapig-979`). The frontend was calling the OLD mutation code which had:

- No userId filter on maxOrder query
- Missing userId in templateUsage insert

**Fix:** Run `npx convex dev --once` to push functions to the dev deployment. For ongoing development, keep `npx convex dev` running in a terminal.

**Key insight:** Convex requires an explicit push (`npx convex dev` or `npx convex deploy`) — editing `.ts` files in `convex/` does NOT automatically deploy them. The dev server watches for file changes and auto-deploys, but only while running.

**Deployment URLs:**

- Dev: `https://valuable-guineapig-979.convex.cloud` (set in `.env.local`)
- Prod: `https://wandering-wolf-192.convex.cloud` (set in `.env`)

---

## Architecture: Import Flow Call Chain

```
User taps "Add" button
  -> ImportButton.onPress (sibling of card, not nested)
    -> MiniTemplateCard.onImport (guard: not importing/imported)
      -> TemplatesList.onImport(template)
        -> CollapsibleCategorySection.onImport
          -> BrowseCategoriesTab.handleTemplateImport(template._id)
            -> useTemplateImportHandlers.handleTemplateImport(id)
              -> Convex mutation: templates.importTemplate({ templateId })
                -> Backend: auth check -> get template -> compute order -> insert habit -> insert usage
              -> On success: setImportedTemplateIds(prev => new Set(prev).add(id))
              -> Show toast
```

## State Management

- **`importedTemplateIds: Set<string>`** — Tracks which templates have been imported in the current session. Managed via `useState` in `TemplatesScreen.hooks.ts`. Resets on screen remount.
- **`importingTemplateId: Id<'templates'> | null`** — Tracks the currently-importing template (shows spinner). Set to `null` in `finally` block.

## Debug Logging (Temporary)

Console warnings with `[IMPORT]` prefix have been added at these points:

- `createImportHandler` — fires when import button is tapped
- `handleTemplateImport` — fires when handler is invoked with template ID
- `handleDirectImport` — fires when direct import handler is invoked
- Each logs the mutation args and result

**Remove after verification.** Search for `[IMPORT]` to find all logging.

## Files Modified (Complete List)

| File                                                                       | Change Type                                                |
| -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `convex/templates/importTemplate.ts`                                       | Backend fix: userId filter, analytics                      |
| `convex/habits/validators.ts`                                              | Schema: missing fields                                     |
| `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts`           | Fix: remove `customizations: undefined`, add debug logging |
| `src/screens/templates/TemplatePreviewModal/useTemplatePreview.ts`         | Fix: conditional reminderTime                              |
| `src/components/MiniTemplateCard/MiniCardContainer.tsx`                    | Fix: sibling overlay pattern for ImportButton              |
| `src/components/MiniTemplateCard/ImportButton.tsx`                         | Simplify: remove broken stopPropagation                    |
| `src/components/MiniTemplateCard/usePressHandlers.ts`                      | Add debug logging                                          |
| `src/components/CollapsibleCategorySection/CollapsibleCategorySection.tsx` | Prop threading                                             |
| `src/components/CollapsibleCategorySection/TemplatesList.tsx`              | Prop threading + pass to card                              |
| `src/components/CollapsibleCategorySection/types.ts`                       | Type update                                                |
| `src/screens/TemplatesScreen/views/BrowseCategoriesTab.tsx`                | Prop threading                                             |
| `src/screens/TemplatesScreen/views/BrowseView.tsx`                         | Prop threading                                             |

## Known Remaining Issue

`BrowseAllTab` (the "View All" tab) uses `TemplateCard` (not `MiniTemplateCard`) and does not receive or pass `importedTemplateIds`. Templates imported from the "View All" tab won't show the "Added" state until the screen remounts. This is a minor UX issue, not a blocking bug.

## Verification Checklist

- [ ] Direct import from MiniTemplateCard "Add" button works
- [ ] Customized import from TemplatePreviewModal works
- [ ] Import button shows "Added" state after successful import
- [ ] Tapping import button does NOT open the preview modal
- [ ] Habit appears in the habits list with correct order
- [ ] No Convex validation errors in console
- [ ] Toast shows "Imported habit successfully"
- [ ] Convex dev deployment is up to date (`npx convex dev --once`)
- [ ] `[IMPORT]` console warnings appear when tapping Add button
- [ ] Remove `[IMPORT]` debug logging after verification
