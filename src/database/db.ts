import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import {
  Verb,
  Conjugation,
  ConjugationsByMood,
  ConjugationsByTense,
  QuizConfig,
  QuizQuestion,
} from '../types';
import { settingsStore } from '../store/settingsStore';

const DB_NAME = 'tiempo.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database by copying from assets to the app's document directory
 */
export async function initDatabase(): Promise<void> {
  try {
    // Open or create the database - expo-sqlite will handle creation
    // We need to copy our pre-populated database from assets
    const dbDir = `${FileSystem.documentDirectory}SQLite`;
    const dbPath = `${dbDir}/${DB_NAME}`;

    // Create SQLite directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(dbDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
      console.log('📁 Created SQLite directory');
    }

    // Check if database file exists
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    
    if (!fileInfo.exists) {
      console.log('📦 Copying database from assets...');
      
      // Load the asset
      const asset = Asset.fromModule(require('../../assets/database/tiempo.db'));
      await asset.downloadAsync();
      
      if (!asset.localUri) {
        throw new Error('Failed to download database asset');
      }

      // Copy from asset to document directory
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: dbPath,
      });
      
      console.log('✅ Database copied successfully');
    } else {
      console.log('📊 Database already exists');
    }

    // Open the database
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
 * Search for verbs by infinitive or English translation (with autocomplete support)
 */
export async function searchVerbs(query: string): Promise<Verb[]> {
  try {
    const database = getDatabase();
    
    if (!query || query.trim() === '') {
      return [];
    }

    // Search both Spanish infinitive and English translation
    const results = await database.getAllAsync<Verb>(
      `SELECT infinitive, translation 
       FROM verbs 
       WHERE infinitive LIKE ? OR translation LIKE ? 
       ORDER BY 
         CASE 
           WHEN infinitive LIKE ? THEN 1
           WHEN translation LIKE ? THEN 2
           ELSE 3
         END,
         infinitive 
       LIMIT 50`,
      [`${query}%`, `%${query}%`, `${query}%`, `${query}%`]
    );

    return results;
  } catch (error) {
    console.error('Error searching verbs:', error);
    throw error;
  }
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
 * Get verbs by a list of infinitives (for favorites)
 */
export async function getVerbsByInfinitives(infinitives: string[]): Promise<Verb[]> {
  if (infinitives.length === 0) {
    return [];
  }

  const database = getDatabase();
  const placeholders = infinitives.map(() => '?').join(', ');
  
  const results = await database.getAllAsync<Verb>(
    `SELECT infinitive, translation FROM verbs WHERE infinitive IN (${placeholders}) ORDER BY infinitive`,
    infinitives
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
  
  // Get settings to check if vosotros should be included
  const settings = settingsStore.getSettings();
  
  const results = await database.getAllAsync<Conjugation>(
    `SELECT id, infinitive, mood, tense, performer, performer_en, conjugated_form 
     FROM conjugations 
     WHERE infinitive = ? ${!settings.useVosotros ? "AND performer NOT LIKE '%vosotros%'" : ''}
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
  
  // Get settings to check if vosotros should be included
  const settings = settingsStore.getSettings();
  
  // Build WHERE clause based on configuration
  const conditions: string[] = [];
  const params: any[] = [];

  // If favoritesOnly is true, filter by favorites
  if (config.favoritesOnly && config.favoriteInfinitives && config.favoriteInfinitives.length > 0) {
    const placeholders = config.favoriteInfinitives.map(() => '?').join(', ');
    conditions.push(`c.infinitive IN (${placeholders})`);
    params.push(...config.favoriteInfinitives);
  } else if (config.verb) {
    // Use specific verb if provided and not favorites mode
    conditions.push('c.infinitive = ?');
    params.push(config.verb);
  }
  // If no verb and not favorites, it will select from all verbs randomly

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

  // Filter out vosotros/vosotras if the setting is disabled
  if (!settings.useVosotros) {
    conditions.push("c.performer NOT LIKE '%vosotros%'");
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Query conjugations - get ALL matching conjugations or limit if specified
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
    ${config.questionCount ? 'LIMIT ?' : ''}
  `;

  if (config.questionCount) {
    params.push(config.questionCount);
  }

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
