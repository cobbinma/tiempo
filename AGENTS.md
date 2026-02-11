# AI Agent Instructions for Tiempo

This document provides context and instructions for AI coding agents working on the Tiempo Spanish verb conjugation app.

## Project Overview

**Tiempo** is a React Native mobile app built with Expo that helps users learn Spanish verb conjugations through interactive quizzes and verb lookups.

- **Tech Stack:** React Native, Expo SDK 54, TypeScript, SQLite
- **Database:** 637 Spanish verbs with 67,226+ conjugations (pre-populated, bundled in assets)
- **Offline-First:** All verb data stored locally in SQLite
- **Navigation:** React Navigation v7 (Stack Navigator)

## Project Structure

```
tiempo/
├── src/
│   ├── components/       # Reusable UI components
│   ├── constants/        # Colors, spacing, common verbs list
│   ├── database/         # SQLite queries and initialization
│   ├── hooks/            # Custom React hooks (useSettings)
│   ├── navigation/       # React Navigation setup
│   ├── screens/          # All app screens (6 main screens)
│   ├── store/            # Module-level state stores (quiz, settings)
│   └── types/            # TypeScript type definitions
├── assets/               # Images, database, logo
│   └── database/         # tiempo.db (11.2MB SQLite database)
└── App.tsx               # Root component
```

## Key Architecture Decisions

### State Management
- **Module-level stores** (NOT React Context) for quiz and settings state
- Located in `src/store/quizStore.ts` and `src/store/settingsStore.ts`
- Avoids React Navigation serialization issues
- Pattern: Export store object with getters/setters

**Why not Context?** React Navigation has issues serializing complex state, causing "expected dynamic type 'boolean'" bridge errors.

### Database
- **SQLite** with pre-populated database copied from assets on first launch
- Database queries in `src/database/db.ts`
- Key functions:
  - `initDatabase()` - Copy DB from assets on first run
  - `searchVerbs(query)` - Search by infinitive
  - `getAllVerbs()` - Get all 637 verbs
  - `getVerbConjugations(infinitive)` - Get all conjugations organized by mood/tense
  - `generateQuizQuestions(config)` - Generate quiz based on filters

### Navigation
- **React Navigation v7** with Stack Navigator
- Type-safe navigation with `RootStackParamList`
- All screens except Home have back buttons
- Quiz and Results screens: `gestureEnabled: false` (no swipe back during quiz)

### Settings System
- **Spanish Variant Toggle:** European Spanish (with vosotros) vs Latin American Spanish (without vosotros)
- Setting stored in `settingsStore` and accessed directly in database queries
- Filters out vosotros/vosotras performers when `useVosotros === false`

## App Screens

### 1. HomeScreen (`src/screens/HomeScreen.tsx`)
- Landing page with gradient header and logo
- Three cards: Search Verbs, Common Verbs, Practice Quiz
- Settings button at bottom

### 2. SearchScreen (`src/screens/SearchScreen.tsx`)
- Search bar with real-time filtering (300ms debounce)
- Shows all 637 verbs when no query
- Each verb card has "View All" and "Practice" buttons

