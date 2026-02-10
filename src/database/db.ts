import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system/next';
import {
  Verb,
  Conjugation,
  ConjugationsByMood,
  ConjugationsByTense,
  QuizConfig,
  QuizQuestion,
} from '../types';

const DB_NAME = 'tiempo.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database by copying from assets to the app's document directory
 */
export async function initDatabase(): Promise<void> {
  try {
    const dbPath = `${Paths.document}/SQLite/${DB_NAME}`;
    const dbDir = `${Paths.document}/SQLite`;

    // Ensure SQLite directory exists
    try {
      const dir = new File(dbDir);
      if (!(await dir.exists())) {
        await dir.create({ type: 'directory' });
      }
    } catch (err) {
      // Directory might already exist, that's okay
      console.log('Directory might already exist:', err);
    }

    // Check if database already exists
    const dbFile = new File(dbPath);
    const exists = await dbFile.exists();
    
    if (!exists) {
      // Database doesn't exist, copy from assets
      console.log('📦 Copying database from assets...');
      
      const asset = Asset.fromModule(require('../../assets/database/tiempo.db'));
      await asset.downloadAsync();
      
      if (asset.localUri) {
        const sourceFile = new File(asset.localUri);
        await sourceFile.copy(dbPath);
        console.log('✅ Database copied successfully');
      } else {
        throw new Error('Could not download database asset');
      }
    }

    // Open database
    db = await SQLite.openDatabaseAsync(DB_NAME);
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Get database instance
 */
function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Search for verbs by infinitive (with autocomplete support)
 */
export async function searchVerbs(query: string): Promise<Verb[]> {
  const database = getDatabase();
  
  if (!query || query.trim() === '') {
    return [];
  }

  const results = await database.getAllAsync<Verb>(
    'SELECT infinitive, translation FROM verbs WHERE infinitive LIKE ? ORDER BY infinitive LIMIT 50',
    [`${query}%`]
  );

  return results;
}

/**
 * Get all verbs (for random selection)
 */
export async function getAllVerbs(): Promise<Verb[]> {
  const database = getDatabase();
  
  const results = await database.getAllAsync<Verb>(
    'SELECT infinitive, translation FROM verbs ORDER BY infinitive'
  );

  return results;
}

/**
 * Get a verb by infinitive
 */
export async function getVerb(infinitive: string): Promise<Verb | null> {
  const database = getDatabase();
  
  const result = await database.getFirstAsync<Verb>(
    'SELECT infinitive, translation FROM verbs WHERE infinitive = ?',
    [infinitive]
  );

  return result || null;
}

/**
 * Get all conjugations for a verb, organized by mood and tense
 */
export async function getVerbConjugations(
  infinitive: string
): Promise<ConjugationsByMood> {
  const database = getDatabase();
  
  const results = await database.getAllAsync<Conjugation>(
    `SELECT id, infinitive, mood, tense, performer, performer_en, conjugated_form 
     FROM conjugations 
     WHERE infinitive = ? 
     ORDER BY 
       CASE mood
         WHEN 'Indicativo' THEN 1
         WHEN 'Subjuntivo' THEN 2
         WHEN 'Imperativo Afirmativo' THEN 3
         WHEN 'Imperativo Negativo' THEN 4
         ELSE 5
       END,
       CASE tense
         WHEN 'Presente' THEN 1
         WHEN 'Pretérito' THEN 2
         WHEN 'Imperfecto' THEN 3
         WHEN 'Futuro' THEN 4
         WHEN 'Condicional' THEN 5
         WHEN 'Pretérito perfecto' THEN 6
         WHEN 'Pluscuamperfecto' THEN 7
         WHEN 'Pretérito anterior' THEN 8
         WHEN 'Futuro perfecto' THEN 9
         WHEN 'Condicional perfecto' THEN 10
         ELSE 11
       END,
       CASE performer
         WHEN 'yo' THEN 1
         WHEN 'tú' THEN 2
         WHEN 'él/ella/usted' THEN 3
         WHEN 'nosotros/nosotras' THEN 4
         WHEN 'vosotros/vosotras' THEN 5
         WHEN 'ellos/ellas/ustedes' THEN 6
         ELSE 7
       END`,
    [infinitive]
  );

  // Organize by mood and tense
  const organized: ConjugationsByMood = {};

  results.forEach((conj) => {
    if (!organized[conj.mood]) {
      organized[conj.mood] = {};
    }
    if (!organized[conj.mood][conj.tense]) {
      organized[conj.mood][conj.tense] = [];
    }
    organized[conj.mood][conj.tense].push(conj);
  });

  return organized;
}

/**
 * Generate quiz questions based on configuration
 */
export async function generateQuizQuestions(
  config: QuizConfig
): Promise<QuizQuestion[]> {
  const database = getDatabase();
  
  // Build WHERE clause based on configuration
  const conditions: string[] = [];
  const params: any[] = [];

  // Specific verb or random
  if (config.verb) {
    conditions.push('c.infinitive = ?');
    params.push(config.verb);
  }

  // Filter by moods
  if (config.moods && config.moods.length > 0) {
    const placeholders = config.moods.map(() => '?').join(', ');
    conditions.push(`c.mood IN (${placeholders})`);
    params.push(...config.moods);
  }

  // Filter by tenses
  if (config.tenses && config.tenses.length > 0) {
    const placeholders = config.tenses.map(() => '?').join(', ');
    conditions.push(`c.tense IN (${placeholders})`);
    params.push(...config.tenses);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Query conjugations
  const query = `
    SELECT 
      c.infinitive,
      v.translation,
      c.mood,
      c.tense,
      c.performer,
      c.performer_en,
      c.conjugated_form as correctAnswer
    FROM conjugations c
    INNER JOIN verbs v ON c.infinitive = v.infinitive
    ${whereClause}
    ORDER BY RANDOM()
    LIMIT ?
  `;

  params.push(config.questionCount);

  const results = await database.getAllAsync<QuizQuestion>(query, params);

  return results;
}

/**
 * Get random verbs for quiz practice
 */
export async function getRandomVerbs(count: number): Promise<Verb[]> {
  const database = getDatabase();
  
  const results = await database.getAllAsync<Verb>(
    'SELECT infinitive, translation FROM verbs ORDER BY RANDOM() LIMIT ?',
    [count]
  );

  return results;
}

/**
 * Get database statistics (for debugging)
 */
export async function getDatabaseStats(): Promise<{
  verbCount: number;
  conjugationCount: number;
}> {
  const database = getDatabase();
  
  const verbResult = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM verbs'
  );
  
  const conjugationResult = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM conjugations'
  );

  return {
    verbCount: verbResult?.count || 0,
    conjugationCount: conjugationResult?.count || 0,
  };
}
