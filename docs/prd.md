# Habit Tracking App Brownfield Enhancement PRD

**Version**: 0.1
**Date**: 2025-10-10
**Enhancement**: NativeWind Styling System Migration

---

## 1. Intro Project Analysis and Context

### Analysis Source
**IDE-based fresh analysis** - Project files available and analyzed in current session

### Current Project State

**Project Name**: Habit Tracking App
**Platform**: React Native with Expo (cross-platform mobile application)

**Current Functionality**: A habit tracking application that allows users to:
- Create and manage daily habits
- Track habit completion across a 5-day rolling window
- View streak counts and progress visualization
- Reorder habits via drag-and-drop
- Access settings and archived habits

**Primary Technology Stack**:
- **Frontend**: React Native 0.81.4 + Expo 54.0.11
- **Backend**: Convex (real-time backend with React hooks)
- **Authentication**: Clerk Expo (@clerk/clerk-expo)
- **Current Styling**: React Native StyleSheet API (manual style objects)
- **Gesture Handling**: react-native-gesture-handler
- **UI Components**: Custom-built components with StyleSheet

### Available Documentation Analysis

**Status**: No existing PRD or architecture documentation found in `docs/` folder.

**Available Technical Assets**:
- ✅ Tailwind CSS config (already configured but not in use for React Native)
- ✅ Package.json with complete dependency information
- ✅ 26 TypeScript/TSX source files
- ✅ Test infrastructure (Jest with React Native Testing Library)
- ✅ Component library (Button, Card, Checkbox, custom habit components)

**Missing Documentation**:
- ❌ Tech Stack Documentation
- ❌ Source Tree/Architecture documentation
- ❌ Coding Standards
- ❌ API Documentation
- ❌ UX/UI Guidelines

### Enhancement Scope Definition

**Enhancement Type**: ✅ **Technology Stack Upgrade** (Styling System Migration)

**Enhancement Description**:
Migrate the entire application from React Native's StyleSheet API to NativeWind (Tailwind CSS for React Native). This involves converting all manual style objects to utility-first CSS classes, enabling faster UI development, better consistency, and leveraging the existing Tailwind configuration.

**Impact Assessment**: ✅ **Significant Impact (substantial existing code changes)**

