// Type definitions for Tiempo app

export interface Verb {
  infinitive: string;
  translation: string;
}

export interface Conjugation {
  id: number;
  infinitive: string;
  mood: string;
  tense: string;
  performer: string;
  performer_en: string;
  conjugated_form: string;
}

export interface ConjugationsByTense {
  [tense: string]: Conjugation[];
}

export interface ConjugationsByMood {
  Indicativo?: ConjugationsByTense;
  Subjuntivo?: ConjugationsByTense;
  'Imperativo Afirmativo'?: ConjugationsByTense;
  'Imperativo Negativo'?: ConjugationsByTense;
}

export interface QuizConfig {
  verb?: string; // Specific verb infinitive or undefined for random
  moods: string[];
  tenses: string[];
  questionCount: number;
}

export interface QuizQuestion {
  infinitive: string;
  translation: string;
  mood: string;
  tense: string;
  performer: string;
  performer_en: string;
  correctAnswer: string;
}

export interface QuizResult {
  question: QuizQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

export interface QuizSession {
  config: QuizConfig;
  questions: QuizQuestion[];
  results: QuizResult[];
  currentQuestionIndex: number;
  score: number;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  VerbDetail: { infinitive: string };
  QuizSetup: { verb?: string };
  Quiz: { session: QuizSession };
  Results: { session: QuizSession };
};
