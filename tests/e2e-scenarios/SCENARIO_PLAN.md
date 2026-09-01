# Chain Day — Whole‑App E2E UI Scenario Plan

End‑to‑end UI scenarios covering every major capability of the Chain Day habit
tracker. Each scenario is documented here **and** backed by an executable test
that renders a real screen through the real provider stack and drives it the way
a user would.

- **System under test:** the running React Native / Expo app (real screens,
  navigation state, hooks and handlers). The Convex backend and native device
  modules are mocked; everything in `src/` runs for real.
- **Test layer:** `@testing-library/react-native` (RNTL) screen‑level rendering.
  This is the highest‑fidelity layer that runs headlessly in CI / this container
  (device‑level Detox/Maestro needs a simulator). The right‑hand “Device layer”
  column maps each scenario to the gesture a Detox/Maestro flow would perform.
- **Executable suite:** `tests/e2e-scenarios/*.scenario.tsx`
- **Run:** `npm run test:scenarios`

## Evaluation method

Binary **pass/fail** per scenario, judged against criteria fixed _before_
implementation. A scenario passes only when, under the standard conditions
below, every listed success criterion holds.

**Standard conditions (identical for every run):**

- Provider stack: `SafeAreaProvider → ThemeColorProvider → LazyProviders`
  (`tests/e2e-scenarios/harness.tsx`).
- Backend: Convex `useQuery` is dispatched per function name from realistic
  factories (`makeHabit`, `makeTracking`, `makeSettings`, `makeTemplate`,
  `makeAnalyticsDashboard` — the last built from the **real** `convex/analytics*`
  compute functions). Mutations are stable spies asserted by name.
- Auth: a fully signed‑in Clerk user; premium defaults to _off_ (RevenueCat
  reports no entitlement) unless a scenario mocks it on.
- Native modules (audio, charts, blur, gradients, pickers, sharing, Sentry,
  purchases) are mocked in `tests/e2e-scenarios/setup.scenarios.js`.

**Quality bar:** 100% of scenarios pass. Any failure is root‑caused and fixed at
source (test harness or product), the affected scenario is re‑run, then the full
set is re‑run.

## Scenario matrix

| ID  | Capability                    | Surface (real screen) | Gherkin (Given/When/Then)                                                                                                                          | Success criteria                                                                         | Device layer (Detox/Maestro)                     | Test                     | Result  |
| --- | ----------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------ | ------- |
| S01 | Authentication entry          | `WelcomeScreen`       | Given a signed‑out user **When** the welcome screen loads **Then** the brand promise and both OAuth options show and a provider button is tappable | tagline + “Continue with Apple/Google” render; Apple button press throws nothing         | Launch app signed‑out; tap “Continue with Apple” | `01-auth-onboarding`     | ✅ PASS |
| S02 | Onboarding                    | `OnboardingFlowV2`    | Given a first‑time user **When** onboarding opens **Then** the first step shows a begin affordance that responds to tap                            | “Tap to begin” renders; tap advances without error                                       | Tap through onboarding steps                     | `01-auth-onboarding`     | ✅ PASS |
| S03 | View habits + week strip      | `HabitsApp`           | Given a user with a habit **When** the home screen loads **Then** the habit, today, and week nav render                                            | habit name, “Today”, “Open settings”, “Previous week” present                            | Observe home screen                              | `02-habits-core`         | ✅ PASS |
| S04 | Complete a habit              | `HabitsApp`           | Given the home screen **When** a habit’s day cell is tapped **Then** completion toggles                                                            | `habits:toggleHabit` mutation called                                                     | Tap a day ring                                   | `02-habits-core`         | ✅ PASS |
| S05 | Week navigation               | `HabitsApp`           | Given the home screen **When** “Previous week” is tapped **Then** the list stays healthy                                                           | list still rendered; no error boundary                                                   | Swipe / tap previous week                        | `02-habits-core`         | ✅ PASS |
| S06 | Create a habit                | `HabitsApp`           | Given the home screen **When** “Add new habit” is tapped **Then** the create surface opens                                                         | create modal (“New Habit”) appears                                                       | Tap FAB → create modal                           | `02-habits-core`         | ✅ PASS |
| S07 | Habit detail action + record  | `HabitDetailScreen`   | Given a habit **When** detail opens **Then** today's action, strength snapshot, and record routes render                                           | “Complete today”, strength progress, History, and Analytics present                      | Tap habit card                                   | `03-habit-detail`        | ✅ PASS |
| S08 | Complete from detail          | `HabitDetailScreen`   | Given habit detail **When** “Complete today” is tapped **Then** completion toggles                                                                 | `habits:toggleHabit` called                                                              | Tap “Complete today”                             | `03-habit-detail`        | ✅ PASS |
| S09 | Edit a habit                  | `HabitDetailScreen`   | Given habit detail **When** “Edit habit” is tapped **Then** the edit handler fires                                                                 | `onEdit` invoked                                                                         | Tap “Edit”                                       | `03-habit-detail`        | ✅ PASS |
| S10 | Streak goal                   | `HabitEditScreen`     | Given habit editing **When** More to customize opens **Then** the recommended streak-goal preset renders                                           | 7-day “STARTER” goal present                                                             | Edit habit → More to customize                   | `03-habit-detail`        | ✅ PASS |
| S11 | Character / gamification      | `CharacterScreen`     | Given a user with habits **When** the character screen loads **Then** level, attributes and achievements render                                    | “Character”, “Experience”, “Attributes”, “Vitality”, “Recent Achievements” present       | Open character screen                            | `04-character`           | ✅ PASS |
| S12 | Analytics dashboard (premium) | `AnalyticsScreen`     | Given a premium user **When** analytics opens **Then** the dashboard (not the paywall) renders                                                     | strength donut renders; no paywall; no error                                             | Open analytics (premium)                         | `06-analytics-dashboard` | ✅ PASS |
| S13 | Subscription paywall (free)   | `AnalyticsScreen`     | Given a free user **When** analytics opens **Then** the premium upsell + trial CTA render and the CTA is tappable                                  | paywall heading, a benefit row, `paywall-start-trial-button` present; tap throws nothing | Open analytics (free) → tap trial                | `05-analytics-paywall`   | ✅ PASS |
| S14 | Templates browse & apply      | `TemplatesScreen`     | Given the template library **When** “Add <template>” is tapped **Then** the template is applied                                                    | library + template render; `templates:importTemplate` called                             | Open templates → tap Add                         | `07-templates`           | ✅ PASS |
| S15 | Settings (theme + sections)   | `SettingsModal`       | Given settings open **When** theme is set to Dark **Then** the change persists                                                                     | Settings/Look & Feel/Reminders render; `settings:update` called                          | Open settings → toggle theme                     | `08-settings`            | ✅ PASS |
| S16 | Offline support               | `HabitsApp`           | Given no connectivity **When** the home screen loads **Then** the offline indicator is visible                                                     | `habits-offline-indicator` visible                                                       | Toggle airplane mode                             | `09-offline`             | ✅ PASS |

