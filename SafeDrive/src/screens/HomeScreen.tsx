import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DriveSession } from '../types/DriveSession';
import { DriveStorage } from '../storage/DriveStorage';
import AnalyticsCard from '../components/AnalyticsCard';
import ScoreCard from '../components/ScoreCard';
import EventCard from '../components/EventCard';
import { colors, radius, spacing } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';


const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - spacing.medium * 4;

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const isFocused = useIsFocused();
  const [sessions, setSessions] = useState<DriveSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    const stored = await DriveStorage.loadSessions();
    setSessions(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadSessions();
    }
  }, [isFocused, loadSessions]);

  const totalDrives = sessions.length;
  const averageScore = totalDrives
    ? Math.round(sessions.reduce((sum, session) => sum + session.score, 0) / totalDrives)
    : 0;
  const bestScore = totalDrives ? Math.max(...sessions.map((session) => session.score)) : 0;
  const worstScore = totalDrives ? Math.min(...sessions.map((session) => session.score)) : 0;
  const lastDrive = sessions[0];

  const commonEvents = sessions.reduce<Record<string, number>>((counts, session) => {
    session.events.forEach((event) => {
      counts[event.type] = (counts[event.type] ?? 0) + 1;
    });
    return counts;
  }, {});

  const mostCommonEvent = Object.entries(commonEvents).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None';

  const eventDistribution = Object.entries(commonEvents).map(([name, value]) => ({
    name,
    count: value,
    color: name === 'Harsh Braking' ? colors.red : name === 'Phone Handling' ? colors.red : name === 'Sharp Turn' ? colors.orange : name === 'Aggressive Steering' ? colors.orange : colors.yellow,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  }));

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.brand}>SafeDrive</Text>
          <Text style={styles.subtitle}>Drive Smarter. Drive Safer.</Text>
          <View style={styles.headerStats}>
            <AnalyticsCard title="Total Drives" value={`${totalDrives}`} />
            <AnalyticsCard title="Average" value={`${averageScore}`} subtitle="Score" />
            <AnalyticsCard title="Best" value={`${bestScore}`} subtitle="Score" />
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Driving')}>
          <Text style={styles.actionButtonText}>Start Drive</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.secondaryButtonText}>View History</Text>
        </TouchableOpacity>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Drive</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : lastDrive ? (
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>{new Date(lastDrive.date).toLocaleDateString()}</Text>
              <Text style={styles.previewText}>Score: {lastDrive.score}</Text>
              <Text style={styles.previewText}>Duration: {Math.floor(lastDrive.duration / 60)}m {lastDrive.duration % 60}s</Text>
              <Text style={styles.previewText}>Events: {lastDrive.events.length}</Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>No drives recorded yet. Start a drive to see your first summary.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Analytics Overview</Text>
        <View style={styles.analyticsRow}>
          <ScoreCard score={averageScore} rating={mostCommonEvent === 'None' ? 'Ready' : mostCommonEvent} color={colors.primary} subtitle="Most common event" />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Score Trend</Text>
          {sessions.length > 0 ? (
            <LineChart
              data={{
                labels: sessions.slice(0, 6).reverse().map((session) => new Date(session.date).toLocaleDateString()),
                datasets: [{ data: sessions.slice(0, 6).reverse().map((session) => session.score) }],
              }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chartStyle}
            />
          ) : (
            <Text style={styles.emptyText}>Complete a drive to see the score trend.</Text>
          )}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Event Distribution</Text>
          {eventDistribution.length ? (
            <PieChart
              data={eventDistribution}
              width={chartWidth}
              height={180}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          ) : (
            <Text style={styles.emptyText}>No event data available yet.</Text>
          )}
        </View>

        {lastDrive && lastDrive.events.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Latest Drive Events</Text>
            {lastDrive.events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#F8FAFC',
  backgroundGradientTo: '#F8FAFC',
  color: () => '#22C55E',
  labelColor: () => '#64748B',
  decimalPlaces: 0,
  propsForDots: {
    r: '4',
    fill: '#22C55E',
  },
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.medium,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.large,
    marginBottom: spacing.medium,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  brand: {
    fontSize: 32,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 8,
    fontSize: 16,
  },
  headerStats: {
    marginTop: spacing.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    marginBottom: spacing.medium,
    height: 56,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginBottom: spacing.large,
    height: 56,
    borderRadius: radius.button,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
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
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.small,
  },
  previewCard: {
    padding: spacing.medium,
    borderRadius: radius.button,
    backgroundColor: '#F8FAFC',
  },
  previewTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.small,
  },
  previewText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.small,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.medium,
    flexWrap: 'wrap',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.small,
  },
  chartStyle: {
    borderRadius: radius.card,
  },
});

export default HomeScreen;
