/**
 * The 100 most common Spanish verbs based on frequency studies
 * Sourced from: https://www.reddit.com/r/learnspanish/comments/5wcyb2/a_little_cheat_sheet_i_made_on_the_100_most/
 * 
 * These verbs are essential for Spanish learners and represent the most frequently
 * used verbs in everyday Spanish conversation and writing.
 */

export const COMMON_VERBS = [
  // Top 10 - Most Essential
  'ser',          // to be (permanent)
  'haber',        // to have (auxiliary)
  'estar',        // to be (temporary)
  'tener',        // to have
  'hacer',        // to do, make
  'poder',        // to be able, can
  'decir',        // to say, tell
  'ir',           // to go
  'ver',          // to see
  'dar',          // to give
  
  // 11-20
  'saber',        // to know (facts)
  'querer',       // to want
  'llegar',       // to arrive
  'pasar',        // to pass, happen
  'deber',        // to owe, must
  'poner',        // to put
  'parecer',      // to seem
  'quedar',       // to remain, stay
  'creer',        // to believe
  'hablar',       // to speak
  
  // 21-30
  'llevar',       // to carry, take
  'dejar',        // to leave, let
  'seguir',       // to follow, continue
  'encontrar',    // to find
  'llamar',       // to call
  'venir',        // to come
  'pensar',       // to think
  'salir',        // to leave, go out
  'volver',       // to return
  'tomar',        // to take, drink
  
  // 31-40
  'conocer',      // to know (people/places)
  'vivir',        // to live
  'sentir',       // to feel
  'tratar',       // to treat, try
  'mirar',        // to look at
  'contar',       // to count, tell
  'empezar',      // to begin
  'esperar',      // to wait, hope
  'buscar',       // to look for
  'existir',      // to exist
  
  // 41-50
  'entrar',       // to enter
  'trabajar',     // to work
  'escribir',     // to write
  'perder',       // to lose
  'producir',     // to produce
  'ocurrir',      // to occur
  'entender',     // to understand
  'pedir',        // to ask for
  'recibir',      // to receive
  'recordar',     // to remember
  
  // 51-60
  'terminar',     // to finish
  'permitir',     // to permit
  'aparecer',     // to appear
  'conseguir',    // to get, obtain
  'comenzar',     // to commence
  'servir',       // to serve
  'sacar',        // to take out
  'necesitar',    // to need
  'mantener',     // to maintain
  'resultar',     // to result
  
  // 61-70
  'leer',         // to read
  'caer',         // to fall
  'cambiar',      // to change
  'presentar',    // to present
  'crear',        // to create
  'abrir',        // to open
  'considerar',   // to consider
  'oír',          // to hear
  'acabar',       // to finish
  'cumplir',      // to fulfill
  
  // 71-80
  'realizar',     // to realize, carry out
  'suponer',      // to suppose
  'comprender',   // to understand
  'lograr',       // to achieve
  'explicar',     // to explain
  'reconocer',    // to recognize
  'estudiar',     // to study
  'intentar',     // to try
  'ganar',        // to win, earn
  'formar',       // to form
  
  // 81-90
  'traer',        // to bring
  'ofrecer',      // to offer
  'descubrir',    // to discover
  'levantar',     // to lift, raise
  'acercar',      // to bring closer
  'nacer',        // to be born
  'dirigir',      // to direct
  'correr',       // to run
  'utilizar',     // to use
  'pagar',        // to pay
  
  // 91-100
  'ayudar',       // to help
  'gustar',       // to like
  'jugar',        // to play
  'escuchar',     // to listen
  'mover',        // to move
  'preguntar',    // to ask
  'tocar',        // to touch, play (instrument)
  'mostrar',      // to show
  'amar',         // to love
  'partir',       // to leave, depart
] as const;

/**
 * Check if a verb is in the common verbs list
 */
export function isCommonVerb(infinitive: string): boolean {
  return COMMON_VERBS.includes(infinitive as typeof COMMON_VERBS[number]);
}

/**
 * Get the rank of a verb (1-100) or null if not common
 */
export function getVerbRank(infinitive: string): number | null {
  const index = COMMON_VERBS.indexOf(infinitive as typeof COMMON_VERBS[number]);
  return index === -1 ? null : index + 1;
}
