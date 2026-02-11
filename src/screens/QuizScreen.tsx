import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, QuizResult, QuizSession } from '../types';
import { useQuizSession } from '../hooks/useQuizSession';
import CustomButton from '../components/CustomButton';
import Card from '../components/Card';
import SpanishKeyboard from '../components/SpanishKeyboard';
import { isAnswerCorrect } from '../utils/validation';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';
import { speakSpanish } from '../utils/speech';
import { useTheme } from '../hooks/useTheme';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

interface QuizScreenProps {
  navigation: QuizScreenNavigationProp;
  route: QuizScreenRouteProp;
}

export default function QuizScreen({ navigation, route }: QuizScreenProps) {
  const { currentSession: initialSession, setCurrentSession } = useQuizSession();
  const { colors } = useTheme();
  
  const [session, setSession] = useState<QuizSession | null>(initialSession);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const feedbackScale = useRef(new Animated.Value(0)).current;
  
  // Keep track of the latest session state including pending updates
  const latestSessionRef = useRef<QuizSession | null>(initialSession);

  // Redirect if no session
  useEffect(() => {
    if (!initialSession) {
      // Use replace to prevent back navigation issues
      navigation.replace('Home');
    }
  }, [initialSession, navigation]);
  
  // Update the ref when session changes
  useEffect(() => {
    if (session) {
      latestSessionRef.current = session;
    }
  }, [session]);

  // Don't render if no session
  if (!session) {
    return null;
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  const handleSubmit = () => {
    if (!session) return; // Safety check
    
    const correct = isAnswerCorrect(userAnswer, currentQuestion.correctAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);

    // Create result
    const result: QuizResult = {
      question: currentQuestion,
      userAnswer,
      isCorrect: correct,
    };

    // Update session with new result and score
    const updatedResults = [...session.results, result];
    const updatedScore = correct ? session.score + 1 : session.score;

    const updatedSession = {
      ...session,
      results: updatedResults,
      score: updatedScore,
    };

    // Update both state and ref immediately
    setSession(updatedSession);
    latestSessionRef.current = updatedSession;

    // Animate feedback
    Animated.spring(feedbackScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    // Always use the latest session from ref
    const sessionToUse = latestSessionRef.current;
    
    // Safety check
    if (!sessionToUse || !sessionToUse.questions) {
      console.error('Invalid session state in handleNext');
      return;
    }
    
    const nextIndex = sessionToUse.currentQuestionIndex + 1;

    if (nextIndex < sessionToUse.questions.length) {
      // Move to next question
      const nextSession = {
        ...sessionToUse,
        currentQuestionIndex: nextIndex,
      };
      setSession(nextSession);
      latestSessionRef.current = nextSession;
      setUserAnswer('');
      setShowFeedback(false);
      feedbackScale.setValue(0);
      // Removed inputRef.current?.focus() to keep keyboard minimized
    } else {
      // Quiz complete, navigate to results
      // Save the final session state to the global store
      setCurrentSession({ ...sessionToUse, currentQuestionIndex: nextIndex });
      navigation.replace('Results');
    }
  };

  const insertCharacter = (char: string) => {
    setUserAnswer((prev) => prev + char);
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Quiz?',
      'Are you sure you want to quit? Your progress will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            // Clear session first
            setCurrentSession(null);
            // Use replace to prevent back navigation
            navigation.replace('Home');
          },
        },
      ]
    );
  };

  const speakInfinitive = () => {
    speakSpanish(currentQuestion.infinitive);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress bar with exit button */}
        <View style={[styles.progressContainer, { backgroundColor: colors.card }]}>
          <View style={styles.progressHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.progressText, { color: colors.text }]}>
                Question {session.currentQuestionIndex + 1} / {session.questions.length}
              </Text>
              <Text style={styles.scoreText}>
                Score: {session.score} / {session.currentQuestionIndex + (showFeedback ? 1 : 0)}
              </Text>
            </View>
            <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
              <Text style={styles.exitButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Question card with keyboard dismiss */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Card style={styles.questionCard}>
            <View style={[styles.verbInfo, { borderBottomColor: colors.border }]}>
              <TouchableOpacity 
                onPress={speakInfinitive} 
                style={styles.infinitiveRow}
                activeOpacity={0.7}
              >
                <Text style={styles.infinitive}>{currentQuestion.infinitive}</Text>
                <Text style={styles.translation}>{currentQuestion.translation}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.questionInfo}>
              <Text style={styles.mood}>{currentQuestion.mood}</Text>
              <Text style={styles.tense}>{currentQuestion.tense}</Text>
            </View>

            <View style={styles.performerContainer}>
              <Text style={styles.performer}>{currentQuestion.performer}</Text>
              <Text style={styles.performerEn}>({currentQuestion.performer_en})</Text>
            </View>

            {/* Answer input */}
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                showFeedback && (isCorrect ? styles.inputCorrect : styles.inputIncorrect),
              ]}
              value={userAnswer}
              onChangeText={setUserAnswer}
              placeholder="Type conjugation..."
              placeholderTextColor={COLORS.textLight}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!showFeedback}
              onSubmitEditing={handleSubmit}
            />

            {/* Feedback */}
            {showFeedback && (
              <Animated.View
                style={[
                  styles.feedback,
                  isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
                  { transform: [{ scale: feedbackScale }] },
                ]}
              >
                {isCorrect ? (
                  <>
                    <Text style={styles.feedbackEmoji}>🎉</Text>
                    <Text style={[styles.feedbackText, { color: COLORS.success }]}>¡Correcto!</Text>
                  </>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.feedbackEmoji}>💭</Text>
                    <Text style={[styles.feedbackText, { color: COLORS.error }]}>Not quite</Text>
                    <Text style={styles.correctAnswer}>
                      Correct: {currentQuestion.correctAnswer}
                    </Text>
                  </View>
                )}
              </Animated.View>
            )}

            {/* Submit/Continue button */}
            {!showFeedback ? (
              <CustomButton
                title="Submit"
                onPress={handleSubmit}
                variant="secondary"
                size="large"
                disabled={!userAnswer.trim()}
                style={styles.button}
              />
            ) : (
              !isCorrect && (
                <CustomButton
                  title="Continue"
                  onPress={() => handleNext()}
                  variant="primary"
                  size="large"
                  style={styles.button}
                />
              )
            )}
          </Card>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {/* Spanish keyboard */}
        <SpanishKeyboard onCharacterPress={insertCharacter} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    padding: SPACING.lg,
    borderBottomWidth: 0,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 10,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.round,
  },
  progressText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  scoreText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    marginTop: SPACING.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  exitButton: {
    backgroundColor: COLORS.backgroundDark,
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  exitButtonText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textLight,
    fontWeight: FONT_WEIGHTS.bold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  questionCard: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xxl,
  },
  verbInfo: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.borderLight,
  },
  infinitiveRow: {
    alignItems: 'center',
  },
  infinitive: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  translation: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
    fontWeight: FONT_WEIGHTS.medium,
  },
  questionInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  mood: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.secondary,
    backgroundColor: COLORS.accent2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  tense: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    backgroundColor: COLORS.accent1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  performerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  performer: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  performerEn: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  inputCorrect: {
    borderColor: COLORS.success,
    backgroundColor: '#E8F9F7',
  },
  inputIncorrect: {
    borderColor: COLORS.error,
    backgroundColor: '#FFE8E8',
  },
  feedback: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: '#E8F9F7',
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  feedbackIncorrect: {
    backgroundColor: '#FFE8E8',
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  feedbackEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  feedbackText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  correctAnswer: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    marginTop: SPACING.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  button: {
    marginTop: SPACING.md,
  },
});