**Latest full run:** 9 suites / 18 tests passing (`npm run test:scenarios`).

## How to run

```bash
npm run test:scenarios            # whole suite
npx jest -c tests/e2e-scenarios/jest.scenarios.config.cjs 03-habit-detail   # one file
```

The suite uses a dedicated config (`jest.scenarios.config.cjs`) so it never
interferes with `npm test`. Scenario files are named `*.scenario.tsx` (no
`.test.`) precisely so the root jest config does not pick them up without the
extra native mocks they require.

## Harness notes (why this is faithful, and what is mocked)

- **Real product code runs.** Screens, navigation state, hooks, handlers,
  error boundaries and the provider stack are the production ones.
- **Per‑query Convex dispatch.** `useQuery(ref)` is resolved by
  `getFunctionName(ref)`, so one render feeds realistic, query‑specific data to
  many calls; mutations are stable spies asserted by name.
- **Analytics fidelity.** The dashboard payload is produced by the real
  `convex/analytics{Overview,Distribution,Trend,Compliance,Weekly}` functions,
  so the screen receives exactly the shapes it reads.
- **Scoped to this suite.** A dedicated `transform` rewrites dynamic `import()`
  → `require()` so `React.lazy()` overlays load under jest’s CJS runtime; native
  modules are mocked in `setup.scenarios.js`. None of this touches the app build,
  metro, or the existing jest suite.

## Iteration log (root causes found and fixed)

The suite was driven to green by fixing causes, not symptoms:

1. **Incomplete shared reanimated mock** — added `makeMutable`, `ReduceMotion`,
   `ReducedMotionConfig`, `useAnimatedProps`, `getUseOfValueInStyleWarning`,
   `FadeOut/InLeft/Right` to `jest.setup.js` (additive).
2. **`useDerivedValue` ran its worklet during render**, so hooks that bridge an
   animated value to React state via `runOnJS(setState)` infinite‑looped. The
   real worklet runs on the UI thread; the scenario setup overrides it to not
   invoke the callback.
3. **Missing `ScaleDecorator`/`useConvex`/Clerk `useAuth`/`useSSO`/`useClerk`**
   in the base mocks — added so full screens mount past the auth gate.
4. **`React.lazy(() => import())` overlays** crashed jest’s CJS runtime — added a
   suite‑scoped babel transform of `import()`→`require()`.
5. **RevenueCat `usePremiumData` retry timers** leaked across tests — mocked
   `src/lib/purchases` so premium resolves with no pending timers.
6. **victory‑native v41 API** — mocked `CartesianChart` (function‑child render
   prop) and `Pie.Chart` so the analytics dashboard renders.
7. **expo‑notifications response listeners** missing from the base mock — added.
8. **React Native 0.86 removed its old asset-transformer path** — scenario
   transforms now inherit from the installed `jest-expo` preset, and
   `check:tooling` verifies every configured transformer resolves.
9. **Scenario copy drifted behind later UI work** — aligned detail actions,
   streak-goal location, Habit library heading, and Settings section names with
   the current product surfaces.

All scenarios meet the original quality bar.
