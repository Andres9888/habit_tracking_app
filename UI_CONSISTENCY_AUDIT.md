# UI Consistency Audit Report

**Date:** 2026-02-03  
**Project:** ~/chainday  
**Scope:** React Native components

## Executive Summary

Found **5 major categories** of UI inconsistencies across 967 `.tsx` component files. These inconsistencies impact visual coherence and maintainability.

---

## 🔍 Findings

### 1. **Button Padding Inconsistencies** ⚠️ HIGH PRIORITY

**Issue:** Buttons use 5+ different padding combinations without clear semantic meaning.

**Examples:**

- SettingsRow: `px-4 py-4` (16px all around)
- RewardCelebrationToast buttons: `px-3 py-2.5` (12px horizontal, 10px vertical)
- NotesHeader Add button: `px-3 py-1.5` (12px horizontal, 6px vertical)
- QuickStartButton: `px-3 py-4` (12px horizontal, 16px vertical)
- NoteEditorActions Save: `px-5 py-2` (20px horizontal, 8px vertical)

**Distribution:**

- `px-4`: 101 instances
- `px-3`: 53 instances
- `px-5`: 15 instances
- `py-3`: 50 instances
- `py-2`: 49 instances
- `py-4`: 25 instances
- `py-2.5`: 12 instances
- `py-1.5`: 13 instances

**Recommendation:**
Standardize to semantic sizes:

- **Small buttons:** `px-3 py-1.5`
- **Medium buttons:** `px-4 py-2.5`
- **Large buttons:** `px-5 py-3.5`
- **Icon-only buttons:** `p-2`, `p-2.5`, or `p-3`

---

### 2. **Icon Size Inconsistencies** ⚠️ HIGH PRIORITY

**Issue:** Icons use 14 different sizes (10-48px) without clear hierarchy.

**Distribution:**

- `size={20}`: 118 instances (most common)
- `size={16}`: 116 instances
- `size={14}`: 74 instances
- `size={18}`: 68 instances
- `size={12}`: 37 instances
- `size={24}`: 20 instances
- Plus: 10, 11, 22, 28, 32, 36, 40, 48

**Recommendation:**
Standardize to t-shirt sizing:

- **XS:** 12px (badges, tight spaces)
- **SM:** 16px (inline icons, chevrons)
- **MD:** 20px (default, card icons)
- **LG:** 24px (primary actions, FAB)
- **XL:** 32px (hero sections, empty states)

---

### 3. **Border Radius Inconsistencies** ⚠️ MEDIUM PRIORITY

**Issue:** 7 different rounded variants used throughout without clear semantic distinction.

**Distribution:**

- `rounded-full`: 210 instances
- `rounded-xl`: 194 instances
- `rounded-2xl`: 125 instances
- `rounded-lg`: 70 instances
- `rounded-3xl`: 16 instances
- `rounded-md`: 5 instances
- `rounded-sm`: 3 instances

**Recommendation:**
Define semantic usage:

- `rounded-lg` (8px): Default cards, containers
- `rounded-xl` (12px): Modals, prominent cards
- `rounded-2xl` (16px): Main surfaces, dialogs
- `rounded-3xl` (24px): Special toast/celebration elements
- `rounded-full`: Pills, icon buttons, badges

Avoid: `rounded-sm`, `rounded-md` (too subtle on mobile)

---

### 4. **Stroke Width Inconsistencies** ⚠️ LOW PRIORITY

**Issue:** Icon strokeWidth varies between 1, 2, 2.25, 2.5, 2.75, 3.

**Distribution:**

- `strokeWidth={2}`: 37 instances
- `strokeWidth={2.5}`: 32 instances
- `strokeWidth={3}`: 13 instances
- `strokeWidth={2.25}`: 8 instances
- `strokeWidth={1}`: 2 instances
- `strokeWidth={2.75}`: 1 instance

**Recommendation:**
Standardize to 2 weights:

- **Regular:** `strokeWidth={2}` (default)
- **Bold:** `strokeWidth={2.5}` (primary actions, emphasis)

Remove: 1, 2.25, 2.75, 3

---

### 5. **Text Size Inconsistencies** ⚠️ MEDIUM PRIORITY

**Issue:** Many custom text sizes instead of Tailwind defaults.

**Custom sizes found:**

- `text-[10px]`: 46 instances
- `text-[13px]`: 26 instances
- `text-[15px]`: 20 instances
- `text-[17px]`: 14 instances
- Plus: 8px, 9px, 14px, 20px, 22px, 24px, 28px, 30px, 32px, 48px

**Recommendation:**
Use Tailwind standard scale:

- `text-xs` (12px) - formerly text-[10px]
- `text-sm` (14px) - formerly text-[13px]
- `text-base` (16px) - formerly text-[15px]
- `text-lg` (18px) - formerly text-[17px]
- `text-xl` (20px)
- `text-2xl` (24px)
- `text-3xl` (30px)

---

## 🎯 Action Items

### Phase 1: High Priority Fixes (This PR)

1. ✅ Standardize button padding in common components
2. ✅ Normalize icon sizes in frequently-used components
3. ✅ Consolidate strokeWidth to 2 or 2.5
4. ✅ Document standards in theme/design-system

### Phase 2: Medium Priority (Future PR)

5. ⏳ Migrate custom text sizes to Tailwind defaults
6. ⏳ Standardize border radius semantic usage
7. ⏳ Create reusable button component variants

### Phase 3: Low Priority (Backlog)

8. ⏳ Audit spacing consistency (gap, mt, mb)
9. ⏳ Color usage audit
10. ⏳ Shadow/elevation consistency

---

## 📊 Impact Analysis

**Files to modify:** 10-15 core components  
**Estimated effort:** 2-3 hours  
**Risk:** Low (visual changes only, no logic)  
**Testing:** Visual regression testing recommended

---

## 🔗 References

- Component files reviewed: 967
- Primary focus: `src/components/`, `src/features/habits/components/`
- Related: Design System, Tailwind config
