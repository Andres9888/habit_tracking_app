# Habit Details — Tab Switcher Critique (Plan)

Scope: improvement pass on `DetailViewTabs` + peripheral Habit Details polish. No new deps, respect 100-line file cap, prefer surgical edits.

---

## 1. Tab switcher — weaknesses (ranked by impact)

### A. No tactile confirmation of switch (affordance / feedback)
Tabs commit instantly with no haptic, no press-scale, no ripple. On a native iOS app a segmented control without a ≤100ms tactile "tick" feels *cheap* — users tap, wonder if it registered, and tap again. Pair this with the instant old-content unmount and the perceived latency spikes. This is the single biggest quality gap.

### B. Indicator shadow tinted with accent is a mistake
`shadowColor: accentColor` on the indicator creates a faint colored halo that reads as a *bug* more than intent. The indicator is supposed to be a neutral iOS-like "lifted pill"; colored shadow fights the segmented-control mental model. In dark mode, where the indicator is `colors.card` on `colors.surface`, a tinted shadow plus a 1px halo is the kind of sloppiness that compounds.

### C. Tabs scroll out of view (discoverability/navigation)
Living inside the same `ScrollView` means: user reads strength chart → scrolls to the bottom → wants to jump to Goal → has to scroll *back up* to find the tabs. That's a gratuitous interaction tax. Sticky tabs are the canonical pattern for scrollable tabbed content. On long Calendar/Strength views this is actively bad.

### D. Active/inactive contrast on inactive tabs is weak
`text.tertiary` for inactive tab labels + medium weight + 2px stroke icons sits very close to the gray container bg in light mode — measurably fails WCAG AA in several theme combinations. Inactive tabs should still be *readable* information, not ghosts.

### E. Tab content swap is abrupt (no crossfade)
`FadeInDown` on enter + instant unmount of old = a visible *flash*. The new content is enter-animating while the user still expects the old one. A simple opacity crossfade (or `LayoutAnimation`) costs nothing and lifts perceived quality dramatically.

### F. Touch target is borderline
`py-2` (8px) + 13px label + `iconSizes.small`  → roughly 32–34pt tall. Apple HIG minimum is 44pt. On smaller phones and with gloves/one-handed use, you'll hear about this.

### G. Indicator position desyncs on first mount with fast navigation
`containerWidth` starts at 0, `indicatorStyle` returns `opacity: 0` until `onLayout` fires. If the user taps a tab before layout resolves (unlikely but possible with modal open-animation overlap), the indicator flashes in at `left: 0`. Minor but visible.

### H. No swipe-between-tabs gesture
With only 3 sibling views and a modal context, horizontal swipe is the strong expected affordance on iOS. Its absence isn't a defect but it's a missed upgrade.

### I. A11y: `tablist` without `tabpanel`
Container has `accessibilityRole='tablist'` and buttons are `tab`, but tab content has no `tabpanel` role. VoiceOver users won't get the "related panel" relationship.

---

## 2. Targeted, ship-in-hours fixes

