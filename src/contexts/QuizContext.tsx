import React, { createContext, useContext, useState, useMemo } from 'react';
import { QuizSession } from '../types';

interface QuizContextType {
  currentSession: QuizSession | null;
  setCurrentSession: (session: QuizSession | null) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: React.ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);

  const value = useMemo(
    () => ({ currentSession, setCurrentSession }),
    [currentSession]
  );

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
