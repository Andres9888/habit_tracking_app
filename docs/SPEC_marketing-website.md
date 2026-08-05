# Marketing Website Specification

## Project: Daily Habits Marketing Site

**Target Repo:** `/Users/andres/Code/habit_app_website`
**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
**Reference:** [HabitKit](https://habitkit.app)
**Deployment:** Vercel (recommended)

---

## Quick Start Commands

```bash
# 1. Navigate to parent folder
cd /Users/andres/Code

# 2. Create Next.js project
npx create-next-app@latest habit_app_website \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# 3. Enter project
cd habit_app_website

# 4. Install additional dependencies
npm install framer-motion lucide-react @vercel/analytics

# 5. Optional: Add shadcn/ui for components
npx shadcn@latest init
```

---

## Site Architecture

### Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page (hero, features, testimonials, CTA) |
| `/features` | Detailed feature breakdown with visuals |
| `/pricing` | Free vs Pro comparison |
| `/blog` | SEO content (habit tips, updates) - optional Phase 2 |
| `/changelog` | App updates and new features |
| `/privacy` | Privacy Policy (required for App Store) |
| `/terms` | Terms of Service |
| `/press` | Press kit with logos, screenshots, description |
| `/contact` | Contact form or email link |

---

## Landing Page Structure

### 1. Hero Section

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              [App Icon]                                     │
│                                                             │
│         Build Habits That Stick                             │
│                                                             │
│   Track your daily habits with beautiful chain              │
│   visualizations and watch your streaks grow.               │
│                                                             │
│   [Download on App Store]  [Get on Google Play]             │
│                                                             │
│              ┌─────────────────┐                            │
│              │                 │                            │
│              │   App Preview   │                            │
│              │   Screenshot    │                            │
│              │                 │                            │
│              └─────────────────┘                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- App icon prominently displayed
- Clear value proposition headline
- Subheadline explaining the unique approach (chain visualization)
- App Store badges (both iOS and Android when available)
- Hero screenshot or device mockup showing the app

### 2. Social Proof Bar

```
┌─────────────────────────────────────────────────────────────┐
│  ⭐ 4.9 on App Store  •  "Love the chain view!" - User      │
└─────────────────────────────────────────────────────────────┘
```

**Content:**
- App Store rating (once available)
- Featured review quote
- Download count (once significant)

### 3. Features Section

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    Why Daily Habits?                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   🔗        │  │   💪        │  │   📊        │         │
│  │   Chain     │  │   Habit     │  │   Progress  │         │
│  │   View      │  │   Strength  │  │   Tracking  │         │
│  │             │  │             │  │             │         │
│  │  See your   │  │  Watch your │  │  Beautiful  │         │
│  │  streak as  │  │  habits get │  │  charts &   │         │
│  │  connected  │  │  stronger   │  │  insights   │         │
│  │  chain      │  │  over time  │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   🎨        │  │   🔔        │  │   🔒        │         │
│  │   Beautiful │  │   Smart     │  │   Privacy   │         │
│  │   Design    │  │   Reminders │  │   First     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Feature Cards (6 primary):**

1. **Chain Visualization**
   - Icon: 🔗 or chain link
   - "Don't break the chain" - visual motivation
   - Screenshot of chain view

2. **Habit Strength**
   - Icon: 💪 or gauge
   - Habits get stronger with consistency
   - Screenshot of strength indicator

3. **Beautiful Design**
   - Icon: 🎨
   - Clean, minimal, distraction-free
   - Multiple app screenshots

4. **Smart Reminders**
   - Icon: 🔔
   - Gentle nudges at the right time

5. **Progress Insights**
   - Icon: 📊
   - Track your journey with stats
   - Screenshot of charts

6. **Privacy First**
   - Icon: 🔒
   - Your data stays on your device / secure sync
   - No selling data

### 4. App Screenshots Gallery

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    See It In Action                         │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │         │  │         │  │         │  │         │        │
│  │  Home   │  │  Chain  │  │ Detail  │  │ Charts  │        │
│  │  Screen │  │  View   │  │  View   │  │         │        │
│  │         │  │         │  │         │  │         │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                             │
│              [Carousel navigation dots]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Screenshots to Include:**
1. Habits list (home screen)
2. Chain visualization expanded
3. Habit detail screen with strength chart
4. Empty state (showing onboarding)
5. Dark mode variant

### 5. Testimonials

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  What Users Are Saying                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  "The chain visualization is genius. I finally      │   │
│  │   understand why I was breaking my habits."         │   │
│  │                                    - Sarah M. ⭐⭐⭐⭐⭐ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  "Simple, beautiful, and it just works."            │   │
│  │                                    - Mike T. ⭐⭐⭐⭐⭐ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6. Pricing Section

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    Simple Pricing                           │
│                                                             │
│  ┌────────────────────┐    ┌────────────────────┐          │
│  │       FREE         │    │        PRO         │          │
│  │                    │    │                    │          │
│  │  • 3 habits        │    │  • Unlimited       │          │
│  │  • Chain view      │    │  • All free +      │          │
│  │  • Basic stats     │    │  • Advanced stats  │          │
│  │                    │    │  • Cloud sync      │          │
│  │                    │    │  • Priority support│          │
│  │                    │    │                    │          │
│  │  [Download Free]   │    │  $4.99/mo or       │          │
│  │                    │    │  $29.99/year       │          │
│  │                    │    │                    │          │
│  │                    │    │  [Start Free Trial]│          │
│  └────────────────────┘    └────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7. Final CTA

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Ready to Build Better Habits?                  │
│                                                             │
│        [Download on App Store]  [Get on Google Play]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8. Footer

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Daily Habits                                               │
│                                                             │
│  Product          Legal           Connect                   │
│  ────────         ─────           ───────                   │
│  Features         Privacy         Twitter                   │
│  Pricing          Terms           Email                     │
│  Changelog                        GitHub                    │
│  Press Kit                                                  │
│                                                             │
│  © 2024 Daily Habits. Made with ❤️                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Design System

### Colors (Match App)

```css
:root {
  /* Primary - from app theme */
  --primary: #YOUR_APP_PRIMARY;
  --primary-foreground: #FFFFFF;

  /* Backgrounds */
  --background: #FFFFFF;
  --background-dark: #0A0A0A;

  /* Text */
  --foreground: #171717;
  --muted: #737373;

  /* Accents */
  --success: #22C55E; /* For streaks/completed */
  --chain-link: #F59E0B; /* Chain visualization color */
}
```

### Typography

```css
/* Headings */
font-family: 'Inter', system-ui, sans-serif;
/* or match app font: 'SF Pro Display' for iOS feel */

/* Body */
font-family: 'Inter', system-ui, sans-serif;
```

### Component Style

- **Rounded corners**: Match app's border-radius (likely 12-16px)
- **Shadows**: Subtle, modern shadows
- **Spacing**: Generous whitespace, breathable layout
- **Animations**: Subtle fade-ins, no jarring transitions

---

## Technical Implementation

### Folder Structure

```
habit_app_website/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts, metadata
│   │   ├── page.tsx            # Landing page
│   │   ├── features/
│   │   │   └── page.tsx
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── changelog/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   ├── press/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Screenshots.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── CTA.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Badge.tsx
│   ├── lib/
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── public/
│   ├── screenshots/            # App screenshots
│   ├── icons/                  # App icon, favicons
│   ├── og-image.png           # Social sharing image
│   └── app-store-badge.svg
├── tailwind.config.ts
├── next.config.js
└── package.json
```

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "framer-motion": "^10.0.0",    // Animations
    "lucide-react": "^0.300.0",    // Icons
    "@vercel/analytics": "^1.0.0"  // Analytics
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.0"  // For blog/changelog
  }
}
```

### SEO Configuration

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'Daily Habits - Build Habits That Stick',
  description: 'Track your daily habits with beautiful chain visualizations. Watch your streaks grow and build habits that last.',
  keywords: ['habit tracker', 'habit app', 'streak tracker', 'daily habits', 'habit building'],
  openGraph: {
    title: 'Daily Habits - Build Habits That Stick',
    description: 'Track your daily habits with beautiful chain visualizations.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Habits',
    description: 'Build habits that stick with beautiful chain visualization.',
    images: ['/og-image.png'],
  },
};
```

