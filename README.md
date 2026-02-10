# Tiempo ⏰

**Master Spanish Verb Conjugations on iOS and Android**

Tiempo is a clean, offline-first mobile app for learning and practicing Spanish verb conjugations. With 637 verbs and over 67,000 conjugations, Tiempo helps Spanish learners master all verb forms including indicative, subjunctive, and imperative moods.

## Features ✨

- **🔍 Verb Search** - Search and browse 637 Spanish verbs with autocomplete
- **📚 Complete Conjugation Tables** - View all conjugations organized by mood and tense
- **✅ Interactive Quizzes** - Fill-in-the-blank quizzes with instant feedback
- **⌨️ Spanish Keyboard** - Built-in special characters (á é í ó ú ñ ü ¡ ¿)
- **✏️ Accent-Insensitive** - Answers accepted with or without accents
- **📱 Offline-First** - All features work without internet connection
- **🎨 Clean Design** - Beautiful, minimal UI with thoughtful color scheme
- **🇪🇸 Vosotros Forms** - Complete support for Peninsular Spanish

## Screenshots

_Screenshots coming soon_

## Tech Stack 🛠️

- **Framework:** React Native + Expo
- **Language:** TypeScript
- **Database:** SQLite (bundled, 11 MB)
- **Navigation:** React Navigation
- **Data Source:** [Fred Jehle Spanish Verb Database](https://github.com/ghidinelli/fred-jehle-spanish-verbs)

## Installation 📲

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Expo Go app (for testing on physical devices)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/cobbinma/tiempo.git
   cd tiempo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Project Structure 📁

```
tiempo/
├── assets/
│   └── database/
│       ├── tiempo.db              # SQLite database (11 MB, bundled)
│       ├── jehle_verb_lookup.json # Source JSON data
│       └── jehle_verb_sqlite3.sql # Source SQL file
├── scripts/
│   └── convertToSQLite.js         # Database conversion script
├── src/
│   ├── components/
│   │   ├── Card.tsx               # Reusable card component
│   │   ├── CustomButton.tsx       # Styled button
│   │   ├── LoadingSpinner.tsx     # Loading indicator
│   │   └── SpanishKeyboard.tsx    # Special character keyboard
│   ├── constants/
│   │   └── Colors.ts              # Theme colors and styles
│   ├── database/
│   │   └── db.ts                  # Database access layer
│   ├── navigation/
│   │   └── AppNavigator.tsx       # React Navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Landing screen
│   │   ├── SearchScreen.tsx       # Verb search
│   │   ├── VerbDetailScreen.tsx   # Conjugation tables
│   │   ├── QuizSetupScreen.tsx    # Quiz configuration
│   │   ├── QuizScreen.tsx         # Interactive quiz
│   │   └── ResultsScreen.tsx      # Quiz results
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   └── utils/
│       └── validation.ts          # Answer validation logic
├── App.tsx                        # Main app entry point
├── app.json                       # Expo configuration
└── package.json                   # Dependencies
```

## Usage 📖

### Search Verbs

1. From the home screen, tap "Search Verbs"
2. Start typing a Spanish verb (e.g., "hablar")
3. Select a verb from the autocomplete results
4. View complete conjugation tables organized by mood and tense

### Practice with Quizzes

1. From the home screen, tap "Practice Quiz"
2. Configure your quiz:
   - **Verb**: Random or specific verb
   - **Moods**: Indicative, Subjunctive, Imperative
   - **Tenses**: Present, Preterite, Imperfect, Future, etc.
   - **Questions**: 5, 10, 15, 20, or 25
3. Tap "Start Quiz"
4. Type the conjugated form (with or without accents)
5. Get instant feedback
6. Review your results at the end

### Default Quiz Settings

- **Mood:** Indicative (most common for beginners)
- **Tense:** Present (most commonly learned first)
- **Questions:** 10

## Database 📊

**Statistics:**
- **Verbs:** 637 unique Spanish verbs
- **Conjugations:** 67,226 conjugated forms
- **Database Size:** 11.20 MB (bundled with app)
- **Moods:** Indicativo, Subjuntivo, Imperativo Afirmativo, Imperativo Negativo
- **Tenses:** 10+ tenses per mood including perfect forms

**Schema:**
```sql
CREATE TABLE verbs (
  infinitive TEXT PRIMARY KEY,
  translation TEXT NOT NULL
);

CREATE TABLE conjugations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  infinitive TEXT NOT NULL,
  mood TEXT NOT NULL,
  tense TEXT NOT NULL,
  performer TEXT NOT NULL,
  performer_en TEXT NOT NULL,
  conjugated_form TEXT NOT NULL,
  FOREIGN KEY (infinitive) REFERENCES verbs(infinitive)
);
```

## Development 💻

### Rebuild Database

If you need to regenerate the database:

```bash
node scripts/convertToSQLite.js
```

### Run Tests

```bash
npm test
```

### Build for Production

```bash
# iOS
npm run build:ios

# Android
npm run build:android
```

## Color Palette 🎨

Tiempo uses a carefully selected color palette from [Coolors](https://coolors.co/264653-2a9d8f-e9c46a-f4a261-e76f51):

- **Primary:** `#264653` (Deep blue-green)
- **Secondary:** `#2A9D8F` (Teal)
- **Accent 1:** `#E9C46A` (Warm yellow)
- **Accent 2:** `#F4A261` (Orange)
- **Accent 3:** `#E76F51` (Coral red)

## Data Attribution 📚

This app uses the **Fred Jehle Spanish Verb Database**, compiled by [@ghidinelli](https://github.com/ghidinelli).

- **Source:** [github.com/ghidinelli/fred-jehle-spanish-verbs](https://github.com/ghidinelli/fred-jehle-spanish-verbs)
- **License:** Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License (CC BY-NC-SA 3.0)
- **Coverage:** 600+ verbs with complete conjugations

Tiempo is a **non-commercial educational tool** built for Spanish language learners.

## License 📄

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License** to comply with the Fred Jehle database license.

### Summary

- ✅ You can use, modify, and distribute this app
- ✅ You must give appropriate credit
- ✅ You must distribute under the same license
- ❌ You cannot use it for commercial purposes

See the [full license](https://creativecommons.org/licenses/by-nc-sa/3.0/) for details.

## Future Enhancements 🚀

Potential features for future versions:

- Progress tracking and statistics
- Spaced repetition algorithm
- Audio pronunciation
- Multiple choice quiz mode
- Timed challenges
- Difficulty levels (common vs. rare verbs)
- Dark mode
- Export/share results
- Verb favorites/bookmarks

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support 💬

If you encounter any issues or have suggestions:

- Open an issue on [GitHub](https://github.com/cobbinma/tiempo/issues)
- Contact: cobbinma@gmail.com

## Acknowledgments 🙏

- **Fred Jehle** - Original verb database creator
- **@ghidinelli** - Database compilation and maintenance
- Spanish language learners worldwide for inspiration

---

**Made with ❤️ for Spanish learners**

*¡Buena suerte con tu español!* 🇪🇸
