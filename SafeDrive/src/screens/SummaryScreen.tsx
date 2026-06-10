import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DriveStorage } from '../storage/DriveStorage';
import EventCard from '../components/EventCard';
import ScoreCard from '../components/ScoreCard';
import { colors, radius, spacing } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';


const SummaryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Summary'>>();
  const route = useRoute();
  const { session, reviewMode } = route.params as { session: any; reviewMode?: boolean };
  const [isSaved, setIsSaved] = useState(false);

  const counts = useMemo(() => {
    return session.events.reduce((memo: Record<string, number>, event: any) => {
      memo[event.type] = (memo[event.type] ?? 0) + 1;
      return memo;
    }, {});
  }, [session.events]);

  const handleSaveSession = async () => {
    if (reviewMode || isSaved) {
      navigation.navigate('Home');
      return;
    }

    await DriveStorage.saveSession(session);
    setIsSaved(true);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.title}>Drive Summary</Text>
          <Text style={styles.subtitle}>Final score and event breakdown</Text>
          <ScoreCard score={session.score} rating={session.rating} color={scoresColor(session.score)} subtitle="Final Score" />

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{formatDuration(session.duration)}</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Events</Text>
              <Text style={styles.statValue}>{session.events.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Event Breakdown</Text>
          <View style={styles.breakdownGrid}>
            {['Harsh Braking', 'Harsh Acceleration', 'Sharp Turn', 'Aggressive Steering', 'Phone Handling', 'Excessive Movement'].map((label) => (
              <View key={label} style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>{label}</Text>
                <Text style={styles.breakdownValue}>{counts[label] ?? 0}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Event Timeline</Text>
          {session.events.length === 0 ? (
            <Text style={styles.emptyText}>No events recorded this drive.</Text>
          ) : (
            session.events.map((event: any) => <EventCard key={event.id} event={event} />)
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSession}>
        <Text style={styles.saveButtonText}>{reviewMode ? 'Return Home' : 'Save Session'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}m ${seconds}s`;
};

const scoresColor = (score: number) => {
  if (score >= 90) return colors.green;
  if (score >= 75) return colors.yellow;
  if (score >= 60) return colors.orange;
  return colors.red;
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.medium,
    paddingBottom: 120,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.large,
    marginBottom: spacing.medium,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: spacing.small,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.medium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.medium,
  },
  statBlock: {
    flex: 1,
    padding: spacing.small,
    borderRadius: radius.button,
    backgroundColor: '#F8FAFC',
    marginRight: spacing.small,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  breakdownGrid: {
    flexDirection: 'column',
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.small,
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  saveButton: {
    position: 'absolute',
    bottom: spacing.large,
    left: spacing.medium,
    right: spacing.medium,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SummaryScreen;
