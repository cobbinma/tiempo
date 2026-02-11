import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useQuizSession } from '../hooks/useQuizSession';
import CustomButton from '../components/CustomButton';
import Card from '../components/Card';
import { getScoreMessage, getScoreColor } from '../utils/validation';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';
import ConfettiCannon from 'react-native-confetti-cannon';

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;
type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

interface ResultsScreenProps {
  navigation: ResultsScreenNavigationProp;
  route: ResultsScreenRouteProp;
}

export default function ResultsScreen({ navigation, route }: ResultsScreenProps) {
  const { currentSession, setCurrentSession } = useQuizSession();
  const confettiRef = useRef<any>(null);
  
  const session = currentSession;
  const score = session?.score ?? 0;
  const results = session?.results ?? [];
  const questions = session?.questions ?? [];
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const scoreColor = getScoreColor(percentage);
  const scoreMessage = getScoreMessage(percentage);
  const isPerfectScore = percentage === 100;
  
  // Redirect if no session
  useEffect(() => {
    if (!currentSession) {
      navigation.replace('Home');
    }
  }, [currentSession, navigation]);

  // Trigger confetti for perfect score
  useEffect(() => {
    if (isPerfectScore && confettiRef.current && currentSession) {
      // Small delay to let the screen render first
      setTimeout(() => {
        confettiRef.current?.start();
      }, 300);
    }
  }, [isPerfectScore, currentSession]);

  // Don't render if no session
  if (!currentSession) {
    return null;
  }

  const handleTryAgain = () => {
    // Recreate the quiz with the same configuration
    const newSession = {
      ...currentSession,
      results: [],
      currentQuestionIndex: 0,
      score: 0,
    };
    setCurrentSession(newSession);
    navigation.replace('Quiz');
  };

  const handleNewQuiz = () => {
    navigation.navigate('QuizSetup', {});
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti animation for perfect score */}
      {isPerfectScore && (
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut={true}
          explosionSpeed={350}
          fallSpeed={2500}
          colors={[COLORS.primary, COLORS.secondary, COLORS.accent1, COLORS.accent2, '#FF8B94', '#A8E6CF']}
        />
      )}

      {/* Header with home button */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Quiz Results</Text>
        <TouchableOpacity onPress={handleHome} style={styles.homeButton}>
          <Text style={styles.homeButtonText}>🏠</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Score summary */}
        <Card style={styles.summaryCard}>
          {isPerfectScore && (
            <View style={styles.perfectScoreBanner}>
              <Text style={styles.perfectScoreEmoji}>🎉</Text>
              <Text style={styles.perfectScoreTitle}>¡PERFECTO!</Text>
              <Text style={styles.perfectScoreText}>You got every answer correct!</Text>
            </View>
          )}
          <Text style={styles.scoreMessage}>{scoreMessage}</Text>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.scorePercentage, { color: scoreColor }]}>
              {percentage}%
            </Text>
          </View>
          <Text style={styles.scoreDetails}>
            {score} / {totalQuestions} correct
          </Text>
        </Card>

        {/* Detailed results */}
        <Text style={styles.sectionTitle}>Detailed Results</Text>
        {results.map((result, index) => (
          <Card key={index} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.questionNumber}>
                <Text style={styles.questionNumberText}>Q{index + 1}</Text>
              </View>
              <View
                style={[
                  styles.resultBadge,
                  result.isCorrect ? styles.correctBadge : styles.incorrectBadge,
                ]}
              >
                <Text style={styles.badgeText}>
                  {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </Text>
              </View>
            </View>

            <View style={styles.questionDetails}>
              <Text style={styles.verbText}>
                {result.question.infinitive} ({result.question.mood} - {result.question.tense})
              </Text>
              <Text style={styles.performerText}>
                {result.question.performer} ({result.question.performer_en})
              </Text>
            </View>

            <View style={styles.answerSection}>
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>Your answer:</Text>
                <Text
                  style={[
                    styles.answerValue,
                    result.isCorrect ? styles.correctAnswer : styles.incorrectAnswer,
                  ]}
                >
                  {result.userAnswer}
                </Text>
              </View>
              {!result.isCorrect && (
                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>Correct answer:</Text>
                  <Text style={[styles.answerValue, styles.correctAnswerText]}>
                    {result.question.correctAnswer}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        ))}

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Try Again"
            onPress={handleTryAgain}
            variant="secondary"
            size="large"
            style={styles.button}
          />
          <CustomButton
            title="New Quiz"
            onPress={handleNewQuiz}
            variant="primary"
            size="large"
            style={styles.button}
          />
          <CustomButton
            title="Home"
            onPress={handleHome}
            variant="outline"
            size="medium"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: FONT_SIZES.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  summaryCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  perfectScoreBanner: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: '#FFF9E6',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.warning,
    width: '100%',
  },
  perfectScoreEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xs,
  },
  perfectScoreTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  perfectScoreText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
  },
  scoreMessage: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: FONT_WEIGHTS.bold,
  },
  scoreDetails: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  resultCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.sm,
  },
  resultBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  correctBadge: {
    backgroundColor: '#e8f5f3',
  },
  incorrectBadge: {
    backgroundColor: '#fef0ef',
  },
  badgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  questionDetails: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  verbText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  performerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  answerSection: {
    gap: SPACING.sm,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  answerValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  correctAnswer: {
    color: COLORS.success,
  },
  incorrectAnswer: {
    color: COLORS.error,
  },
  correctAnswerText: {
    color: COLORS.success,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  button: {
    width: '100%',
  },
});