| # | What | Why | Cost | Risk |
|---|------|-----|------|------|
| 1 | Add `triggerHaptic('tap')` on `onPress` inside `DetailViewTabButton` (gated by active-tab check — don't re-haptic on re-tap of active). | Closes the single largest quality gap. Matches TimeRangeToggle. | 15 min | None |
| 2 | Remove `shadowColor: accentColor` from the indicator — use default neutral shadow (`shadows.card` alone). | Cleaner pill, consistent with iOS segmented control. Removes "is that a bug?" read. | 5 min | None |
| 3 | Add press-scale on each tab: `Animated.View` wrapping `Pressable` content, `scale: withSpring(pressed ? 0.96 : 1, springs.standard)`. | Completes the tap feedback loop; consistent with `TimeRangeToggle`. | 30 min | Must respect `useReduceMotion()`. |
| 4 | Strengthen inactive label color from `text.tertiary` → `text.secondary`, bump inactive weight `medium → medium` but raise base size `13 → 14`. | Fixes AA contrast + readability. Active tab still wins via color + semibold. | 15 min | Verify against both themes; no layout shift because container padding absorbs 1pt. |
| 5 | Raise tap target: `py-2 → py-2.5` (10pt) and add `hitSlop={{ top: 6, bottom: 6 }}` on the Pressable. | Closer to 44pt HIG. No visual change. | 5 min | None. |
| 6 | Crossfade tab content: wrap the three conditional blocks in a single keyed `Animated.View` using `entering={FadeIn.duration(180)}` with `exiting={FadeOut.duration(120)}`, keyed on `activeView`. | Removes content flash; makes the switcher feel *produced*. | 45 min | `FadeOut` needs parent not to unmount the tree — since they're siblings in the same ScrollView, this works. Test with `ErrorBoundary` around Strength. |
| 7 | Add `role='tabpanel'` + `accessibilityLabel={`${label} view`}` wrapper on each active content block. | Closes a11y gap. | 15 min | None. |
| 8 | Skip first-mount spring: `indicatorX.value = activeIndex` (no spring) when `containerWidth` first transitions from 0 → positive; use spring only on subsequent changes. | Prevents left-flash on initial render. | 20 min | Track with a `hasMounted` ref. |

**Total for A-list (1–8): ~2.5 hrs. All land in `DetailViewTabs.tsx` + `DetailViewTabButton.tsx` + `HabitDetailContent.tsx`.**

---

## 3. Bigger bets (hours-to-days)

### Sticky tabs (strongly recommended)
Split content so the ScrollView is *inside* each tab's panel and the tab bar lives above, sticky. Pattern:
```
<View flex-1>
  <DetailHero />           // outside scroll
  <DetailViewTabs />       // sticky, outside scroll
  <AnimatedSwitcher activeView={activeView}>
    <ScrollView key="calendar" />
    <ScrollView key="strength" />
    <ScrollView key="goal" />
  </AnimatedSwitcher>
</View>
```
**Why it matters**: tabs stay reachable, each tab remembers its own scroll position (huge for Strength's long chart + Goal's anchor section), removes the "scroll back up to switch" tax.  
**Cost**: ~4–6 hrs (restructure `HabitDetailContent.tsx`, preserve `scrollTo(0)` semantics as optional, verify the modal's parent gesture doesn't fight it).  
**Risk**: Three ScrollViews means higher memory/mount cost; gate Strength mount behind `activeView === 'strength'` (already conditional today — keep it).

### Swipe between tabs
`react-native-gesture-handler` is already installed (verify). A `PagerView`-like `Animated.ScrollView horizontal pagingEnabled` with the indicator driven by scroll offset gives you a synchronized swipe + indicator transition. That's the Apple-native feel.  
**Cost**: ~1 day if paired with sticky tabs. Don't do it as a standalone — it only pays off after sticky.  
**Risk**: Horizontal swipe can collide with the modal's slide-down-to-close gesture; needs careful gesture prioritization.

### Shared-element indicator → icon color transition
Drive icon color + label weight off a single `derivedValue(indicatorX)` so they interpolate as the pill slides, instead of snapping at state commit. Makes the whole thing feel like *one* motion instead of three.  
**Cost**: ~2 hrs. Highest craft-per-hour ratio after the A-list.

---

## 4. Broader Habit Details page — only what's meaningful

1. **DetailHero stats strip — visual hierarchy.** Three inline stats (completions, days, streak) with equal weight dilutes the signal. The *streak* is the emotional hook in habit apps. Give it dominance: larger numeral, accent-tinted background pill, the other two in `text.secondary`. *(~1 hr. Risk: don't bloat hero — keep vertical rhythm.)*

2. **Strength tab loading cost.** `AnimatedCard` + `HabitStrengthSection` mount is expensive and causes a visible hiccup on first switch. Add a skeleton (matching the card's shape) during mount — reuse existing `SkeletonLoader` if present. *(~1 hr. Risk: skeleton must not flash on already-warm mounts — use a 100ms delay.)*

3. **Modal close affordance.** `Edit Habit` in the top-right is a destination button but the close is a plain X. Pair the close with a thin drag handle at the top edge of the modal sheet — reinforces "this is dismissible by swipe." *(~30 min. Risk: only add if the modal already supports swipe-to-close.)*

4. **Goal tab empty state.** If `GoalTabEmptyState` is shown, the tab bar above it looks stranded. Reduce the top margin on empty and add a subtle illustrative anchor. *(Check in code before spending time.)*

---

## 5. Prioritized top-5 to tackle first

1. **Haptic tap feedback on tab press.** 15 min. The missing *tick*. Ship today.
2. **Remove accent-tinted indicator shadow; use neutral `shadows.card` only.** 5 min. Stops the halo read.
3. **Raise inactive label contrast (`text.tertiary` → `text.secondary`) + raise label size 13 → 14 + bump `py-2` → `py-2.5` + `hitSlop`.** 20 min bundle. Fixes a11y + HIG in one pass.
4. **Crossfade tab content (FadeIn 180 / FadeOut 120, keyed on `activeView`).** 45 min. Removes the flash — biggest perceived-quality lift per hour.
5. **Sticky tabs (restructure ScrollView ownership).** ~½ day. The one *structural* bet worth making before any other redesign work.

Everything else (swipe, shared-element, hero redesign) should wait on user data from these five. Ship the A-list, see if the complaint volume drops, then earn the bigger bets.

---

## Files to edit

- `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx`
- `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx`
- `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx`

Keep each ≤100 lines. If the crossfade wrapper pushes `HabitDetailContent` over, extract a `DetailTabPanel.tsx` that takes `activeView` + `children` and owns the enter/exit animation.
