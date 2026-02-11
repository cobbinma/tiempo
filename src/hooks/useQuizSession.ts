import { useState, useEffect } from 'react';
import { quizStore } from '../store/quizStore';
import { QuizSession } from '../types';

export function useQuizSession() {
  const [session, setSession] = useState<QuizSession | null>(quizStore.getSession());

  useEffect(() => {
    const unsubscribe = quizStore.subscribe((newSession) => {
      setSession(newSession);
    });
    return unsubscribe;
  }, []);

  return {
    currentSession: session,
    setCurrentSession: quizStore.setSession,
  };
}
