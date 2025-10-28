# Story 1.8: Core Design System Foundation

**Epic:** Epic 1 - MVP Foundation
**Priority:** Medium
**Status:** 🟡 PARTIAL (colors and some components exist)
**Estimated Effort:** 35-40 hours

---

## User Story

**As a** developer
**I want to** establish reusable design components
**So that** future features maintain visual consistency

---

## Prerequisites

- Design specifications (colors, typography, spacing) - PARTIAL
- React Native project initialized ✅

---

## Acceptance Criteria

1. [ ] Design tokens file: colors (primary, secondary, success, error, background), typography (fontFamily, sizes, weights), spacing (4px grid: 4, 8, 12, 16, 24, 32, 48)
2. [ ] Reusable components: Button (primary, secondary, ghost variants), Card, Input, Typography (H1-H4, Body, Caption)
3. [ ] Theme system: Light mode implemented, dark mode prepared (theme context)
4. [ ] Consistent spacing: All layouts use 8pt grid system
5. [ ] Accessibility: Minimum contrast ratios (WCAG AA), touch targets 44x44pt minimum
6. [ ] Documentation: Storybook or component playground for design reference
7. [ ] Performance: Components optimized with React.memo where appropriate

---

## Technical Notes

**Current State:**
- ✅ Basic color palette exists (6 colors in CreateHabitModal)
- ✅ Some components exist (CreateHabitModal, HabitStrengthIndicator)
- ? Typography scale not standardized
- ? Spacing not on consistent grid
- ? No theme system
- ? No component documentation

**Implementation:**
- Styling: NativeWind (Tailwind for React Native) - already in use ✅
- Typography: SF Pro (iOS native) with fallbacks
- Color palette: Expand to 12-16 colors (greens for growth, blues for trust, neutrals)
- Icons: lucide-react-native - already in use ✅
- Testing: Visual regression tests with jest-image-snapshot

**Key Files to Create/Modify:**
- `src/theme/colors.ts` - Color tokens
- `src/theme/typography.ts` - Typography scale
- `src/theme/spacing.ts` - Spacing constants
- `src/theme/index.ts` - Theme exports
- `src/components/ui/Button.tsx` - Reusable button
- `src/components/ui/Card.tsx` - Reusable card
- `src/components/ui/Input.tsx` - Reusable input
- `src/components/ui/Typography.tsx` - Typography components
- `docs/design-system.md` - Design system documentation

---

## Testing Strategy

**Unit Tests:**
- Component prop variants render correctly
- Theme context provides correct values
- Typography components use correct styles

**Visual Tests:**
- Screenshot tests for all component variants
- Dark mode rendering
- Accessibility contrast ratios

**Manual Testing:**
- Component playground/Storybook
- Test on various screen sizes
- VoiceOver/TalkBack navigation

---

## Implementation Plan (Week 4)

### Day 16: Design System Documentation
- Document color palette (12-16 colors)
- Define typography scale
- Create spacing system (4px base)
- Document component API

### Day 17: Component Library
- Create Button component (variants)
- Create Card component
- Create Input component
- Extract common patterns

### Day 18: Dark Mode Foundation (Stretch)
- Define dark mode colors
- Implement theme provider
- Add theme toggle
- Update all components

### Day 19 & 20: QA & Polish
- Visual regression tests
- Accessibility audit
- Performance optimization
- Documentation polish

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Design tokens documented
- [ ] Component library complete (Button, Card, Input, Typography)
- [ ] Theme system implemented
- [ ] Dark mode foundation ready (stretch goal)
- [ ] Visual regression tests passing
- [ ] Accessibility tests passing (WCAG AA)
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Merged to main branch

---

## Sprint Planning

**Week:** Week 4 of Epic 1 Sprint
**Days:** Days 16-20 (Monday-Friday)
**Total Effort:** 35-40 hours
**Dependencies:** None

---

## Design Tokens Structure

```typescript
// colors.ts
export const colors = {
  primary: {
    50: '#E6F7F0',
    100: '#CCEFE1',
    500: '#10B981', // Main green
    900: '#064E3B',
  },
  secondary: {
    50: '#EFF6FF',
    500: '#3B82F6', // Main blue
    900: '#1E3A8A',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    500: '#6B7280',
    900: '#111827',
  },
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

// typography.ts
export const typography = {
  fontFamily: {
    regular: 'SF Pro Text',
    medium: 'SF Pro Text Medium',
    bold: 'SF Pro Text Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
};

// spacing.ts
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
};
```

---

## Notes

**Stretch Goals:**
- Dark mode implementation
- Storybook setup
- Animation library standardization
- Icon library expansion

**Must-Haves for MVP:**
- Consistent color palette
- Typography scale
- Basic component library
- Spacing system

---

**Created:** 2025-10-26
**Target Start:** Week 4, Day 1
**Target Complete:** Week 4, Day 5