### 3. CommonVerbsScreen (`src/screens/CommonVerbsScreen.tsx`)
- Displays 100 most common Spanish verbs (ranked)
- List defined in `src/constants/commonVerbs.ts`
- Each verb shows rank badge (#1-#100)

### 4. VerbDetailScreen (`src/screens/VerbDetailScreen.tsx`)
- Shows all conjugations for a verb
- Organized by mood (tabs) and tense (cards)
- Each tense card has a "Practice" button

### 5. QuizSetupScreen (`src/screens/QuizSetupScreen.tsx`)
- Select verb (specific or random)
- Select moods (checkboxes)
- Select tenses (checkboxes)
- Can be pre-filled from Verb Detail screen

### 6. QuizScreen (`src/screens/QuizScreen.tsx`)
- Interactive quiz with Spanish keyboard (á é í ó ú ñ ü ¡ ¿)
- Progress bar with exit button
- Auto-advance on correct answers (1.5s delay)
- Keyboard starts minimized

### 7. ResultsScreen (`src/screens/ResultsScreen.tsx`)
- Shows score percentage with color coding
- Detailed question-by-question results
- Try Again / New Quiz / Home buttons

### 8. SettingsScreen (`src/screens/SettingsScreen.tsx`)
- Toggle for European vs Latin American Spanish
- Shows example pronouns based on selection
- About section with app stats

## Critical Patterns to Follow

### 1. Navigation Button Pattern
All screens (except Home) have consistent headers:
```tsx
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Text style={styles.backButtonText}>←</Text>
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Screen Title</Text>
  <View style={styles.headerSpacer} />
</View>
```

**Header styles:**
```tsx
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: COLORS.white,
  paddingHorizontal: SPACING.md,
  paddingVertical: SPACING.md,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.borderLight,
  zIndex: 10,
},
backButton: {
  width: 40,
  height: 40,
  borderRadius: BORDER_RADIUS.round,
  backgroundColor: COLORS.backgroundDark,
  justifyContent: 'center',
  alignItems: 'center',
},
backButtonText: {
  fontSize: FONT_SIZES.xxl,
  color: COLORS.text,
  fontWeight: FONT_WEIGHTS.bold,
},
```

### 2. Settings Access Pattern
```tsx
import { useSettings } from '../hooks/useSettings';

const { settings, updateSetting } = useSettings();
const shouldShowVosotros = settings.useVosotros;
```

Or directly from store in non-React code:
```tsx
import { settingsStore } from '../store/settingsStore';

const settings = settingsStore.getSettings();
```

### 3. Database Filtering Pattern
When querying conjugations, respect the vosotros setting:
```tsx
const settings = settingsStore.getSettings();

if (!settings.useVosotros) {
  conditions.push("c.performer NOT LIKE '%vosotros%'");
}
```

### 4. SafeAreaView Pattern
```tsx
<SafeAreaView style={styles.container}>
  {/* No edges prop for most screens */}
</SafeAreaView>
```

### 5. Color & Spacing Constants
Always use constants from `src/constants/Colors.ts`:
```tsx
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';
```

## Important Constraints

### Do NOT Use:
- ❌ React Context (causes bridge errors with React Navigation)
- ❌ `cd <directory> && <command>` patterns (use workdir parameter)
- ❌ Interactive git commands (`-i` flag)
- ❌ Force push to main/master without explicit request
- ❌ Committing without user request

### DO Use:
- ✅ Module-level stores for shared state
- ✅ TypeScript for all new code
- ✅ Consistent header patterns across screens
- ✅ Constants for colors, spacing, fonts
- ✅ SafeAreaView for screen containers
- ✅ FlatList for long scrolling lists (virtualization)
- ✅ Animated API for smooth transitions

## Package Versions (Critical)

```json
{
  "expo": "~54.0.33",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "@react-navigation/native": "^7.1.28",
  "react-native-screens": "~4.16.0",
  "react-native-gesture-handler": "installed",
  "expo-sqlite": "latest"
}
```

**Note:** Must use `react-native-screens: ~4.16.0` - other versions cause compatibility issues.

## Branding

- **App Name:** Tiempo
- **Logo:** Clock and speech bubble icon (1024×1024)
- **Color Scheme:**
  - Primary: Coral Red (`#FF6B6B`)
  - Secondary: Turquoise (`#4ECDC4`)
  - Background: Off-white (`#F8F9FA`)
- **Logo Files:** `assets/icon.png`, `assets/splash-icon.png`, etc.
- See `BRANDING.md` for full branding guide

## Database Schema

### verbs table
- `infinitive` (TEXT, PRIMARY KEY) - Spanish infinitive form
- `translation` (TEXT) - English translation

### conjugations table
- `id` (INTEGER, PRIMARY KEY)
- `infinitive` (TEXT, FOREIGN KEY)
- `mood` (TEXT) - Indicativo, Subjuntivo, Imperativo Afirmativo, Imperativo Negativo
- `tense` (TEXT) - Presente, Pretérito, Imperfecto, Futuro, etc.
- `performer` (TEXT) - yo, tú, él/ella/usted, nosotros/nosotras, vosotros/vosotras, ellos/ellas/ustedes
- `performer_en` (TEXT) - English equivalent
- `conjugated_form` (TEXT) - The actual conjugated verb

## Git Workflow

- **Main branch:** All work on `main`
- **Commits:** Only create when user explicitly requests
- **Commit style:** Concise, focus on "why" not "what"
- **Pre-commit hooks:** Run automatically, fix issues before new commit (don't amend unless safe)

## Testing & Development

- **Dev server:** `npx expo start`
- **Reload:** Press 'r' in terminal
- **Clear cache:** `npx expo start -c`
- **Platform:** Primarily iOS (but cross-platform compatible)

## Common Issues & Solutions

### Issue: "expected dynamic type 'boolean'" error
**Solution:** Don't use React Context. Use module-level stores instead.

### Issue: Quiz scoring bug
**Solution:** Use refs to avoid React state race conditions (already implemented).

### Issue: Can't click back button
**Solution:** Add `zIndex: 10` to header style to ensure it's above scrollable content.

### Issue: Duplicate keys in FlatList
**Solution:** Ensure `keyExtractor` uses unique values (e.g., `item.infinitive` or `item.id`).

## Future Feature Ideas

Recommended next features:
1. **Progress Tracking** - Store quiz results, show stats/accuracy
2. **Verb Favorites** - Bookmark verbs, practice only favorites
3. **Flashcard Mode** - Tap to reveal instead of typing
4. **Audio Pronunciation** - TTS for conjugations
5. **Dark Mode** - Night-friendly theme

See main conversation for full feature list.

## Working with AI Agents

When implementing new features:
1. **Read existing code first** - Understand patterns before adding new code
2. **Use TodoWrite tool** - Plan multi-step tasks with todos
3. **Match existing patterns** - Header styles, navigation, colors
4. **Test navigation params** - Ensure types match `RootStackParamList`
5. **Check for duplicates** - Don't create duplicate styles or state
6. **Update types** - Add new screens to `RootStackParamList`

## Questions?

If you encounter issues or need clarification:
- Check existing screens for patterns (SearchScreen is a good reference)
- Review `src/types/index.ts` for type definitions
- Look at `src/store/` for state management examples
- Refer to `src/database/db.ts` for query patterns

---

**Last Updated:** February 2026  
**Maintained by:** Matthew Cobbing  
**Repository:** https://github.com/cobbinma/tiempo
