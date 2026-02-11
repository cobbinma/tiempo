import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Verb } from '../types';
import { getVerb } from '../database/db';
import { COMMON_VERBS } from '../constants/commonVerbs';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';
import { useTheme } from '../hooks/useTheme';

type CommonVerbsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CommonVerbs'>;

interface CommonVerbsScreenProps {
  navigation: CommonVerbsScreenNavigationProp;
}

interface AnimatedVerbCardProps {
  item: Verb & { rank: number };
  index: number;
  onVerbPress: (verb: Verb) => void;
  onPracticePress: (verb: Verb) => void;
}

const AnimatedVerbCard = ({ item, index, onVerbPress, onPracticePress }: AnimatedVerbCardProps) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);
  const { colors } = useTheme();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: Math.min(index * 30, 500), // Cap delay at 500ms
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: Math.min(index * 30, 500),
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
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{item.rank}</Text>
            </View>
            <View style={styles.verbInfo}>
              <Text style={[styles.verbInfinitive, { color: colors.text }]}>{item.infinitive}</Text>
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

export default function CommonVerbsScreen({ navigation }: CommonVerbsScreenProps) {
  const [verbs, setVerbs] = useState<(Verb & { rank: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    loadCommonVerbs();
  }, []);

  const loadCommonVerbs = async () => {
    try {
      setLoading(true);
      const verbsWithData = await Promise.all(
        COMMON_VERBS.map(async (infinitive, index) => {
          const verbData = await getVerb(infinitive);
          return verbData ? { ...verbData, rank: index + 1 } : null;
        })
      );
      
      // Filter out any nulls (verbs not found in database)
      const validVerbs = verbsWithData.filter((v): v is Verb & { rank: number } => v !== null);
      setVerbs(validVerbs);
    } catch (error) {
      console.error('Error loading common verbs:', error);
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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={[styles.backButton, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Common Verbs</Text>
          <View style={styles.headerSpacer} />
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Common Verbs</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={verbs}
        keyExtractor={(item) => item.infinitive}
        renderItem={({ item, index }) => (
          <AnimatedVerbCard
            item={item}
            index={index}
            onVerbPress={handleVerbPress}
            onPracticePress={handlePracticePress}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  verbCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  verbHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  verbInfo: {
    flex: 1,
  },
  verbInfinitive: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 2,
  },
  verbTranslation: {
    fontSize: FONT_SIZES.sm,
  },
  verbIcon: {
    fontSize: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cardButton: {
    flex: 1,
  },
});
