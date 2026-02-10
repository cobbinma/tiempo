const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const INPUT_FILE = path.join(__dirname, '../assets/database/jehle_verb_sqlite3.sql');
const OUTPUT_FILE = path.join(__dirname, '../assets/database/tiempo.db');

console.log('🚀 Starting database conversion...');
console.log(`📂 Input: ${INPUT_FILE}`);
console.log(`📂 Output: ${OUTPUT_FILE}`);

// Delete existing database if it exists
if (fs.existsSync(OUTPUT_FILE)) {
  console.log('🗑️  Removing existing database...');
  fs.unlinkSync(OUTPUT_FILE);
}

// Create database
console.log('🔨 Creating SQLite database...');
const db = new Database(OUTPUT_FILE);

// Read and execute the SQL file
console.log('📖 Reading SQL file...');
const sql = fs.readFileSync(INPUT_FILE, 'utf8');

// Execute the SQL (this creates the original tables and inserts data)
console.log('⚙️  Executing SQL statements...');
db.exec(sql);

console.log('📋 Creating optimized tables for Tiempo...');

// Create our optimized tables
db.exec(`
  -- Create simplified verbs table
  CREATE TABLE IF NOT EXISTS tiempo_verbs (
    infinitive TEXT PRIMARY KEY,
    translation TEXT NOT NULL
  );

  -- Create normalized conjugations table
  CREATE TABLE IF NOT EXISTS tiempo_conjugations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    infinitive TEXT NOT NULL,
    mood TEXT NOT NULL,
    tense TEXT NOT NULL,
    performer TEXT NOT NULL,
    performer_en TEXT NOT NULL,
    conjugated_form TEXT NOT NULL,
    FOREIGN KEY (infinitive) REFERENCES tiempo_verbs(infinitive)
  );

  CREATE INDEX idx_infinitive ON tiempo_conjugations(infinitive);
  CREATE INDEX idx_mood_tense ON tiempo_conjugations(mood, tense);
  CREATE INDEX idx_search ON tiempo_verbs(infinitive);
`);

console.log('📝 Populating tiempo_verbs table...');

// Get unique verbs with their translations
db.exec(`
  INSERT INTO tiempo_verbs (infinitive, translation)
  SELECT DISTINCT infinitive, verb_english
  FROM verbs
  WHERE verb_english IS NOT NULL
  GROUP BY infinitive;
`);

console.log('📝 Converting conjugations to normalized format...');

// Performer mappings
const performers = [
  { form: 'form_1s', performer: 'yo', performer_en: 'I' },
  { form: 'form_2s', performer: 'tú', performer_en: 'you (informal)' },
  { form: 'form_3s', performer: 'él/ella/usted', performer_en: 'he/she/you (formal)' },
  { form: 'form_1p', performer: 'nosotros/nosotras', performer_en: 'we' },
  { form: 'form_2p', performer: 'vosotros/vosotras', performer_en: 'you all (informal)' },
  { form: 'form_3p', performer: 'ellos/ellas/ustedes', performer_en: 'they/you all (formal)' }
];

// Insert conjugations for each performer
const insertConjugation = db.prepare(`
  INSERT INTO tiempo_conjugations (infinitive, mood, tense, performer, performer_en, conjugated_form)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction(() => {
  const rows = db.prepare('SELECT * FROM verbs').all();
  
  let count = 0;
  for (const row of rows) {
    for (const p of performers) {
      const conjugatedForm = row[p.form];
      if (conjugatedForm && conjugatedForm.trim() !== '') {
        insertConjugation.run(
          row.infinitive,
          row.mood,
          row.tense,
          p.performer,
          p.performer_en,
          conjugatedForm
        );
        count++;
      }
    }
  }
  return count;
});

const conjugationCount = insertMany();

console.log('🗑️  Dropping original tables...');
db.exec(`
  DROP TABLE IF EXISTS verbs;
  DROP TABLE IF EXISTS infinitive;
  DROP TABLE IF EXISTS mood;
  DROP TABLE IF EXISTS tense;
  DROP TABLE IF EXISTS gerund;
  DROP TABLE IF EXISTS pastparticiple;
`);

console.log('🔄 Renaming tiempo tables to final names...');
db.exec(`
  ALTER TABLE tiempo_verbs RENAME TO verbs;
  ALTER TABLE tiempo_conjugations RENAME TO conjugations;
`);

// Get statistics
const verbCount = db.prepare('SELECT COUNT(*) as count FROM verbs').get().count;
const conjugCount = db.prepare('SELECT COUNT(*) as count FROM conjugations').get().count;

console.log('\n✅ Database conversion complete!');
console.log(`📊 Statistics:`);
console.log(`   - Unique verbs: ${verbCount}`);
console.log(`   - Total conjugations: ${conjugCount}`);
console.log(`   - Database size: ${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2)} MB`);

// Verify data integrity
console.log('\n🔍 Verifying data integrity...');
const sampleVerb = db.prepare('SELECT * FROM verbs LIMIT 1').get();
const sampleConjugations = db.prepare('SELECT * FROM conjugations WHERE infinitive = ? LIMIT 6').all(sampleVerb.infinitive);

console.log(`\n📌 Sample verb: ${sampleVerb.infinitive} (${sampleVerb.translation})`);
console.log('   Sample conjugations:');
sampleConjugations.forEach(conj => {
  console.log(`   - ${conj.mood} ${conj.tense} (${conj.performer}): ${conj.conjugated_form}`);
});

// Test a search query
console.log('\n🔍 Testing search functionality...');
const searchResults = db.prepare("SELECT * FROM verbs WHERE infinitive LIKE 'habl%' LIMIT 3").all();
console.log('   Search results for "habl%":');
searchResults.forEach(v => console.log(`   - ${v.infinitive}: ${v.translation}`));

// Close database
db.close();

console.log('\n🎉 Done! Database is ready to be bundled with the app.');
