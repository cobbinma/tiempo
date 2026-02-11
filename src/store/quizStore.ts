import { QuizSession } from '../types';

let currentSession: QuizSession | null = null;
const listeners: Set<(session: QuizSession | null) => void> = new Set();

export const quizStore = {
  getSession: () => currentSession,
  
  setSession: (session: QuizSession | null) => {
    currentSession = session;
    listeners.forEach(listener => listener(currentSession));
  },
  
  subscribe: (listener: (session: QuizSession | null) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  
  clearSession: () => {
    currentSession = null;
    listeners.forEach(listener => listener(null));
  }
};
