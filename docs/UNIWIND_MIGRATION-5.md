# Uniwind Migration - Phase 5: Testing & Validation

> **Focus**: Comprehensive testing across all platforms
> **Platforms**: iOS, Android, Web

## Phase 5 Tasks: Testing & Validation

### 5.1 Clear All Caches

- [ ] Perform a complete cache clear:
```bash
# Remove node_modules and reinstall
rm -rf node_modules
rm -rf package-lock.json
npm install

# Clear Metro cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

# Clear Expo cache
npx expo start --clear
```

### 5.2 Web Platform Testing

- [ ] Start development server:
```bash
npm run dev:frontend
```

- [ ] Verify in browser:
  - [ ] App loads without console errors
  - [ ] Background color matches theme (`--background`)
  - [ ] Text colors render correctly
  - [ ] Custom fonts (Inter) load properly
  - [ ] All habit cards display correctly
  - [ ] Date selector works
  - [ ] Settings modal opens and closes
  - [ ] Add habit form works
  - [ ] High contrast mode toggle works

### 5.3 iOS Platform Testing

- [ ] Start iOS simulator:
```bash
npm run expo:ios
```

- [ ] Verify on iOS:
  - [ ] App launches without crash
  - [ ] Splash screen displays
  - [ ] Main UI renders with correct colors
  - [ ] Touch interactions work (habit toggle, navigation)
  - [ ] Gestures work (swipe to archive)
  - [ ] Safe areas respected (notch, home indicator)
  - [ ] Keyboard appears/dismisses correctly
  - [ ] Haptic feedback still works

### 5.4 Android Platform Testing

- [ ] Start Android emulator:
```bash
npm run expo:android
```

- [ ] Verify on Android:
  - [ ] App launches without crash
  - [ ] Main UI renders correctly
  - [ ] Touch interactions work
  - [ ] Back button behavior correct
  - [ ] System navigation areas respected

### 5.5 Visual Regression Testing

- [ ] Compare screenshots before/after migration:

**Key screens to capture:**
1. Home screen with habits
2. Empty state (no habits)
3. Add habit form
4. Settings modal
5. High contrast mode
6. Character screen
7. Habit detail screen (if applicable)

### 5.6 Specific Component Testing

- [ ] **BinaryHeatmap Component**
  - [ ] Calendar grid renders correctly
  - [ ] Colors match theme
  - [ ] Tap interactions work
  - [ ] Month navigation works

- [ ] **DateSelector**
  - [ ] Week view displays correctly
  - [ ] Current day highlighted
  - [ ] Navigation arrows work

- [ ] **DraggableHabit**
  - [ ] Drag and drop works
  - [ ] Swipe to archive works
  - [ ] Toggle completion works
  - [ ] Streak counter displays

- [ ] **SettingsModal**
  - [ ] Modal opens/closes
  - [ ] Toggle switches work
  - [ ] High contrast mode applies globally

### 5.7 Run Existing Tests

- [ ] Run unit tests:
```bash
npm test
```

- [ ] Check for any test failures related to:
  - NativeWind mocks
  - CSS class assertions
  - Snapshot differences

### 5.8 Build Verification

- [ ] Verify production build for web:
```bash
npm run lint
```

- [ ] Check for TypeScript errors:
```bash
npx tsc --noEmit
```

### 5.9 Performance Validation

- [ ] Check bundle size hasn't increased significantly:
```bash
npx expo export --platform web
# Compare bundle sizes before/after
```

- [ ] Verify no performance regressions:
  - Initial load time
  - Scroll performance
  - Animation smoothness

### 5.10 Edge Cases

- [ ] Test these edge cases:
  - [ ] Empty habits list
  - [ ] Very long habit names
  - [ ] Many habits (10+)
  - [ ] Rapid toggling of habits
  - [ ] Quick settings toggle on/off
  - [ ] Screen rotation (if supported)

## Migration Completion Checklist

### Core Functionality
- [ ] Habits display correctly
- [ ] Habit completion toggle works
- [ ] Habit creation works
- [ ] Habit archival works
- [ ] Date navigation works
- [ ] Settings persist correctly

### Styling
- [ ] All colors match original design
- [ ] Typography is correct
- [ ] Spacing is consistent
- [ ] Shadows and elevations work
- [ ] Border radius correct

### Platform-Specific
- [ ] iOS safe areas handled
- [ ] Android status bar correct
- [ ] Web responsive design works

### Developer Experience
- [ ] Hot reload works
- [ ] Console has no errors/warnings
- [ ] Source maps work for debugging

## Rollback Procedure

If critical issues are found:

```bash
# Option 1: Revert to main branch
git checkout main

# Option 2: Revert specific commits
git revert HEAD~<n>

# Option 3: Restore from pre-migration backup
git stash
git checkout pre-uniwind-backup
```

## Post-Migration Cleanup

After successful validation:

- [ ] Delete migration planning documents (optional)
- [ ] Update README if needed
- [ ] Document any workarounds applied
- [ ] Create PR for review
- [ ] Merge to main branch

## Success Criteria

The migration is complete when:
1. ✅ App runs on all three platforms (iOS, Android, Web)
2. ✅ No visual regressions from before migration
3. ✅ All existing tests pass
4. ✅ No console errors or warnings
5. ✅ Production build succeeds

---
**Previous Phase**: [UNIWIND_MIGRATION-4.md](./UNIWIND_MIGRATION-4.md) - Code Updates

## Migration Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Package Updates | ⬜ |
| 2 | Config Migration | ⬜ |
| 3 | Theme Conversion | ⬜ |
| 4 | Code Updates | ⬜ |
| 5 | Testing & Validation | ⬜ |

**Total Estimated Changes:**
- 5 config files modified
- 1-2 source files modified (App.tsx, potentially utils)
- 187 files with className usage (should work without changes)
