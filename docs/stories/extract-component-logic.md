# Extract Component Logic to Custom Hooks - Brownfield Refactoring

## User Story

As a **developer**,
I want **all component business logic extracted to custom hooks in co-located `hooks.ts` files**,
So that **components are purely presentational, testable, and follow consistent React patterns**.

---

## Story Context

**Existing System Integration:**

- **Integrates with:** All React Native components in `src/components/`
- **Technology:** React 19, React Native, TypeScript, Expo, React Hooks
- **Follows pattern:** Standard React custom hooks pattern (`use*` prefix)
- **Touch points:** ~16 components with varying levels of logic complexity

**Current State:**

- Components have mixed concerns (presentation + logic)
- Examples: `SettingsModal` has state management and handlers, `DraggableHabit` has utility functions
- No consistent pattern for logic extraction

**Target State:**

- Each component with logic gets a co-located `hooks.ts` file (e.g., `SettingsModal.tsx` → `SettingsModal.hooks.ts`)
- Hook named `useComponentNameLogic` (e.g., `useSettingsModalLogic`)
- Components import and use the hook, remain purely presentational

---

## Acceptance Criteria

**Functional Requirements:**

1. **Hook File Structure:** Each component with business logic has a co-located `ComponentName.hooks.ts` file at the same directory level
2. **Hook Naming:** Hook function named `useComponentNameLogic` (e.g., `useSettingsModalLogic`, `useDraggableHabitLogic`)
3. **Logic Extraction:** All state management, event handlers, side effects, and utility functions extracted to the hook

**Integration Requirements:**

4. Existing component functionality continues to work unchanged (no behavioral changes)
5. Component props interface remains identical (external API unchanged)
6. Hooks follow React hooks rules (can use other hooks like `useState`, `useEffect`, Clerk hooks, etc.)

**Quality Requirements:**

7. All components pass existing tests (if any) or manual testing confirms no regressions
8. TypeScript types for hook return values are properly defined
9. Simple presentational components (e.g., `Button`, `Card`, `Checkbox`) are evaluated but may not require extraction if logic is minimal

---

## Technical Notes

**Components to Prioritize (with logic to extract):**

- `SettingsModal.tsx` → `SettingsModal.hooks.ts` with `useSettingsModalLogic`
- `DraggableHabit.tsx` → `DraggableHabit.hooks.ts` with `useDraggableHabitLogic`
- `HabitCalendarView.tsx` (if has state/logic)
- `ArchivedHabitsModal.tsx` (if has state/logic)
- Any other components with `useState`, `useEffect`, or event handlers

**Example Pattern:**

```typescript
// SettingsModal.hooks.ts
export const useSettingsModalLogic = (props: { visible: boolean; onClose: () => void }) => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [view, setView] = useState<'settings' | 'archived'>('settings');

  const handleClose = () => {
    props.onClose();
    setTimeout(() => setView('settings'), 300);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { user, view, setView, handleClose, handleSignOut };
};

// SettingsModal.tsx
export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { user, view, setView, handleClose, handleSignOut } = useSettingsModalLogic({ visible, onClose });

  return (/* JSX remains unchanged */)
}
```

**Integration Approach:**

- Refactor component-by-component
- Test each component after extraction
- Skip components with minimal/no logic (pure presentational components)

**Key Constraints:**

- Must maintain 100% backward compatibility
- No changes to component external API (props)
- Follow existing TypeScript patterns in the codebase

---

## Definition of Done

- [x] All components with business logic have co-located `ComponentName.hooks.ts` files
- [x] All hooks follow naming convention `useComponentNameLogic`
- [x] All state, handlers, and side effects extracted from component files
- [x] Components are purely presentational (only JSX, styling, and hook consumption)
- [x] Existing functionality regression tested (manual or automated)
- [x] TypeScript compiles without errors
- [x] Code follows existing project patterns and standards
- [x] Simple presentational components evaluated (documented if skipped)

## Extraction Summary

**Components with logic extracted (7 total):**

1. ✅ SettingsModal → SettingsModal.hooks.ts
2. ✅ ArchivedHabitsModal → ArchivedHabitsModal.hooks.ts
3. ✅ HabitCalendarView → HabitCalendarView.hooks.ts
4. ✅ DraggableHabit → DraggableHabit.hooks.ts
5. ✅ HabitChainVisualizer → HabitChainVisualizer.hooks.ts
6. ✅ DateSelector → DateSelector.hooks.ts
7. ✅ StreakChain → StreakChain.hooks.ts

**Purely presentational (no extraction needed - 9 total):**

- Button (style constants only)
- Card (layout component)
- Checkbox (controlled component)
- Switch (controlled component)
- ChainLinkIcon (icon wrapper)
- ChainLinkVisualizer (presentational)
- HabitCalendarModal (minimal logic)
- SegmentedControl (controlled component)
- NativeWindTest (test component)

## Validation Results

- ✅ TypeScript compilation: PASSED (no errors)
- ✅ Test suite: 70/70 tests PASSED
- ✅ All components maintain backward compatibility
- ✅ No breaking changes to component APIs

---

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Introducing bugs during logic extraction, breaking component behavior
- **Mitigation:** Test each component thoroughly after extraction; extract one component at a time
- **Rollback:** Git revert individual component files if issues arise

**Compatibility Verification:**

- [x] No breaking changes to component props/API (external interface unchanged)
- [x] No database changes (pure frontend refactoring)
- [x] UI behavior follows existing patterns (no visual changes)
- [x] Performance impact is negligible (same logic, different organization)

---

## Scope Note

This story covers ~16 components. If during implementation you find:

- Significant design decisions needed per component
- More than 4 hours of focused work required
- Complex logic that needs careful architectural consideration

**Consider escalating to:** Create an epic to break this into multiple coordinated stories (e.g., by component type: modals, UI components, visualizers).

---

## Validation Checklist

**Scope Validation:**

- [ ] Story targets all components but prioritizes those with actual logic
- [ ] Integration approach is straightforward (standard hooks pattern)
- [ ] Follows existing React patterns (custom hooks are well-established)
- [x] No new design or architecture required (applying existing pattern)

**Clarity Check:**

- [x] Story requirements are unambiguous (clear naming, structure, extraction rules)
- [x] Integration points clearly specified (co-located hooks, named exports)
- [x] Success criteria are testable (DoD checklist)
- [x] Rollback approach is simple (git revert per component)
