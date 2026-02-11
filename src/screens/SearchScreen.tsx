import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Verb } from '../types';
import { searchVerbs, getAllVerbs } from '../database/db';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}

interface AnimatedVerbCardProps {
  item: Verb;
  index: number;
  onVerbPress: (verb: Verb) => void;
  onPracticePress: (verb: Verb) => void;
  isFavorite: boolean;
}

const AnimatedVerbCard = ({ item, index, onVerbPress, onPracticePress, isFavorite }: AnimatedVerbCardProps) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);
  const { colors } = useTheme();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Card style={styles.verbCard}>
        <TouchableOpacity onPress={() => onVerbPress(item)} activeOpacity={0.7}>
          <View style={styles.verbHeader}>
            <View style={styles.verbTextGroup}>
              <View style={styles.verbTitleRow}>
                {isFavorite && <Text style={styles.favoriteIndicator}>★</Text>}
                <Text style={[styles.verbInfinitive, { color: colors.text }]}>{item.infinitive}</Text>
              </View>
              <Text style={[styles.verbTranslation, { color: colors.textLight }]}>{item.translation}</Text>
            </View>
            <Text style={styles.verbIcon}>📖</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonRow}>
          <CustomButton
            title="View All"
            onPress={() => onVerbPress(item)}
            variant="outline"
            size="small"
            style={styles.cardButton}
          />
          <CustomButton
            title="Practice"
            onPress={() => onPracticePress(item)}
            variant="secondary"
            size="small"
            style={styles.cardButton}
          />
        </View>
      </Card>
    </Animated.View>
  );
};

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(false);
  const { isFavorite } = useFavorites();
  const { colors } = useTheme();

  // Load all verbs on mount
  useEffect(() => {
    loadAllVerbs();
  }, []);

  const loadAllVerbs = async () => {
    setLoading(true);
    try {
      const allVerbs = await getAllVerbs();
      setResults(allVerbs);
    } catch (error) {
      console.error('Error loading verbs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        // When query is cleared, reload all verbs
        loadAllVerbs();
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const verbResults = await searchVerbs(searchQuery);
      setResults(verbResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerbPress = (verb: Verb) => {
    navigation.navigate('VerbDetail', { infinitive: verb.infinitive });
  };

  const handlePracticePress = (verb: Verb) => {
    navigation.navigate('QuizSetup', { verb: verb.infinitive });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Search Verbs</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <View style={[styles.searchWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search in Spanish or English..."
            placeholderTextColor={colors.textLight}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <LoadingSpinner message={query.trim() ? "Searching..." : "Loading verbs..."} />
        </View>
      ) : results.length > 0 ? (
        <>
          <View style={styles.resultHeader}>
            <Text style={[styles.resultCount, { color: colors.textLight }]}>
              {query.trim() 
                ? `${results.length} ${results.length === 1 ? 'verb' : 'verbs'} found`
                : `All ${results.length} verbs`
              }
            </Text>
          </View>
          <FlatList
            data={results}
            keyExtractor={(item) => item.infinitive}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item, index }) => (
              <AnimatedVerbCard
                item={item}
                index={index}
                onVerbPress={handleVerbPress}
                onPracticePress={handlePracticePress}
                isFavorite={isFavorite(item.infinitive)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : query.trim() ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🤔</Text>
          <Text style={[styles.noResults, { color: colors.text }]}>No verbs found</Text>
          <Text style={[styles.noResultsSubtext, { color: colors.textLight }]}>Try searching for a different verb</Text>
        </View>
      ) : (
        <View style={styles.centered}>
          <LoadingSpinner message="Loading verbs..." />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
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
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 2,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  clearIcon: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  resultHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  resultCount: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  listContainer: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  verbCard: {
    marginBottom: SPACING.xs,
  },
  verbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  verbTextGroup: {
    flex: 1,
  },
  verbTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  favoriteIndicator: {
    fontSize: 16,
    color: COLORS.warning,
  },
  verbInfinitive: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  verbTranslation: {
    fontSize: FONT_SIZES.md,
  },
  verbIcon: {
    fontSize: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cardButton: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  noResults: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  noResultsSubtext: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
});
