import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ConjugationsByMood, Conjugation } from '../types';
import { getVerb, getVerbConjugations } from '../database/db';
import LoadingSpinner from '../components/LoadingSpinner';
import CustomButton from '../components/CustomButton';
import Card from '../components/Card';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';
import { useFavorites } from '../hooks/useFavorites';
import { speakSpanish } from '../utils/speech';
import { useTheme } from '../hooks/useTheme';

type VerbDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VerbDetail'>;
type VerbDetailScreenRouteProp = RouteProp<RootStackParamList, 'VerbDetail'>;

interface VerbDetailScreenProps {
  navigation: VerbDetailScreenNavigationProp;
  route: VerbDetailScreenRouteProp;
}

export default function VerbDetailScreen({ navigation, route }: VerbDetailScreenProps) {
  const { infinitive } = route.params;
  const [loading, setLoading] = useState(true);
  const [translation, setTranslation] = useState('');
  const [conjugations, setConjugations] = useState<ConjugationsByMood>({});
  const [selectedMood, setSelectedMood] = useState('Indicativo');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { colors } = useTheme();

  useEffect(() => {
    loadVerbData();
  }, []);

  const loadVerbData = async () => {
    try {
      const verb = await getVerb(infinitive);
      const conjugationData = await getVerbConjugations(infinitive);
      
      if (verb) {
        setTranslation(verb.translation);
      }
      setConjugations(conjugationData);
    } catch (error) {
      console.error('Error loading verb:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeVerb = () => {
    navigation.navigate('QuizSetup', { verb: infinitive });
  };

  const handlePracticeTense = (mood: string, tense: string) => {
    navigation.navigate('QuizSetup', { verb: infinitive, mood, tense });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(infinitive);
  };

  const speakInfinitive = () => {
    speakSpanish(infinitive);
  };

  const speakConjugation = (conjugatedForm: string) => {
    speakSpanish(conjugatedForm);
  };

  if (loading) {
    return <LoadingSpinner message="Loading verb..." />;
  }

  const moods = Object.keys(conjugations);
  const currentConjugations = conjugations[selectedMood] || {};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with back button */}
      <View style={[styles.topHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Verb Conjugations</Text>
        <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
          <Text style={styles.favoriteButtonText}>
            {isFavorite(infinitive) ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <TouchableOpacity 
          onPress={speakInfinitive} 
          style={styles.header}
          activeOpacity={0.7}
        >
          <Text style={styles.infinitive}>{infinitive}</Text>
          <Text style={styles.translation}>{translation}</Text>
        </TouchableOpacity>

        {/* Mood tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.moodTabs, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodTab,
                selectedMood === mood && styles.moodTabActive,
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text
                style={[
                  styles.moodTabText,
                  { color: selectedMood === mood ? COLORS.secondary : colors.textLight },
                  selectedMood === mood && styles.moodTabTextActive,
                ]}
              >
                {mood}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Conjugation tables */}
        <View style={styles.tablesContainer}>
          {Object.entries(currentConjugations).map(([tense, forms]) => (
            <Card key={tense} style={styles.tenseCard}>
              <View style={styles.tenseHeader}>
                <Text style={styles.tenseTitle}>{tense}</Text>
                <TouchableOpacity 
                  onPress={() => handlePracticeTense(selectedMood, tense)}
                  style={styles.practiceTenseButton}
                >
                  <Text style={styles.practiceTenseText}>Practice</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.table}>
                {forms.map((conj: Conjugation) => (
                  <View key={conj.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.performer, { color: colors.textLight }]}>{conj.performer}</Text>
                    <TouchableOpacity 
                      onPress={() => speakConjugation(conj.conjugated_form)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.conjugatedForm, { color: colors.text }]}>{conj.conjugated_form}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.footer}>
          <CustomButton
            title="Practice This Verb"
            onPress={handlePracticeVerb}
            variant="primary"
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.bold,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontSize: 28,
    color: COLORS.warning,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infinitive: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  translation: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
  },
  moodTabs: {
    borderBottomWidth: 1,
  },
  moodTab: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.transparent,
  },
  moodTabActive: {
    borderBottomColor: COLORS.secondary,
  },
  moodTabText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  moodTabTextActive: {
    fontWeight: FONT_WEIGHTS.semibold,
  },
  tablesContainer: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  tenseCard: {
    marginBottom: SPACING.sm,
  },
  tenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tenseTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
  },
  practiceTenseButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  practiceTenseText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  table: {
    gap: SPACING.sm,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
  },
  performer: {
    fontSize: FONT_SIZES.md,
    flex: 1,
  },
  conjugatedForm: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  footer: {
    padding: SPACING.lg,
  },
});
