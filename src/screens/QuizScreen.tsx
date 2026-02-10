import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, QuizResult, QuizSession } from '../types';
import CustomButton from '../components/CustomButton';
import Card from '../components/Card';
import SpanishKeyboard from '../components/SpanishKeyboard';
import { isAnswerCorrect } from '../utils/validation';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

interface QuizScreenProps {
  navigation: QuizScreenNavigationProp;
  route: QuizScreenRouteProp;
}

export default function QuizScreen({ navigation, route }: QuizScreenProps) {
  const { session: initialSession } = route.params;
  const [session, setSession] = useState<QuizSession>(initialSession);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const feedbackScale = useRef(new Animated.Value(0)).current;

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  const handleSubmit = () => {
    const correct = isAnswerCorrect(userAnswer, currentQuestion.correctAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);

    // Create result
    const result: QuizResult = {
      question: currentQuestion,
      userAnswer,
      isCorrect: correct,
    };

    // Update session
    const updatedResults = [...session.results, result];
    const updatedScore = correct ? session.score + 1 : session.score;

    setSession({
      ...session,
      results: updatedResults,
      score: updatedScore,
    });

    // Animate feedback
    Animated.spring(feedbackScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

    // Auto-advance if correct
    if (correct) {
      setTimeout(() => {
        handleNext();
      }, 1500);
    }
  };

  const handleNext = () => {
    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex < session.questions.length) {
      // Move to next question
      setSession({
        ...session,
        currentQuestionIndex: nextIndex,
      });
      setUserAnswer('');
      setShowFeedback(false);
      feedbackScale.setValue(0);
      inputRef.current?.focus();
    } else {
      // Quiz complete, navigate to results
      navigation.replace('Results', { session: { ...session, currentQuestionIndex: nextIndex } });
    }
  };

  const insertCharacter = (char: string) => {
    setUserAnswer((prev) => prev + char);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Question {session.currentQuestionIndex + 1} / {session.questions.length}
          </Text>
          <Text style={styles.scoreText}>
            Score: {session.score} / {session.currentQuestionIndex + (showFeedback ? 1 : 0)}
          </Text>
        </View>

        {/* Question card */}
        <View style={styles.content}>
          <Card style={styles.questionCard}>
            <View style={styles.verbInfo}>
              <Text style={styles.infinitive}>{currentQuestion.infinitive}</Text>
              <Text style={styles.translation}>{currentQuestion.translation}</Text>
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
              autoFocus
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
                  <Text style={styles.feedbackText}>¡Correcto!</Text>
                ) : (
                  <View>
                    <Text style={styles.feedbackText}>Incorrect</Text>
                    <Text style={styles.correctAnswer}>
                      Correct answer: {currentQuestion.correctAnswer}
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
                  onPress={handleNext}
                  variant="primary"
                  size="large"
                  style={styles.button}
                />
              )
            )}
          </Card>
        </View>

        {/* Spanish keyboard */}
        <SpanishKeyboard onCharacterPress={insertCharacter} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.medium,
  },
  scoreText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  questionCard: {
    padding: SPACING.lg,
  },
  verbInfo: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infinitive: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  translation: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
  questionInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  mood: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.secondary,
  },
  tense: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.accent2,
  },
  performerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  performer: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  performerEn: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  inputCorrect: {
    borderColor: COLORS.success,
    backgroundColor: '#e8f5f3',
  },
  inputIncorrect: {
    borderColor: COLORS.error,
    backgroundColor: '#fef0ef',
  },
  feedback: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: '#e8f5f3',
  },
  feedbackIncorrect: {
    backgroundColor: '#fef0ef',
  },
  feedbackText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  correctAnswer: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  button: {
    marginTop: SPACING.md,
  },
});
