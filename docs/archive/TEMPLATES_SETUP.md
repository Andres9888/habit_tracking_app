# Templates Library Feature - Setup Instructions

## Phase 3 Feature: Science-Backed Habit Templates

This feature adds a Templates Library with 20 curated, evidence-based habit templates across 4 categories.

## What Was Implemented

### 1. **Convex Schema Updates** (`convex/schema.ts`)

- Added `templates` table with fields: name, description, category, icon, iconColor, frequency, scientificReference
- Added `templateUsage` table for analytics tracking
- Indexed by category for efficient filtering

### 2. **Convex Functions** (`convex/templates.ts`)

- `list()` - Query all templates or filter by category
- `getById()` - Get single template
- `seedTemplates()` - Populate database with 20 science-backed templates
- `importTemplate()` - Import template and create habit from it
- `getPopular()` - Get templates sorted by popularity score
- `getUsageStats()` - Track template import analytics

### 3. **UI Components**

#### **TemplateCard** (`src/components/TemplateCard.tsx`)

- Displays template with icon, name, description
- Shows scientific reference citation
- Category badge and popularity indicator
- Import button and preview tap handler
- Animated interactions with spring physics

#### **TemplatesScreen** (`src/screens/TemplatesScreen.tsx`)

- Category filtering (All, Morning, Health, Productivity, Mindfulness)
- Horizontal scrolling category chips
- FlatList of template cards
- Preview modal with full details
- Import flow with toast feedback
- Empty states for no templates/no results

#### **TabBar** (`src/components/TabBar.tsx`)

- 3-tab navigation: Home, Templates, Settings
- Active state indicators
- Haptic feedback on tab switch
- iOS-style design

#### **AppNavigator** (`src/components/AppNavigator.tsx`)

- Simple tab navigation wrapper
- Switches between Home (habits) and Templates screens
- Settings handled as modal

### 4. **App Integration** (`src/App.tsx`)

- Wrapped existing home screen with AppNavigator
- Added Templates tab to navigation
- Modals rendered outside navigator for proper z-index

## Templates Included (55 Total)

### Morning Routine (5 templates)

1. 5-Minute Meditation - Goyal et al. (2014)
2. Morning Pages - Cameron (1992)
3. Hydration First - Popkin et al. (2010)
4. Sunrise Viewing - Huberman (2021)
5. Delay Caffeine 90 Minutes - Huberman Lab (2023)

### Health & Fitness (5 templates)

6. 7-Minute Workout - Jordan et al. (2013) 🔥 Popular
7. 10,000 Steps - Lee et al. (2019)
8. Strength Training - Westcott (2012)
9. Stretching Routine - Behm et al. (2016)
10. No Added Sugar - Yang et al. (2014)

### Productivity (5 templates)

11. Deep Work Session - Newport (2016) 🔥 Popular
12. Pomodoro Technique - Cirillo (2006)
13. MIT (Most Important Task) - Tracy (2007)
14. Inbox Zero - Mann (2007)
15. Evening Planning - Baumeister (2011)

### Mindfulness (5 templates)

16. Gratitude Journaling - Emmons & McCullough (2003) 🔥 Popular
17. Breathwork Practice - Ma et al. (2017)
18. Evening Reflection - Kolb (1984)
19. Digital Detox Hour - Exelmans & Van den Bulck (2016)
20. Walking in Nature - Hansen et al. (2017)

### Andrew Huberman Protocols (10 templates)

21. Morning Sunlight Viewing - Huberman Lab (2023)
22. Delay Caffeine 90 Minutes - Huberman Lab (2023)
23. Zone 2 Cardio Training - Huberman Lab (2022)
24. Deliberate Cold Exposure - Huberman Lab (2023)
25. NSDR Practice - Huberman Lab (2021)
26. Physiological Sigh - Huberman Lab (2023)
27. Evening Light Dimming - Huberman Lab (2023)
28. Cool Sleep Temperature - Huberman Lab (2023)
29. Morning Protein Protocol - Huberman Lab (2023)
30. Time-Restricted Eating - Huberman Lab (2023)

### Learning & Education (5 templates)

31. Daily Reading - Bavishi et al. (2016)
32. Language Learning - Krashen (1982)
33. Learn Something New - Giurgiu et al. (2020)
34. Spaced Repetition Study - Dunlosky et al. (2013)
35. Learning Journal - Bui et al. (2013)

### Social & Relationships (5 templates)

36. Daily Connection - Holt-Lunstad et al. (2010)
37. Active Listening - Rogers & Farson (1957)
38. Express Gratitude - Algoe et al. (2010)
39. Device-Free Meals - Przybylski & Weinstein (2013)
40. Plan Quality Time - Aron et al. (2000)

### Financial Health (5 templates)

