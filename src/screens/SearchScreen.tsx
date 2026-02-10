import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Verb } from '../types';
import { searchVerbs } from '../database/db';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setResults([]);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Spanish verbs..."
          placeholderTextColor={COLORS.textLight}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <LoadingSpinner message="Searching..." />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.infinitive}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleVerbPress(item)}>
              <Card style={styles.verbCard}>
                <Text style={styles.verbInfinitive}>{item.infinitive}</Text>
                <Text style={styles.verbTranslation}>{item.translation}</Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      ) : query.trim() ? (
        <View style={styles.centered}>
          <Text style={styles.noResults}>No verbs found</Text>
        </View>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.noResults}>Start typing to search verbs</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listContainer: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  verbCard: {
    marginBottom: SPACING.sm,
  },
  verbInfinitive: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  verbTranslation: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  noResults: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
