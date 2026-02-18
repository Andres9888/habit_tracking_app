#!/usr/bin/env python3
"""
App Store Screenshot Helper - Guide and checklist for creating App Store screenshots.

This script provides a checklist and guidance for creating App Store screenshots.

Usage:
    python3 scripts/app-store-screenshot-helper.py
"""

import os
import json
from datetime import datetime

SCREENSHOT_CONFIG = {
    "app_name": "ChainDay",
    "bundle_id": "com.chainday.app",
    "app_store_id": "pending",
    "screenshots": [
        {
            "number": 1,
            "screen": "Habit List (Main Tab)",
            "headline": "Never Break the Chain",
            "subheadline": "Build lasting habits with science — one day at a time",
            "description": "Show the main habit list with visual chains growing, emphasizing the core mechanic",
            "dark_mode": False,
            "languages": ["en-US"]
        },
        {
            "number": 2,
            "screen": "Daily Chain View",
            "headline": "See Your Streaks Grow",
            "subheadline": "Visual chains make every day of consistency count",
            "description": "Close-up of the chain visualization with growth animation, showing daily progress",
            "dark_mode": False,
            "languages": ["en-US"]
        },
        {
            "number": 3,
            "screen": "Templates Gallery",
            "headline": "200+ Proven Templates",
            "subheadline": "Start in seconds with routines designed by behavioral science",
            "description": "Show the templates gallery with various habit categories and quick-start options",
            "dark_mode": False,
            "languages": ["en-US"]
        },
        {
            "number": 4,
            "screen": "Analytics Dashboard",
            "headline": "Know What's Working",
            "subheadline": "Track your habit strength, trends, and completion rates at a glance",
            "description": "Display analytics with charts showing completion rates, streaks, and trends",
            "dark_mode": False,
            "languages": ["en-US"]
        },
        {
            "number": 5,
            "screen": "Gamification & Milestones",
            "headline": "Celebrate Every Milestone",
            "subheadline": "Earn XP, level up, and unlock achievements as you grow",
            "description": "Show character progression, achievement unlocks, or XP system",
            "dark_mode": False,
            "languages": ["en-US"]
        },
        {
            "number": 6,
            "screen": "Premium Features",
            "headline": "Unlock Your Full Potential",
            "subheadline": "Advanced analytics, unlimited habits, and deeper insights await",
            "description": "Premium paywall or feature showcase highlighting exclusive benefits",
            "dark_mode": False,
            "languages": ["en-US"]
        }
    ],
    "technical_requirements": {
        "iphone_pro_max": {
            "resolution": "1242x2688px",
            "scale_factor": 3,
            "recommended_format": "PNG or JPG"
        },
        "iphone": {
            "resolution": "1125x2436px",
            "scale_factor": 3,
            "recommended_format": "PNG or JPG"
        },
        "ipad_pro": {
            "resolution": "2048x2732px",
            "scale_factor": 2,
            "recommended_format": "PNG or JPG"
        }
    },
    "design_guidelines": [
        "Use consistent font sizes across screenshots (min 24pt for readability)",
        "Add 20-30px padding from edges",
        "Place text headlines in upper third, subheadlines in middle",
        "Use brand color (#059669) for accents",
        "Ensure 60% of space shows app UI, 40% can be text/graphics",
        "Include call-to-action copy suggesting feature benefits",
        "Keep text concise - users spend < 10 seconds per screenshot"
    ]
}


def print_checklist():
    """Print screenshot creation checklist."""
    print("\n" + "=" * 80)
    print(f"📸 App Store Screenshot Creation Checklist - {SCREENSHOT_CONFIG['app_name']}")
    print("=" * 80)
    
    print("\n📋 SCREENSHOTS TO CREATE:")
    print("-" * 80)
    
    for ss in SCREENSHOT_CONFIG["screenshots"]:
        print(f"\n Screenshot #{ss['number']}: {ss['screen']}")
        print(f"  Headline: {ss['headline']}")
        print(f"  Subheadline: {ss['subheadline']}")
        print(f"  Instructions: {ss['description']}")
        print(f"  [ ] Light Mode")
        if ss.get("dark_mode"):
            print(f"  [ ] Dark Mode")
    
    print("\n\n📐 TECHNICAL REQUIREMENTS:")
    print("-" * 80)
    for device, specs in SCREENSHOT_CONFIG["technical_requirements"].items():
        print(f"\n{device.upper()}:")
        for key, value in specs.items():
            print(f"  {key}: {value}")
    
    print("\n\n🎨 DESIGN GUIDELINES:")
    print("-" * 80)
    for i, guideline in enumerate(SCREENSHOT_CONFIG["design_guidelines"], 1):
        print(f"{i}. {guideline}")
    
    print("\n\n🛠️ TOOLS RECOMMENDATIONS:")
    print("-" * 80)
    print("Screenshot Capture:")
    print("  • Xcode Simulator (built-in)")
    print("  • Physical device (Settings > General > Screenshots)")
    print("  • TestFlight for real device testing")
    print("\nText Overlay:")
    print("  • Figma (cloud-based design tool)")
    print("  • Sketch (macOS native)")
    print("  • Photoshop or GIMP (image editors)")
    print("  • AppLaunchpad or Previewed.app (screenshot optimization)")
    print("\nAutomation:")
    print("  • fastlane snapshot (capture from code)")
    print("  • UITests for consistent screenshots")
    
    print("\n\n📝 IMPLEMENTATION STEPS:")
    print("-" * 80)
    print("1. Run the app on iPhone 14 Pro Max simulator (1242x2688)")
    print("2. Navigate to each screen listed above")
    print("3. Capture screenshot (Cmd+S in simulator)")
    print("4. Open in Figma/Photoshop")
    print("5. Add headline + subheadline with styling")
    print("6. Export as PNG (for App Store Connect)")
    print("7. Verify file size and resolution")
    print("8. Upload to App Store Connect")
    
    print("\n\n✅ SUBMISSION CHECKLIST:")
    print("-" * 80)
    checklist_items = [
        "All 6 screenshots captured in high resolution",
        "Text is readable (min 24pt font)",
        "Screenshots show core features in action",
        "Branding is consistent across all shots",
        "No personal data visible in screenshots",
        "File sizes optimized (< 5MB each)",
        "All screenshots uploaded to App Store Connect",
        "Previewed on actual device or simulator",
        "Dark mode variant created (optional but recommended)",
        "Multiple languages prepared (if applicable)"
    ]
    
    for item in checklist_items:
        print(f"  [ ] {item}")
    
    print("\n\n💡 PRO TIPS:")
    print("-" * 80)
    print("• Start with the most visually appealing screen (#2 - chains)")
    print("• Show before/after comparisons if possible")
    print("• Highlight unique features (Habit Strength algorithm)")
    print("• Include social proof if available (50,000+ users)")
    print("• Test on actual device before finalizing")
    print("• Update screenshots quarterly with new features")
    print("• Monitor competitor screenshots for trends")
    
    print("\n" + "=" * 80 + "\n")


def generate_template():
    """Generate a JSON template for screenshot metadata."""
    template = {
        "app": SCREENSHOT_CONFIG["app_name"],
        "generated": datetime.now().isoformat(),
        "screenshots": SCREENSHOT_CONFIG["screenshots"]
    }
    
    template_path = "scripts/screenshot-template.json"
    with open(template_path, "w") as f:
        json.dump(template, f, indent=2)
    
    print(f"✅ Template generated: {template_path}")


if __name__ == "__main__":
    print_checklist()
    generate_template()
