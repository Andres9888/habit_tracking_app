# Icon Source Files

This directory contains the source SVG for the Chain Day app icon.

## Generating Production Assets

The `icon.svg` file needs to be exported to the following PNG files:

### Required Assets

1. **icon.png** (1024×1024px)
   - Full icon with white background
   - Used for iOS App Store and app icon

2. **adaptive-icon.png** (432×432px)
   - Foreground layer only (transparent background)
   - Used for Android adaptive icon
   - System applies background color: #FFFFFF

3. **splash.png** (1284×2778px recommended)
   - App logo centered on transparent background
   - System applies background color: #059669 (emerald green)
   - Should be recognizable but not full-bleed

4. **favicon.png** (32×32px)
   - Web favicon
   - Simple version of icon

## Export Instructions

Using a vector graphics tool (Figma, Sketch, Illustrator, Inkscape):

1. Open `icon.svg`
2. Export at required dimensions
3. For adaptive-icon: remove white background, keep only chain links
4. For splash: create a smaller centered version (512×512px recommended)
5. Save files to parent `assets/` directory

## Alternative: Command Line (ImageMagick/Inkscape)

```bash
# Install dependencies
brew install imagemagick inkscape  # macOS
# or: sudo apt-get install imagemagick inkscape  # Linux

# Export icon.png (1024×1024)
inkscape icon.svg --export-filename=../icon.png --export-width=1024 --export-height=1024

# Export adaptive-icon (432×432) - requires editing SVG to remove background first
inkscape icon.svg --export-filename=../adaptive-icon.png --export-width=432 --export-height=432

# Export favicon (32×32)
inkscape icon.svg --export-filename=../favicon.png --export-width=32 --export-height=32
```

## Notes

- The current SVG is a placeholder design
- For production, consider hiring a designer to refine the chain link illustration
- Ensure chain links are clearly visible at 32×32px (favicon size)
- Test icon on various home screen backgrounds (light/dark)
