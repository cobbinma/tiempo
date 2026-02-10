/**
 * Normalize Spanish text by removing accents and converting to lowercase
 * This allows us to accept answers with or without accents
 */
export function normalizeSpanish(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritical marks
}

/**
 * Check if user's answer matches the correct answer (accent-insensitive)
 */
export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUser = normalizeSpanish(userAnswer);
  const normalizedCorrect = normalizeSpanish(correctAnswer);
  
  return normalizedUser === normalizedCorrect;
}

/**
 * Get a user-friendly message for quiz results
 */
export function getScoreMessage(percentage: number): string {
  if (percentage >= 90) return '¡Excelente!';
  if (percentage >= 80) return '¡Muy bien!';
  if (percentage >= 70) return '¡Bien hecho!';
  if (percentage >= 60) return 'Buen intento';
  if (percentage >= 50) return 'Sigue practicando';
  return 'No te rindas';
}

/**
 * Get color based on score percentage
 */
export function getScoreColor(percentage: number): string {
  if (percentage >= 70) return '#2A9D8F'; // success (green)
  if (percentage >= 50) return '#E9C46A'; // warning (yellow)
  return '#E76F51'; // error (red)
}