---

## Content Needed

### From App (Export/Screenshot)

- [ ] App icon (1024x1024 PNG)
- [ ] App screenshots (iPhone 15 Pro frames recommended)
  - [ ] Home screen with habits
  - [ ] Chain visualization
  - [ ] Habit detail with strength chart
  - [ ] Empty state
  - [ ] Dark mode variant
- [ ] Feature icons or illustrations

### Copy to Write

- [ ] Hero headline and subheadline
- [ ] Feature descriptions (6 cards)
- [ ] Testimonials (can start with placeholder, update with real ones)
- [ ] Pricing tier details
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Press kit description

### Assets to Create

- [ ] OG image for social sharing (1200x630)
- [ ] Favicon set
- [ ] App Store badges (download from Apple/Google)

---

## Phased Rollout

### Phase 1: MVP Launch (Week 1-2)
- [ ] Landing page with hero, features, screenshots
- [ ] App Store download links
- [ ] Privacy Policy & Terms
- [ ] Deploy to Vercel

### Phase 2: Polish (Week 3-4)
- [ ] Add testimonials (real reviews)
- [ ] Pricing page
- [ ] Changelog page
- [ ] Press kit
- [ ] Analytics integration

### Phase 3: Growth (Ongoing)
- [ ] Blog for SEO content
- [ ] Email capture for updates
- [ ] A/B testing on CTAs
- [ ] Performance optimization

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Domain Setup

1. Purchase domain (e.g., `dailyhabits.app`, `getdailyhabits.com`)
2. Configure in Vercel dashboard
3. Enable HTTPS (automatic)

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/...
NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/...
```

---

## Reference: HabitKit Patterns

Based on [habitkit.app](https://habitkit.app):

**What Works Well:**
- Clean, minimal design with focus on the app
- Social proof prominently displayed (ratings, review counts)
- Multiple download CTAs throughout the page
- Feature cards with icons and brief descriptions
- Screenshot gallery showing key features
- Footer with related products and legal links

**Differentiation Opportunities:**
- Emphasize unique "chain visualization" concept
- Highlight "habit strength" as differentiator
- Show the science behind habit formation
- Interactive demo or animation of features

---

## Next Steps

1. Run the Quick Start commands above to create the project
2. Open new Maestro session in `/Users/andres/Code/habit_app_website`
3. Reference this spec to build out the pages
4. Export screenshots from the iOS Simulator
5. Deploy to Vercel when ready

---

*Last Updated: 2026-01-17*
