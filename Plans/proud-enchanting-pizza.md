# Plan: Extract Account Page from Settings

## Context

The Settings modal is a single scrollable view with 8 sections. Account-related items (ProfileCard at top, SignOutCard and DeleteAccountButton at bottom) are scattered across the view, separated by 5 unrelated sections. This plan introduces a dedicated Account sub-page, matching the Apple Settings pattern of "tap your name to manage account."

The existing `view` state machine already supports sub-pages (`'archived'`, `'sort'`), so adding `'account'` requires zero new infrastructure.

## Changes

### 1. Add `'account'` to view state union

**File:** `src/components/SettingsModal/SettingsModal.hooks.ts` (line 31)

```diff
- const [view, setView] = useState<'settings' | 'archived' | 'paused' | 'sort'>(
+ const [view, setView] = useState<'settings' | 'archived' | 'paused' | 'sort' | 'account'>(
```

### 2. Create `AccountRow.tsx` (new file)

**File:** `src/components/SettingsModal/AccountRow.tsx`

A compact pressable card replacing ProfileCard on the main settings page. Shows:
- 40px avatar circle (gradient or solid for high-contrast)
- User name + truncated email
- PRO badge if premium
- ChevronRight icon

Props: `{ highContrastMode, isPremium, onPress }`

Reuses: `useUser()` from Clerk, `LinearGradient`, `AnimatedPressable`, `shadows.card`, same card styling as ProfileCard. Target ~60 lines.

### 3. Create `AccountPage.tsx` (new file)

**File:** `src/components/SettingsModal/AccountPage.tsx`

Full sub-page rendered when `view === 'account'`. Layout:

```
[ScreenHeader: back + "Account" + close button]
[ScrollView]
  1. ProfileCard (reused as-is)
  2. PremiumStatus (reused - currently exported but not rendered anywhere)
  3. SignOutCard (moved from main settings bottom)
  4. DeleteAccountButton (moved from main settings bottom)
```

Props: `{ highContrastMode, isPremium, onBack, onClose, onPremiumUpsell? }`

Pattern follows SortPicker exactly:
- `ScreenHeader` with `leftAction='back'`, `rightAction={<ModalCloseButton />}`, `title='Account'`
- Uses `useAccountActions()` internally for sign out / delete handlers
- Staggered `FadeInDown` animations (delays 0, 25, 50, 75)
- `useSafeAreaInsets()` for bottom padding

Target ~80-90 lines.

### 4. Add `onOpenAccount` to `SettingsContentProps`

**File:** `src/components/SettingsModal/types.ts` (line ~86, near `onOpenSortPicker`)

```typescript
onOpenAccount: () => void;
```

### 5. Wire account view in `SettingsModal.tsx`

**File:** `src/components/SettingsModal/SettingsModal.tsx`

Add after the `view === 'sort'` block (line ~115):

```typescript
if (view === 'account') {
  return (
    <Modal ...same props as other views...>
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <AccountPage
          highContrastMode={isHighContrastActive}
          isPremium={isPremium}
          onBack={() => setView('settings')}
          onClose={handleClose}
          onPremiumUpsell={onPremiumUpsell}
        />
      </View>
    </Modal>
  );
}
```

Add `onOpenAccount={() => setView('account')}` to the `<SettingsContent>` props.

### 6. Update `SettingsContent.tsx`

**File:** `src/components/SettingsModal/SettingsContent.tsx`

- Replace `ProfileCard` import with `AccountRow` import
- Replace `<ProfileCard>` usage (line 82-84) with `<AccountRow onPress={p.onOpenAccount} ...>`
- Remove `<DeleteAccountButton>` block (lines 249-255)
- Remove `<SignOutCard>` block (lines 257-263)
- Remove unused imports: `SignOutCard`, `DeleteAccountButton` from `./sections`
- The `useAccountActions()` hook stays — it's still needed for support section (feedback, rate, share, etc.)

## File Summary

| File | Action | ~Lines |
|------|--------|--------|
| `AccountRow.tsx` | CREATE | ~60 |
| `AccountPage.tsx` | CREATE | ~85 |
| `SettingsModal.hooks.ts` | MODIFY | 1 line |
| `types.ts` | MODIFY | 1 line |
| `SettingsModal.tsx` | MODIFY | +20 lines |
| `SettingsContent.tsx` | MODIFY | -18 lines, +3 changed |

## Verification

1. **Build check:** `npx expo export --platform ios` (or `npm run lint`) passes
2. **Visual:** Open Settings modal — AccountRow shows at top with name + chevron
3. **Navigation:** Tap AccountRow → slides to Account page with back + close
4. **Account page content:** ProfileCard, PremiumStatus, SignOut, DeleteAccount all render
5. **Back button:** Returns to main settings
6. **Close button:** Dismisses entire modal
7. **Sign out / delete:** Confirmation alerts still fire, actions complete
8. **High contrast:** Both AccountRow and AccountPage respect `highContrastMode`
9. **Existing tests:** `SettingsModal.test.tsx` — run and check for failures, update selectors if needed
