# Uniwind Migration - Phase 3: Theme Conversion

> **Focus**: Converting `tailwind.config.js` theme to Tailwind 4 CSS-based `@theme`
> **Key Change**: JavaScript config → CSS `@theme` directive in `global.css`

## Phase 3 Tasks: Theme & CSS Updates

### 3.1 Update global.css - Import Syntax

**File**: `global.css`

- [ ] Replace Tailwind 3 directives with Tailwind 4 imports:

**Before (Tailwind 3):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**After (Tailwind 4):**
```css
@import "tailwindcss";
```

### 3.2 Convert Theme Configuration to CSS

- [ ] Add `@theme` block to define custom design tokens:

Your current `tailwind.config.js` theme translates to:

```css
@import "tailwindcss";

/* Google Fonts - Keep existing imports */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
@import url('https://fonts.cdnfonts.com/css/opendyslexic');

@theme {
  /* Border Radius */
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  /* Container */
  --container-2xl: 1400px;

  /* Font Families - Note: RN requires single fonts, no fallbacks */
  --font-sans: 'Inter';
  --font-heading: 'Inter';
  --font-dyslexic: 'OpenDyslexic';

  /* Custom Colors using CSS variables */
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
}
```

### 3.3 Complete global.css Rewrite

- [ ] Replace entire `global.css` with Tailwind 4 syntax:

```css
/**
 * Global CSS for Uniwind / Tailwind CSS 4
 *
 * Expo's Metro bundler handles CSS via Uniwind.
 */

/* Tailwind 4 import - replaces @tailwind directives */
@import "tailwindcss";

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
@import url('https://fonts.cdnfonts.com/css/opendyslexic');

/* Theme configuration - replaces tailwind.config.js theme.extend */
@theme {
  /* Border Radius */
  --radius: 0.5rem;
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  /* Font Families */
  --font-sans: 'Inter';
  --font-heading: 'Inter';
  --font-dyslexic: 'OpenDyslexic';

  /* Semantic Colors */
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
}

/* CSS Variables - Light Mode Theme */
:root {
  --background: 30 2% 95%;
  --foreground: 240 6% 10%;

  --card: 0 0% 100%;
  --card-foreground: 240 6% 10%;

  --popover: 0 0% 100%;
  --popover-foreground: 240 6% 10%;

  --primary: 240 5% 8%;
  --primary-foreground: 0 0% 100%;

  --secondary: 0 0% 95%;
  --secondary-foreground: 240 6% 12%;

  --muted: 0 0% 92%;
  --muted-foreground: 240 5% 42%;

  --accent: 0 0% 88%;
  --accent-foreground: 240 6% 12%;

  --destructive: 4 82% 58%;
  --destructive-foreground: 0 0% 100%;

  --border: 240 6% 90%;
  --input: 240 5% 86%;
  --ring: 240 6% 16%;

  --radius: 0.5rem;
}

/* Base layer styles */
@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: 'Inter', system-ui, sans-serif;
  }

  body.dyslexic-font,
  body.dyslexic-font * {
    font-family: 'OpenDyslexic', 'Inter', system-ui, sans-serif !important;
  }
}
```

### 3.4 Handle rem Unit Differences

> ⚠️ **Important**: Uniwind uses 16px rem by default (Tailwind standard), while NativeWind used 14px.

- [ ] If you need to maintain 14px rem base, add to metro config or use explicit pixel values where sizing is critical.

Alternatively, you can set a custom rem in Uniwind config:
```javascript
// In metro.config.cjs
const config = withUniwindConfig(baseConfig, {
  input: './global.css',
  rem: 14  // Match NativeWind's default
});
```

### 3.5 Font Fallback Considerations

- [ ] Review font declarations - React Native doesn't support font fallbacks:

**Web-compatible (not RN):**
```css
--font-sans: 'Inter', system-ui, sans-serif;
```

**React Native compatible:**
```css
--font-sans: 'Inter';
```

The font fallbacks in `body` styles are fine for web but won't apply on native.

## Verification

- [ ] `global.css` parses without CSS syntax errors
- [ ] Tailwind utilities still work: `bg-background`, `text-foreground`, etc.
- [ ] Custom colors resolve correctly: `bg-primary`, `text-muted-foreground`
- [ ] Border radius utilities work: `rounded-lg`, `rounded-md`, `rounded-sm`
- [ ] Font families apply correctly on both web and native

## Color Migration Reference

| Tailwind 3 Config | Tailwind 4 CSS |
|-------------------|----------------|
| `colors.background: 'hsl(var(--background))'` | `--color-background: hsl(var(--background))` |
| `colors.primary.DEFAULT` | `--color-primary` |
| `colors.primary.foreground` | `--color-primary-foreground` |
| `borderRadius.lg` | `--radius-lg` |

---
**Previous Phase**: [UNIWIND_MIGRATION-2.md](./UNIWIND_MIGRATION-2.md) - Config Migration
**Next Phase**: [UNIWIND_MIGRATION-4.md](./UNIWIND_MIGRATION-4.md) - Code Updates