**Rationale**:
- **26 source files** with StyleSheet usage need conversion
- **All components** (Button, Card, Checkbox, screens, modals) require style migration
- Existing Tailwind config suggests this was planned but not implemented
- Current hardcoded colors (#0f172a, etc.) should map to Tailwind theme tokens
- Shadow, border radius, and spacing patterns need systematic conversion

### Goals and Background Context

**Goals**:
- Migrate all components from StyleSheet API to NativeWind utility classes
- Leverage existing Tailwind configuration for design system consistency
- Improve developer experience with utility-first CSS approach
- Maintain existing visual design and behavior (no UI/UX changes)
- Enable faster future UI development with Tailwind patterns
- Reduce manual style object maintenance overhead

**Background Context**:
The application currently uses React Native's StyleSheet API extensively, with every component defining manual style objects for variants, sizes, and states. A `tailwind.config.js` exists with custom theme configuration (colors, fonts, border radius), indicating an intention to use Tailwind CSS. However, these styles are not currently utilized in the React Native codebase.

NativeWind enables Tailwind CSS utility classes in React Native by transforming them into React Native styles at build time. This migration will unify the styling approach, reduce code duplication, and make the existing Tailwind theme configuration functional across all components. The migration must preserve all existing visual characteristics while modernizing the underlying implementation.

### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial PRD | 2025-10-10 | 0.1 | Created brownfield PRD for NativeWind migration | PM Agent |

---

## 2. Requirements

### Functional Requirements

**FR1**: All existing components (Button, Card, Checkbox, and custom habit components) shall be converted from StyleSheet API to NativeWind utility classes while maintaining identical visual appearance.

**FR2**: The migration shall convert all hardcoded color values (e.g., #0f172a, #e2e8f0) to Tailwind theme tokens from the existing `tailwind.config.js`.

**FR3**: All component variants (Button: primary/secondary/success/danger/ghost, sizes: sm/md/lg) shall be implemented using conditional NativeWind classes.

**FR4**: All spacing, padding, margin, and layout styles shall be converted to Tailwind spacing utilities (p-*, m-*, gap-*, etc.).

**FR5**: All typography styles (fontSize, fontWeight, letterSpacing) shall use Tailwind text utilities (text-*, font-*, tracking-*).

**FR6**: All border and border-radius styles shall use Tailwind border utilities (border-*, rounded-*).

**FR7**: Shadow and elevation styles shall be converted to Tailwind shadow utilities while maintaining platform-specific rendering.

**FR8**: The migration shall configure NativeWind's Babel plugin and Metro bundler integration for proper class transformation.

**FR9**: All style-related props in component interfaces shall remain unchanged to maintain backward compatibility.

**FR10**: Conditional and dynamic styles (e.g., disabled states, active states) shall use NativeWind's conditional class utilities.

### Non-Functional Requirements

**NFR1**: The migration shall maintain or improve existing app performance; NativeWind class transformations must not increase bundle size by more than 5%.

**NFR2**: The migration shall be completed incrementally on a per-component basis to minimize disruption and enable testing at each step.

**NFR3**: All existing tests shall pass after migration with minimal or no modifications required to test code.

**NFR4**: The migration shall follow NativeWind best practices for React Native styling patterns.

**NFR5**: Developer experience shall improve with reduced lines of style code (target: 40-60% reduction in style definitions).

**NFR6**: Build times shall not increase by more than 10% after NativeWind integration.

**NFR7**: The codebase shall use consistent NativeWind patterns across all components for maintainability.

**NFR8**: Hot reload functionality shall continue to work seamlessly during development.

### Compatibility Requirements

**CR1: Existing Component API Compatibility** - All component prop interfaces must remain unchanged; components must accept the same props with the same TypeScript types, ensuring no breaking changes for component consumers.

**CR2: Visual Consistency Compatibility** - All UI elements must render pixel-perfect matches to their current appearance, including colors, spacing, shadows, borders, and typography; no visual regressions are acceptable.

**CR3: Platform Compatibility** - The migration must maintain support for both iOS and Android platforms, with NativeWind properly handling platform-specific style variations (e.g., shadows on Android vs iOS).

**CR4: Integration Compatibility** - The migration must maintain compatibility with existing libraries: react-native-gesture-handler (for drag-drop), Convex hooks, Clerk authentication UI, and all current npm dependencies without version changes.

**CR5: Build System Compatibility** - The NativeWind integration must work with the existing build configuration (Vite for web, Metro for mobile, Expo build system) without breaking existing scripts in package.json.

**CR6: Testing Compatibility** - All existing Jest + React Native Testing Library tests must continue to work with minimal modifications; test utilities must be able to query components styled with NativeWind classes.

---

## 3. Technical Constraints and Integration Requirements

### Existing Technology Stack

**Languages**: TypeScript 5.9.2, JavaScript (ES modules)

**Frameworks**:
- React 19.1.0
- React Native 0.81.4
- Expo 54.0.11
- Vite 6.2.0 (web dev server)

**Database**: Convex (real-time backend with subscriptions)

**Infrastructure**:
- Metro bundler (React Native)
- Expo build system (EAS)
- Convex cloud backend

**External Dependencies**:
- **Styling**: Tailwind CSS 3.x (configured but unused), clsx 2.1.1, tailwind-merge 3.1.0
- **Authentication**: @clerk/clerk-expo 2.15.4, @convex-dev/auth 0.0.90
- **UI/Gesture**: react-native-gesture-handler 2.28.0, react-native-safe-area-context 5.6.0
- **Date/Time**: date-fns 4.1.0, react-calendar 5.1.0, react-native-calendars 1.1313.0
- **Icons**: lucide-react 0.542.0, @expo/vector-icons 15.0.2
- **Testing**: Jest 30.2.0, @testing-library/react-native 13.3.3

**Current Styling Approach**: React Native StyleSheet API with manual style objects, hardcoded color values, and component-level style definitions.

### Integration Approach

**NativeWind Setup Strategy**:
- Install `nativewind` (v4 recommended for React Native 0.7+) and configure Babel plugin
- Update `babel.config.js` to include NativeWind transformer
- Configure Metro bundler to process Tailwind classes
- Update `tailwind.config.js` content paths to include React Native files
- Set up `global.css` or inline Tailwind directives for React Native

**Component Migration Strategy**:
- Phase 1: Shared UI components (Button, Card, Checkbox) - establish patterns
- Phase 2: Feature components (habit components, modals, visualizers)
- Phase 3: Screen components (App.tsx, auth screens, settings)
- Phase 4: Cleanup - remove unused StyleSheet imports and objects

**Testing Integration Strategy**:
- Tests query components by accessibility labels/roles (unaffected by style changes)
- Update snapshots if NativeWind changes rendered output structure
- Add visual regression testing checkpoint after each component migration
- Maintain existing test coverage percentage (currently has test files for key components)

**Build Integration Strategy**:
- NativeWind Babel plugin runs during Metro bundler transformation
- Vite configuration needs NativeWind plugin for web platform support
- Expo build process must include NativeWind transformations
- Verify hot reload works with NativeWind class changes

### Code Organization and Standards

**File Structure Approach**:
- Maintain current component structure in `src/components/` and `src/screens/`
- Remove StyleSheet constant blocks from component files
- Keep component logic and JSX structure unchanged
- Add `className` props alongside existing style props during transition

**Naming Conventions**:
- Use NativeWind className strings: `className="bg-slate-900 px-4 py-2 rounded-lg"`
- Conditional classes use `clsx()` utility: `clsx("base-classes", condition && "conditional-classes")`
- Complex dynamic styles may require `style` prop as fallback
- Component prop names remain unchanged (variant, size, disabled, etc.)

**Coding Standards**:
- Tailwind utility order: layout → spacing → sizing → colors → typography → effects
- Prefer Tailwind utilities over inline styles; use `style` prop only for truly dynamic values
- Extract repeated class patterns into component variants or shared constants
- Use `tailwind-merge` (already installed) to handle class conflicts in composite components
- Document platform-specific classes (e.g., `ios:shadow-lg android:elevation-4`)

**Documentation Standards**:
- Add inline comments for complex class combinations
- Document Tailwind → Design Token mappings (e.g., `bg-slate-900` = primary brand color)
- Update component documentation to show NativeWind usage examples
- Create migration guide documenting StyleSheet → NativeWind patterns used

### Deployment and Operations

**Build Process Integration**:
- NativeWind compilation happens at build time via Babel/Metro
- No runtime CSS processing required
- Web builds via Vite must use NativeWind's Vite plugin
- Expo builds automatically include Babel transformations

**Deployment Strategy**:
- Deploy incrementally as components are migrated (no big-bang release)
- Use feature flags if deploying partially migrated codebase to production
- Mobile: Use Expo EAS updates for over-the-air component updates
- Web: Standard Vite build → deploy workflow unchanged

**Monitoring and Logging**:
- Monitor bundle size metrics before/after migration (target: <5% increase)
- Track build time changes (target: <10% increase)
- Monitor app performance metrics (frame rates, memory) - should remain stable
- Log any NativeWind transformation warnings during builds

**Configuration Management**:
- `tailwind.config.js` is the single source of truth for design tokens
- Babel/Metro configurations checked into version control
- NativeWind version pinned in package.json to avoid breaking changes
- Document any platform-specific configuration requirements

### Risk Assessment and Mitigation

**Technical Risks**:
- **Risk**: NativeWind class transformations fail for complex dynamic styles
  - **Mitigation**: Fallback to inline `style` prop for truly dynamic values; test edge cases early

- **Risk**: Platform-specific style differences (iOS vs Android shadows, fonts)
  - **Mitigation**: Use NativeWind's platform modifiers; test on both platforms continuously

- **Risk**: Bundle size increases beyond acceptable threshold
  - **Mitigation**: Monitor build output; tree-shake unused Tailwind utilities; use JIT mode

- **Risk**: NativeWind incompatibility with existing libraries (gesture-handler, animations)
  - **Mitigation**: Research NativeWind compatibility before full migration; prototype critical interactions

**Integration Risks**:
- **Risk**: Breaking changes to component APIs during migration
  - **Mitigation**: Maintain existing prop interfaces; internal-only refactor approach; comprehensive testing

- **Risk**: Gesture handler or drag-drop functionality breaks with new styling
  - **Mitigation**: Test DraggableHabit component early; it's the most complex gesture-based component

- **Risk**: Convex real-time updates cause style flickering or hydration issues
  - **Mitigation**: Ensure NativeWind classes are static; avoid conditional styles based on query data

- **Risk**: Clerk authentication UI styling conflicts
  - **Mitigation**: Test auth screens thoroughly; Clerk components may need custom styling

**Deployment Risks**:
- **Risk**: Build process failures in CI/CD pipeline
  - **Mitigation**: Update CI configuration with NativeWind dependencies; test builds locally first

- **Risk**: Expo OTA updates fail with NativeWind changes
  - **Mitigation**: Test EAS Update workflow with migrated components before production release

- **Risk**: Visual regressions go unnoticed until production
  - **Mitigation**: Manual QA review of each migrated component; screenshot comparison testing

**Mitigation Strategies**:
1. **Incremental rollout**: Migrate one component at a time, test thoroughly before moving to next
2. **Automated testing**: Leverage existing Jest tests to catch prop interface changes
3. **Visual QA checkpoints**: Manual review of each component on iOS and Android after migration
4. **Rollback plan**: Git branches per component allow easy rollback if issues arise
5. **Documentation**: Maintain migration log documenting patterns and gotchas discovered

---

## 4. Epic and Story Structure

### Epic Approach

This enhancement is structured as a **single comprehensive epic** because:

1. **Unified Technical Goal**: The migration has one clear objective - convert all styling from StyleSheet API to NativeWind
2. **Sequential Dependencies**: Migration stories have natural dependencies (shared components first, then features, then screens)
3. **Consistent Integration**: All stories share the same technical constraints and setup
4. **Risk Management**: Single epic provides better visibility and control for systematic code changes
5. **Brownfield Best Practice**: Cohesive enhancements touching existing code systematically benefit from unified tracking

---

## 5. Epic 1: Migrate Styling System to NativeWind

**Epic Goal**: Convert all components from React Native StyleSheet API to NativeWind utility classes, enabling utility-first CSS development while maintaining pixel-perfect visual parity with existing UI.

**Integration Requirements**:
- Maintain existing component prop interfaces (no breaking changes)
- Preserve visual appearance across iOS and Android platforms
- Ensure all existing tests continue to pass
- Integrate NativeWind with Expo build pipeline and Metro bundler

---

### Story 1.1: Configure NativeWind Setup and Build Pipeline

As a **developer**,
I want **NativeWind configured and integrated with the build system**,
so that **I can use Tailwind utility classes in React Native components**.

#### Acceptance Criteria

1. NativeWind v4 is installed and configured in `package.json`
2. Babel configuration includes NativeWind plugin with proper transformation settings
3. Metro bundler is configured to process Tailwind classes
4. `tailwind.config.js` content paths include all React Native source files
5. A proof-of-concept component renders successfully with NativeWind classes
6. Hot reload works with NativeWind class changes
7. Build succeeds for both development and production environments
8. Expo build pipeline includes NativeWind transformations

#### Integration Verification

**IV1**: Existing components continue to render with StyleSheet API (no breaking changes during setup)
**IV2**: Development server (Expo + Metro) starts successfully with NativeWind configuration
**IV3**: Test suite runs without errors after NativeWind installation

---

### Story 1.2: Migrate Button Component to NativeWind

As a **developer**,
I want **the Button component migrated to NativeWind utilities**,
so that **it establishes the pattern for variant-based component styling**.

#### Acceptance Criteria

1. All Button variants (primary, secondary, success, danger, ghost) use NativeWind classes
2. All Button sizes (sm, md, lg) use NativeWind spacing utilities
3. Disabled state styling uses conditional NativeWind classes
4. Text styling within Button uses Tailwind typography utilities
5. Shadow and elevation styles use Tailwind shadow utilities
6. Component prop interface remains unchanged (ButtonProps identical)
7. Visual appearance is pixel-perfect match to current implementation
8. All existing Button usage across the app continues to work

#### Integration Verification

**IV1**: Existing Button instances in App.tsx and other components render identically
**IV2**: Button tests in `__tests__` pass without modification
**IV3**: Button works correctly on both iOS and Android platforms

---

### Story 1.3: Migrate Card Component to NativeWind

As a **developer**,
I want **the Card, CardHeader, and CardContent components migrated to NativeWind**,
so that **container styling patterns are established for other components**.

#### Acceptance Criteria

1. Card component uses NativeWind utilities for borders, shadows, and background
2. CardHeader uses Tailwind spacing and border utilities
3. CardContent uses Tailwind padding utilities
4. Border radius values match Tailwind theme configuration
5. Shadow styles are consistent across iOS/Android using Tailwind utilities
6. Component prop interfaces remain unchanged
7. Visual appearance matches current implementation exactly
8. All Card usage across habit components renders correctly

#### Integration Verification

**IV1**: Habit cards in App.tsx render with identical visual styling
**IV2**: CardHeader and CardContent maintain proper spacing and layout
**IV3**: Card component tests pass without modification

---

### Story 1.4: Migrate Checkbox and Switch Components to NativeWind

As a **developer**,
I want **Checkbox and Switch components migrated to NativeWind**,
so that **form control styling patterns are established**.

#### Acceptance Criteria

1. Checkbox component uses NativeWind for borders, colors, and sizing
2. Switch component uses NativeWind for track and thumb styling
3. Checked/unchecked states use conditional NativeWind classes
4. Disabled states use Tailwind opacity utilities
5. Touch target sizing uses Tailwind width/height utilities
6. Component prop interfaces remain unchanged
7. Visual appearance matches current implementation
8. Interactive states (press, hover) work correctly

#### Integration Verification

**IV1**: Settings modal controls render and function identically
**IV2**: SegmentedControl component works with migrated Switch styling
**IV3**: Form validation states render correctly with NativeWind classes

---

### Story 1.5: Migrate Habit Feature Components to NativeWind

As a **developer**,
I want **DraggableHabit, DateSelector, and habit visualization components migrated to NativeWind**,
so that **core habit tracking features use utility-first styling**.

#### Acceptance Criteria

1. DraggableHabit component uses NativeWind for card layout and styling
2. DateSelector uses Tailwind utilities for calendar grid layout
3. ChainLinkIcon and ChainLinkVisualizer use NativeWind for SVG/shape styling
4. StreakChain component uses Tailwind spacing and color utilities
5. HabitCalendarView uses NativeWind for calendar grid and day cells
6. Gesture handler interactions remain unaffected by style changes
7. Component prop interfaces remain unchanged
8. Visual appearance matches current implementation exactly

#### Integration Verification

**IV1**: Drag-and-drop habit reordering works identically with NativeWind styling
**IV2**: Date selection and calendar interactions function correctly
**IV3**: Streak visualization and chain links render with proper colors and spacing
**IV4**: Performance of gesture-based interactions remains unchanged

---

### Story 1.6: Migrate Modal Components to NativeWind

As a **developer**,
I want **SettingsModal, ArchivedHabitsModal, and HabitCalendarModal migrated to NativeWind**,
so that **overlay and modal styling patterns are established**.

#### Acceptance Criteria

1. Modal backdrop/overlay uses NativeWind for transparency and positioning
2. Modal content containers use Tailwind border, shadow, and spacing utilities
3. Modal headers and footers use NativeWind layout utilities
4. Close buttons and action buttons use migrated Button component patterns
5. Modal animations and transitions remain smooth
6. Component prop interfaces remain unchanged
7. Visual appearance matches current implementation
8. Modal z-index and layering work correctly

#### Integration Verification

**IV1**: Settings modal opens/closes with identical animation and appearance
**IV2**: Archived habits modal displays correctly with proper scrolling behavior
**IV3**: Calendar modal renders calendar view with correct styling
**IV4**: Modal interactions (touch outside to close, button actions) work identically

---

### Story 1.7: Migrate Screen Components to NativeWind

As a **developer**,
I want **App.tsx and auth screen components (WelcomeScreen, SignInScreen, SignUpScreen) migrated to NativeWind**,
so that **all top-level layouts use utility-first styling**.

#### Acceptance Criteria

1. App.tsx container, header, and layout use NativeWind utilities
2. Form inputs in App.tsx use Tailwind border, padding, and typography utilities
3. WelcomeScreen, SignInScreen, and SignUpScreen use NativeWind for layouts
4. Authentication form styling uses Tailwind utilities consistently
5. ScrollView and container styling uses NativeWind spacing utilities
6. All hardcoded colors are replaced with Tailwind theme tokens
7. Visual appearance matches current implementation exactly
8. Navigation and screen transitions remain smooth

#### Integration Verification

**IV1**: Main app screen renders with identical layout and spacing
**IV2**: Auth screens display correctly with Clerk authentication components
**IV3**: Form inputs and submission work identically on both platforms
**IV4**: Keyboard avoidance and safe area handling remain functional

---

### Story 1.8: Migrate Remaining Components and Cleanup

As a **developer**,
I want **all remaining components migrated and StyleSheet API removed**,
so that **the codebase is fully NativeWind-based with no legacy styling**.

#### Acceptance Criteria

1. SettingsDialog and any remaining components use NativeWind
2. All `StyleSheet.create()` calls are removed from the codebase
3. All `styles` constant declarations are deleted
4. All `import { StyleSheet }` statements are removed
5. Grep search for "StyleSheet" returns no results in src/
6. All hardcoded hex color values are replaced with Tailwind tokens
7. Documentation is updated with NativeWind usage guidelines
8. Migration guide documents StyleSheet → NativeWind patterns

#### Integration Verification

**IV1**: Full app navigation and interaction works identically to pre-migration
**IV2**: No visual regressions detected across all screens and components
**IV3**: All existing tests pass with no style-related failures

---

### Story 1.9: Testing, Documentation, and Performance Validation

As a **developer**,
I want **comprehensive testing and performance validation completed**,
so that **the migration is production-ready with verified quality metrics**.

#### Acceptance Criteria

1. All existing Jest tests pass with no modifications required
2. Snapshot tests are updated to reflect NativeWind class output
3. Manual QA completed on iOS simulator with no visual regressions
4. Manual QA completed on Android emulator with no visual regressions
5. Bundle size is measured and within 5% of pre-migration baseline
6. Build time is measured and within 10% of pre-migration baseline
7. App performance metrics (frame rate, memory) are unchanged
8. Migration documentation is complete and reviewed

#### Integration Verification

**IV1**: Production build succeeds with NativeWind configuration
**IV2**: Expo EAS build and deployment pipeline works correctly
**IV3**: Hot reload and developer experience improvements are validated
**IV4**: No console warnings or errors related to NativeWind transformation

---

## Timeline Estimate

- **Setup** (Story 1.1): 1-2 days
- **Core Components** (Stories 1.2-1.4): 3-4 days
- **Feature Components** (Stories 1.5-1.6): 4-5 days
- **Screens** (Story 1.7): 2-3 days
- **Cleanup & Validation** (Stories 1.8-1.9): 2-3 days
- **Total**: ~12-17 days of focused development

---

## Success Criteria

The NativeWind migration is successful when:

1. All components use NativeWind utility classes with no StyleSheet API remaining
2. Visual appearance is pixel-perfect identical to pre-migration state
3. All existing tests pass without modification
4. Performance metrics (bundle size, build time, runtime) are within acceptable thresholds
5. Developer experience is improved with reduced style code and Tailwind patterns
6. Documentation is complete for future development using NativeWind
