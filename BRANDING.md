# Tiempo App - Branding Guide

## Overview
This guide explains the branding and logo for the Tiempo Spanish verb conjugation app.

## Logo

**Current Logo:** Dice icon (`dice.png`)
- The logo features colorful dice in the app's brand colors (coral red and turquoise)
- Represents the "practice/quiz" aspect of language learning
- Modern, playful, and approachable design
- Source file: `assets/dice.png` (1424×1424 pixels)

**Logo Usage:**
- Used in app header (HomeScreen)
- All app icons generated from this logo
- Dice emoji (🎲) used for Practice Quiz card

## Current Brand Colors
The app uses a modern, colorful design system defined in `src/constants/Colors.ts`:

- **Primary**: `#FF6B6B` (Coral Red)
- **Primary Dark**: `#E85A5A` (Darker Coral)
- **Secondary**: `#4ECDC4` (Turquoise)
- **Accent 1**: `#FFE66D` (Sunny Yellow)
- **Accent 2**: `#A8E6CF` (Mint Green)
- **Background**: `#F7F9FC` (Light Blue-Gray)

## Assets to Replace

### 1. App Icon (`./assets/icon.png`)
**Specifications:**
- Size: **1024 × 1024 pixels**
- Format: PNG with transparency
- Usage: iOS and Android app icon
- Design tips:
  - Simple, recognizable design
  - Works well at small sizes (60px)
  - Avoid thin lines or small text
  - Consider using the Spanish flag colors or a clock/verb theme

**Recommended tools:**
- Figma (free)
- Canva (free)
- Adobe Illustrator
- Or use an AI tool like DALL-E, Midjourney

### 2. Splash Screen (`./assets/splash-icon.png`)
**Specifications:**
- Size: **1284 × 2778 pixels** (iPhone 14 Pro Max)
- Format: PNG
- Background: Currently `#264653` (dark teal) - update in `app.json`
- Center your logo in the middle
- The logo should be about 1/3 of the screen height

### 3. Adaptive Icon - Android (`./assets/adaptive-icon.png`)
**Specifications:**
- Size: **1024 × 1024 pixels**
- Format: PNG with transparency
- Special consideration: Android cuts this into different shapes (circle, square, rounded square)
- Keep important elements in the center "safe zone" (660 × 660 pixels)
- Background color set in `app.json`

### 4. Favicon (`./assets/favicon.png`)
**Specifications:**
- Size: **48 × 48 pixels** (or 512×512 for better quality)
- Format: PNG
- Usage: Web version of the app

## Step-by-Step: Adding Your Logo

### Option 1: Create a Simple Logo Using Figma

1. **Create a Figma account** (free): https://figma.com
2. **Create new file** with Frame size 1024×1024
3. **Design your logo** with these elements:
   - A clock icon (representing "tiempo" = time)
   - Spanish flag colors (red and yellow)
   - Or a stylized letter "T"
4. **Export as PNG**:
   - Select your frame
   - Export settings: PNG, 1x, no background
   - Save as `icon.png`

### Option 2: Use an AI Image Generator

**Prompt example for DALL-E/Midjourney:**
```
"A modern, minimalist app icon for a Spanish language learning app called Tiempo. 
Features a stylized clock with Spanish flag colors (red and yellow). 
Clean design, flat style, suitable for mobile app icon, 1024x1024."
```

### Option 3: Hire a Designer

- **Fiverr**: $5-50 for app icon design
- **Upwork**: Professional designers
- **99designs**: Logo design contests

## Installing Your Logo

The current logo (dice.png) is already installed. If you need to update it:

### 1. Replace the asset files:
```bash
# Navigate to your project
cd ~/github/cobbinma/tiempo

# Replace with your new design:
cp /path/to/new-logo.png assets/dice.png

# Regenerate app icons:
sips -z 1024 1024 assets/dice.png --out assets/icon.png
sips -z 192 192 assets/dice.png --out assets/adaptive-icon.png
sips -z 48 48 assets/dice.png --out assets/favicon.png
```

### 2. Update app.json if needed:
```json
{
  "expo": {
    "splash": {
      "backgroundColor": "#FF6B6B"  // Change to your brand color
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#FF6B6B"  // Change to your brand color
      }
    }
  }
}
```

### 3. Clear cache and rebuild:
```bash
# Clear Expo cache
npx expo start --clear

# Or for a fresh build
rm -rf .expo node_modules
npm install
npx expo start
```

## Using Logo in the App UI

The Logo component is already set up and uses the dice logo:

```typescript
// src/components/Logo.tsx
import Logo from '../components/Logo';

// Usage:
<Logo size={80} />           // Just the dice icon
<Logo size={80} showText />  // Dice icon + "Tiempo" text
```

The logo appears on:
- HomeScreen header (80px size)
- Throughout the app where branding is needed

The dice emoji (🎲) is used on:
- Practice Quiz card on HomeScreen

## Brand Guidelines

### Typography
- **Titles**: Bold, 800 weight
- **Body**: Medium, 500 weight
- **Size scale**: 12, 14, 16, 18, 20, 24, 28, 32, 40

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 20px
- XXL: 24px
- Round: 999px (circular)

### Shadows
- Subtle elevation for cards
- Opacity: 0.08-0.1
- Offset: 2-4px

## Expo EAS Build (For Production)

When ready to publish:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Resources

- **Expo Icon Guidelines**: https://docs.expo.dev/guides/app-icons/
- **iOS Design Guidelines**: https://developer.apple.com/design/human-interface-guidelines/app-icons
- **Android Design Guidelines**: https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
- **Color Palette Tool**: https://coolors.co/
- **Icon Inspiration**: https://www.iconfinder.com/, https://www.flaticon.com/

## Quick Checklist

- [ ] Create or obtain logo image (1024×1024)
- [ ] Replace `assets/icon.png`
- [ ] Create splash screen with logo
- [ ] Replace `assets/splash-icon.png`
- [ ] Replace `assets/adaptive-icon.png`
- [ ] Replace `assets/favicon.png`
- [ ] Update `app.json` background colors if needed
- [ ] Clear Expo cache and test
- [ ] Test on both iOS and Android (use Expo Go)
- [ ] Verify icon appears correctly on device home screen

---

**Need help?** The logo files are currently placeholders. Once you have your design files, simply drop them into the `assets/` folder with the correct filenames and restart the development server.
