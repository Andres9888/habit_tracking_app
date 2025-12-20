# Phase 07: Architecture Documentation

This phase creates a unified architecture document that ties together the tech stack, component patterns, and system design. Currently, technical details are scattered across multiple files. A single architecture reference accelerates onboarding and maintains consistency.

## Tasks

- [ ] Create `docs/specs/architecture/ARCHITECTURE.md` as the canonical technical reference document
- [ ] Document the tech stack with versions: React Native 0.81.5, Expo 54, Convex 1.21, Clerk Auth, NativeWind, React Native Paper, Reanimated 4.1
- [ ] Add system architecture diagram section (ASCII) showing: Mobile App ↔ Convex Backend ↔ Clerk Auth
- [ ] Document the component architecture pattern: Feature folders with co-located hooks, tests, and styles
- [ ] Define the hook extraction pattern for `useComponentNameLogic.ts` with example structure and naming conventions
- [ ] Document Convex data model: habits table schema, user preferences, completion records, streak calculations
- [ ] Add state management section: Convex reactivity for server state, local state for UI, no Redux/Zustand
- [ ] Document the styling approach: NativeWind utility classes, design tokens from figma-design-tokens.json, dark mode support
- [ ] Add navigation architecture: Expo Router file-based routing, screen hierarchy, deep linking support
- [ ] Document error handling patterns: try-catch in hooks, error boundaries in components, toast notifications
- [ ] Add performance guidelines: lazy loading, memoization patterns, animation performance with Reanimated
- [ ] Link architecture decisions to relevant stories and PRD sections