41. Track Expenses - Thaler & Sunstein (2008)
42. Budget Review - Fernbach et al. (2015)
43. Automated Savings - Thaler & Benartzi (2004) 🔥 Popular
44. Financial Education - Lusardi & Mitchell (2014)
45. No-Spend Day - Baumeister et al. (2007)

### Creativity (5 templates)

46. Daily Drawing - Kaimal et al. (2016)
47. Creative Writing - Pennebaker & Smyth (2016)
48. Idea Collection - Sawyer (2011)
49. Creative Practice - Ericsson et al. (1993)
50. Creative Inspiration - Getzels & Csikszentmihalyi (1976)

### Sleep & Recovery (5 templates)

51. Consistent Sleep Schedule - Walker (2017) 🔥 Popular
52. Cool Sleep Environment - Okamoto-Mizuno & Mizuno (2012)
53. Bedtime Routine - Irish et al. (2015)
54. Afternoon Caffeine Cutoff - Drake et al. (2013)
55. Dark Sleep Environment - Gooley et al. (2011)

## Setup Instructions

### 1. Deploy Schema Changes

```bash
# Push schema updates to Convex
npx convex deploy
```

This will create the new `templates` and `templateUsage` tables.

### 2. Seed Template Data

Option A: **Via Convex Dashboard** (Recommended)

1. Go to your Convex dashboard: https://dashboard.convex.dev
2. Navigate to your project
3. Go to "Functions" tab
4. Find `templates:seedTemplates`
5. Click "Run" (no arguments needed)
6. Verify 20 templates were created in the `templates` table

Option B: **Via Code**

```typescript
// In a React component or script
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';

const seedTemplates = useMutation(api.templates.seedTemplates);
await seedTemplates({});
```

### 3. Test the Feature

1. Run your app: `npm start`
2. Navigate to the **Templates** tab (middle tab in bottom navigation)
3. Browse templates by category
4. Tap a template card to preview details
5. Tap "Import Template" to create a habit from it
6. Verify the new habit appears in the Home tab
7. Check that the habit notes include the scientific reference

## File Changes Summary

### New Files Created

- `convex/templates.ts` - Template functions
- `src/screens/TemplatesScreen.tsx` - Templates UI
- `src/components/TemplateCard.tsx` - Template card component
- `src/components/TabBar.tsx` - Tab navigation
- `src/components/AppNavigator.tsx` - Navigation wrapper

### Modified Files

- `convex/schema.ts` - Added templates and templateUsage tables
- `src/App.tsx` - Integrated AppNavigator

### Existing Components Used

- `src/components/Modal.tsx` - Preview modal
- `src/components/Button.tsx` - Import buttons
- `src/components/EmptyState.tsx` - Empty states
- `src/components/Toast.tsx` - Success/error feedback

## UX Features Implemented

✅ Category filtering (4 categories)
✅ Horizontal scroll category chips
✅ Template cards with science references
✅ Preview modal with full details
✅ Import flow with customization options
✅ Toast feedback on import success
✅ Empty states (no templates, no results)
✅ Popularity indicators (🔥 for 90+ score)
✅ Analytics tracking (template usage)
✅ Accessibility labels and roles
✅ Haptic feedback on interactions
✅ Spring physics animations
✅ iOS-style tab bar navigation

## Future Enhancements (Optional)

- [ ] Search templates by name/description
- [ ] Filter by popularity (trending)
- [ ] User-created custom templates
- [ ] Template recommendations based on existing habits
- [ ] Share templates between users
- [ ] Template categories expansion
- [ ] Advanced customization before import (reminders, frequency)
- [ ] Template preview with habit strength projection

## Technical Notes

- Templates are seeded once via `seedTemplates()` mutation
- Import creates a new habit with template data
- Template usage is tracked in `templateUsage` table for analytics
- All templates include real scientific references
- Category filtering uses indexed queries for performance
- Modal animations use react-native-reanimated for 60fps
- Tab navigation is custom implementation (no react-navigation dependency)

## Troubleshooting

**No templates showing?**

- Run `seedTemplates()` mutation in Convex dashboard
- Check Convex logs for any errors
- Verify schema deployed successfully

**Import not working?**

- Check Convex mutation logs
- Verify habit creation permissions
- Check browser console for errors

**Tab navigation not working?**

- Verify `AppNavigator` is wrapping the app
- Check `TabBar` component is rendered
- Verify gesture handler root view is present

## Resources

- UX Specification: `/docs/ux-specification.md` (Section 2.1, 9.2)
- Convex Schema: `/convex/schema.ts`
- Templates Functions: `/convex/templates.ts`
- Templates Screen: `/src/screens/TemplatesScreen.tsx`

---

**Implementation Status**: ✅ Complete with 55 templates across 10 categories

**Categories**: Morning Routine, Health & Fitness, Productivity, Mindfulness, Andrew Huberman Protocols, Learning & Education, Social & Relationships, Financial Health, Creativity, Sleep & Recovery

**Last Updated**: 2025-10-30
