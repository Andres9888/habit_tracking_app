#!/usr/bin/env python3
"""
Generate iOS app icons in all required sizes from a master 1024x1024 icon.

Usage:
    python3 scripts/generate-app-icons.py assets/icon.png ios/ChainDay/Images.xcassets/AppIcon.appiconset/

Requirements:
    pip install Pillow
"""

import os
import sys
from pathlib import Path
from PIL import Image


def generate_icons(source_icon_path: str, output_dir: str) -> None:
    """Generate all required iOS icon sizes from a master icon."""
    
    # Define all required icon sizes for iOS
    # Format: (size_px, scale, idiom, filename)
    icon_specs = [
        # iPhone
        (20, 2, "iphone", "AppIcon-20x20@2x.png"),
        (20, 3, "iphone", "AppIcon-20x20@3x.png"),
        (29, 2, "iphone", "AppIcon-29x29@2x.png"),
        (29, 3, "iphone", "AppIcon-29x29@3x.png"),
        (40, 2, "iphone", "AppIcon-40x40@2x.png"),
        (40, 3, "iphone", "AppIcon-40x40@3x.png"),
        (60, 2, "iphone", "AppIcon-60x60@2x.png"),
        (60, 3, "iphone", "AppIcon-60x60@3x.png"),
        # iPad
        (20, 1, "ipad", "AppIcon-20x20@1x.png"),
        (20, 2, "ipad", "AppIcon-20x20@2x.png"),
        (29, 1, "ipad", "AppIcon-29x29@1x.png"),
        (29, 2, "ipad", "AppIcon-29x29@2x.png"),
        (40, 1, "ipad", "AppIcon-40x40@1x.png"),
        (40, 2, "ipad", "AppIcon-40x40@2x.png"),
        (76, 1, "ipad", "AppIcon-76x76@1x.png"),
        (76, 2, "ipad", "AppIcon-76x76@2x.png"),
        (83.5, 2, "ipad", "AppIcon-83.5x83.5@2x.png"),
        # App Store
        (1024, 1, "universal", "AppIcon-1024x1024@1x.png"),
    ]
    
    # Verify source exists
    if not os.path.exists(source_icon_path):
        print(f"❌ Error: Source icon not found: {source_icon_path}")
        sys.exit(1)
    
    # Load source image
    try:
        source_img = Image.open(source_icon_path)
        print(f"✅ Loaded source image: {source_icon_path} ({source_img.size})")
    except Exception as e:
        print(f"❌ Error loading image: {e}")
        sys.exit(1)
    
    # Create output directory if needed
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate each icon size
    generated_count = 0
    for size_pt, scale, idiom, filename in icon_specs:
        # Calculate pixel size
        size_px = int(size_pt * scale)
        
        # Resize image
        resized = source_img.resize((size_px, size_px), Image.Resampling.LANCZOS)
        
        # Save file
        output_path = os.path.join(output_dir, filename)
        resized.save(output_path, "PNG", optimize=True)
        
        print(f"✅ Generated: {filename} ({size_px}x{size_px}px)")
        generated_count += 1
    
    print(f"\n✅ Success! Generated {generated_count} icon files in {output_dir}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    
    source_path = sys.argv[1]
    output_path = sys.argv[2]
    
    generate_icons(source_path, output_path)
