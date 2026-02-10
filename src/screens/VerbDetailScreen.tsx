import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ConjugationsByMood, Conjugation } from '../types';
import { getVerb, getVerbConjugations } from '../database/db';
import LoadingSpinner from '../components/LoadingSpinner';
import CustomButton from '../components/CustomButton';
import Card from '../components/Card';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';

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

  if (loading) {
    return <LoadingSpinner message="Loading verb..." />;
  }

  const moods = Object.keys(conjugations);
  const currentConjugations = conjugations[selectedMood] || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.infinitive}>{infinitive}</Text>
          <Text style={styles.translation}>{translation}</Text>
        </View>

        {/* Mood tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodTabs}>
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
              <Text style={styles.tenseTitle}>{tense}</Text>
              <View style={styles.table}>
                {forms.map((conj: Conjugation) => (
                  <View key={conj.id} style={styles.tableRow}>
                    <Text style={styles.performer}>{conj.performer}</Text>
                    <Text style={styles.conjugatedForm}>{conj.conjugated_form}</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    color: COLORS.textLight,
    fontWeight: FONT_WEIGHTS.medium,
  },
  moodTabTextActive: {
    color: COLORS.secondary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  tablesContainer: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  tenseCard: {
    marginBottom: SPACING.sm,
  },
  tenseTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
    marginBottom: SPACING.md,
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
    borderBottomColor: COLORS.border,
  },
  performer: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    flex: 1,
  },
  conjugatedForm: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    padding: SPACING.lg,
  },
});
