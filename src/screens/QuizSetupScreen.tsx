import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, QuizConfig, QuizSession } from '../types';
import { generateQuizQuestions, getVerb } from '../database/db';
import CustomButton from '../components/CustomButton';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';

type QuizSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QuizSetup'>;
type QuizSetupScreenRouteProp = RouteProp<RootStackParamList, 'QuizSetup'>;

interface QuizSetupScreenProps {
  navigation: QuizSetupScreenNavigationProp;
  route: QuizSetupScreenRouteProp;
}

const AVAILABLE_MOODS = ['Indicativo', 'Subjuntivo', 'Imperativo Afirmativo', 'Imperativo Negativo'];
const AVAILABLE_TENSES = [
  'Presente',
  'Pretérito',
  'Imperfecto',
  'Futuro',
  'Condicional',
  'Pretérito perfecto',
  'Pluscuamperfecto',
  'Pretérito anterior',
  'Futuro perfecto',
  'Condicional perfecto',
];
const QUESTION_COUNTS = [5, 10, 15, 20, 25];

export default function QuizSetupScreen({ navigation, route }: QuizSetupScreenProps) {
  const preselectedVerb = route.params?.verb;
  
  const [verbInfinitive, setVerbInfinitive] = useState(preselectedVerb || '');
  const [verbTranslation, setVerbTranslation] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>(['Indicativo']);
  const [selectedTenses, setSelectedTenses] = useState<string[]>(['Presente']);
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preselectedVerb) {
      loadVerb(preselectedVerb);
    }
  }, [preselectedVerb]);

  const loadVerb = async (infinitive: string) => {
    const verb = await getVerb(infinitive);
    if (verb) {
      setVerbTranslation(verb.translation);
    }
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const toggleTense = (tense: string) => {
    setSelectedTenses((prev) =>
      prev.includes(tense) ? prev.filter((t) => t !== tense) : [...prev, tense]
    );
  };

  const handleStartQuiz = async () => {
    // Validation
    if (selectedMoods.length === 0) {
      Alert.alert('Error', 'Please select at least one mood');
      return;
    }
    if (selectedTenses.length === 0) {
      Alert.alert('Error', 'Please select at least one tense');
      return;
    }

    setLoading(true);

    try {
      const config: QuizConfig = {
        verb: verbInfinitive || undefined,
        moods: selectedMoods,
        tenses: selectedTenses,
        questionCount,
      };

      const questions = await generateQuizQuestions(config);

      if (questions.length === 0) {
        Alert.alert('Error', 'No questions could be generated with the selected configuration');
        setLoading(false);
        return;
      }

      const session: QuizSession = {
        config,
        questions,
        results: [],
        currentQuestionIndex: 0,
        score: 0,
      };

      navigation.navigate('Quiz', { session });
    } catch (error) {
      console.error('Error generating quiz:', error);
      Alert.alert('Error', 'Failed to generate quiz questions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Generating quiz..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Verb selection */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Verb</Text>
          {verbInfinitive ? (
            <View>
              <Text style={styles.selectedVerb}>{verbInfinitive}</Text>
              <Text style={styles.verbTranslation}>{verbTranslation}</Text>
              <CustomButton
                title="Practice Random Verbs Instead"
                onPress={() => {
                  setVerbInfinitive('');
                  setVerbTranslation('');
                }}
                variant="outline"
                size="small"
                style={styles.changeButton}
              />
            </View>
          ) : (
            <Text style={styles.randomText}>Random verbs</Text>
          )}
        </Card>

        {/* Mood selection */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Moods</Text>
          <View style={styles.checkboxContainer}>
            {AVAILABLE_MOODS.map((mood) => (
              <TouchableOpacity
                key={mood}
                style={styles.checkbox}
                onPress={() => toggleMood(mood)}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    selectedMoods.includes(mood) && styles.checkboxBoxChecked,
                  ]}
                >
                  {selectedMoods.includes(mood) && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Tense selection */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Tenses</Text>
          <View style={styles.checkboxContainer}>
            {AVAILABLE_TENSES.map((tense) => (
              <TouchableOpacity
                key={tense}
                style={styles.checkbox}
                onPress={() => toggleTense(tense)}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    selectedTenses.includes(tense) && styles.checkboxBoxChecked,
                  ]}
                >
                  {selectedTenses.includes(tense) && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{tense}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Question count */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Number of Questions</Text>
          <View style={styles.questionCountContainer}>
            {QUESTION_COUNTS.map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.countButton,
                  questionCount === count && styles.countButtonActive,
                ]}
                onPress={() => setQuestionCount(count)}
              >
                <Text
                  style={[
                    styles.countButtonText,
                    questionCount === count && styles.countButtonTextActive,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Start button */}
        <CustomButton
          title="Start Quiz"
          onPress={handleStartQuiz}
          variant="secondary"
          size="large"
          style={styles.startButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  selectedVerb: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  verbTranslation: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  changeButton: {
    marginTop: SPACING.sm,
  },
  randomText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  checkboxContainer: {
    gap: SPACING.sm,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  checkboxBoxChecked: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  checkboxLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  questionCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  countButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  countButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  countButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  countButtonTextActive: {
    color: COLORS.white,
  },
  startButton: {
    marginTop: SPACING.md,
  },
});
