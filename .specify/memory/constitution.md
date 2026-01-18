<!--
Sync Impact Report (2025-10-20):
- Version change: INITIAL → 1.0.0
- Initial constitution creation for Daily Habits Tracker
- Templates status: ✅ Updated (.specify/templates/plan-template.md validated)
- Follow-up TODOs: None
-->

# Daily Habits Tracker Constitution

## Core Principles

### I. Mobile-First Development

Every feature must be designed and tested on mobile devices (iOS, Android) before web optimization. The mobile experience is the primary platform, with web serving as a complementary interface.

**Rationale**: Users track habits daily on-the-go. Mobile accessibility and native feel are critical for user retention and engagement.

**Requirements**:

- Mobile UI components must render correctly on small screens (minimum 320px width)
- Touch targets MUST be minimum 44x44pt (iOS) or 48x48dp (Android)
- Gestures MUST feel native (haptic feedback, swipe behaviors)
- Offline-first capability for core features (view habits, mark completions)

### II. Test-Driven Development (NON-NEGOTIABLE)

Tests MUST be written before implementation for all new features and bug fixes. The TDD cycle (Red-Green-Refactor) is strictly enforced.

**Rationale**: With React Native cross-platform development and real-time sync via Convex, untested code creates hard-to-debug issues across platforms.

**Requirements**:

- Write failing test first
- Implement minimum code to pass test
- Refactor with confidence
- Unit tests for business logic (Jest)
- Component tests for UI (@testing-library/react-native)
- E2E tests for critical user flows (included in /e2e/)

### III. Real-Time Sync Integrity

All habit data modifications MUST go through Convex mutations with optimistic updates. Direct state mutations are forbidden.

**Rationale**: Multi-device sync requires consistent data handling. Optimistic updates provide instant feedback while maintaining eventual consistency.

**Requirements**:

- All data writes via Convex mutations
- Optimistic UI updates for perceived performance
- Error handling with rollback on mutation failure
- Conflict resolution strategy documented per feature

### IV. Accessibility First

Every interactive element MUST be accessible to screen readers and keyboard navigation. Accessibility is not optional.

**Rationale**: Habit tracking benefits users with diverse abilities. WCAG 2.1 AA compliance ensures inclusive design.

**Requirements**:

- Semantic labels for all touchable elements
- Color contrast ratio minimum 4.5:1 for text
- Focus indicators for keyboard navigation (web)
- VoiceOver/TalkBack testing required before ship
- Accessibility tests in CI pipeline

### V. Performance Budget

Mobile app MUST maintain 60fps scrolling and <100ms interaction response times. Bundle size MUST stay under limits.

**Rationale**: Smooth performance is essential for daily-use apps. Users abandon apps that feel sluggish.

**Requirements**:

- List rendering: FlatList with proper optimization (windowSize, getItemLayout)
- Animations: Reanimated 2+ for native thread animations
- Bundle size: <5MB initial load (monitored in builds)
- Image assets: WebP format, compressed
- Performance monitoring in dev builds

### VI. User-Centric Design

Features MUST solve real user problems validated through user feedback or documented pain points. No speculative features.

**Rationale**: Habit tracking apps succeed through simplicity and focus. Feature bloat reduces retention.

**Requirements**:

- User story documentation in specs
- Design mockups or wireframes for UI changes
- User testing notes when available
- Cat-themed motivational messages maintained (brand identity)

### VII. Code Quality Standards

Code MUST pass linting, type checking, and formatting checks before commit. No exceptions.

**Rationale**: Consistent code quality prevents bugs and improves collaboration.

**Requirements**:

- TypeScript strict mode enabled
- ESLint passing (defined in eslint.config.js)
- Prettier formatting enforced
- No `any` types without explicit justification
- Git hooks validate before commit

## Platform Standards

### Mobile Platform Requirements

**iOS**:

- Minimum iOS 13+ support (Expo SDK 54 requirement)
- CocoaPods dependencies managed via `ios/Podfile`
- Apple HIG compliance for native patterns

**Android**:

- Minimum Android 6.0 (API 23) support
- Material Design 3 principles where applicable
- Gradle dependencies managed via standard Android structure

**React Native**:

- Expo managed workflow (current: SDK 54)
- No native module linking without team approval
- Hermes JavaScript engine enabled

### Backend Standards (Convex)

**Data Schema**:

- Schemas defined in `convex/schema.ts`
- Validators for all mutations and queries
- Migration strategy documented for schema changes

**Functions**:

- Queries for reads, Mutations for writes, Actions for external calls
- Error messages must be user-friendly
- Rate limiting on expensive operations

**Authentication**:

- Convex Auth integration (@convex-dev/auth)
- Secure token storage (expo-secure-store)
- Session management handled by Convex

## Development Workflow

### Branch Strategy

- `main` - production-ready code
- `gitbutler/workspace` - active development workspace (GitButler managed)
- Feature branches: descriptive names (e.g., `feature/drag-drop-reorder`)

### Review Requirements

- All PRs require passing CI checks
- Tests MUST pass (npm run test)
- Type checking MUST pass (npm run lint)
- Format checking MUST pass (npm run format:check)
- Accessibility tests MUST pass

### Testing Gates

1. **Unit Tests**: Business logic, utilities, pure functions
2. **Component Tests**: React Native components (isolation)
3. **Integration Tests**: Component + Convex backend interactions
4. **E2E Tests**: Critical user flows (mark habit, view streak)

### Deployment Process

- Development: `convex dev` for backend, `expo start` for mobile
- Preview: `convex deploy --preview` + EAS preview builds
- Production: `convex deploy --prod` + EAS production builds via `eas build --platform all`

## Governance

### Amendment Process

1. Propose change with justification (document impact)
2. Team review (if applicable) or documented reasoning
3. Update constitution version (semantic versioning)
4. Update dependent templates and documentation
5. Commit with message format: `docs: amend constitution to vX.Y.Z (summary)`

### Version Semantics

- **MAJOR**: Breaking principle changes, removed principles
- **MINOR**: New principles added, expanded guidance
- **PATCH**: Clarifications, typo fixes, non-semantic changes

### Compliance Review

- Constitution supersedes ad-hoc coding practices
- All PRs implicitly verify constitutional compliance
- Violations MUST be documented in Complexity Tracking table with justification

### Guidance References

- Runtime guidance: `README.md`, `.taskmaster/CLAUDE.md`
- Project setup: `package.json` scripts
- Testing setup: `jest.config.js`

**Version**: 1.0.0 | **Ratified**: 2025-10-20 | **Last Amended**: 2025-10-20
