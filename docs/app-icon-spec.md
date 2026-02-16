# Chain Day App Icon Specification

## Design Concept

The Chain Day app icon features a **chain link** design that symbolizes habit streaks and continuous progress. The icon is designed to be clean, minimal, and instantly recognizable at small sizes.

## Visual Design

### Main Elements

- **Two interlocking chain links** in a simplified, geometric style
- Links are oriented diagonally for visual interest and balance
- Clean lines with consistent stroke weight for clarity at small sizes

### Color Palette

- **Primary Color**: Emerald Green `#059669`
  - Used for the chain links themselves
  - Represents growth, health, and positive habits
- **Background**: White `#FFFFFF`
  - Provides maximum contrast and clarity
  - Clean, professional appearance across all contexts

### Dimensions & Scale

- **Icon Size**: 1024×1024px (required by iOS App Store)
- **Safe Area**: Maintain 10% padding from edges to account for iOS rounded corners
- **Stroke Weight**: 80-100px for optimal visibility when scaled down
- **Link Gap**: Clear separation between links for readability

## Technical Requirements

### File Formats

- **Source**: SVG (vector, scalable)
- **Production**: PNG at 1024×1024px (iOS requirement)
- **Adaptive Icon**: 432×432px foreground PNG with transparency (Android)

### Platform-Specific Considerations

#### iOS

- iOS automatically applies rounded corners (varies by device)
- Icon should work well with corner radius applied
- Avoid placing critical elements in corners

#### Android (Adaptive Icon)

- Foreground layer: Chain links on transparent background
- Background layer: Solid white `#FFFFFF`
- System applies shape mask (circle, squircle, rounded square)
- Design should work in circular crop

## Design Rationale

1. **Chain Link Metaphor**: Directly represents the core concept of "chain days" (habit streaks)
2. **Minimal Design**: Simple geometric shapes ensure clarity at all sizes (from app icon to notification badge)
3. **Emerald Green**: Aligns with app's primary brand color, conveys growth and wellness
4. **White Background**: Maximum contrast, professional appearance, works in all contexts (home screen, app store, settings)
5. **Diagonal Orientation**: More dynamic and engaging than horizontal/vertical alignment

## Asset Export Checklist

- [ ] `icon.png` - 1024×1024px, white background, chain links centered
- [ ] `adaptive-icon.png` - 432×432px, transparent background, chain links only
- [ ] `splash-icon.png` - 512×512px (optional, for splash screen logo)
- [ ] `favicon.png` - 32×32px (for web)

## Future Considerations

- Consider adding subtle gradient or depth to links (while maintaining recognizability)
- Seasonal variants (e.g., different colors for special events)
- Animated icon for splash screen (Lottie format)

---

**Created**: 2026-02-14  
**Brand Colors**: Primary #059669 (emerald), Secondary #047857 (darker emerald), Background #F5F1ED (stone)
