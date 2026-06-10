import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DriveSession } from '../types/DriveSession';
import { DriveStorage } from '../storage/DriveStorage';
import { colors, radius, spacing } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';


const HistoryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'History'>>();
  const isFocused = useIsFocused();
  const [sessions, setSessions] = useState<DriveSession[]>([]);

  const loadSessions = useCallback(async () => {
    const stored = await DriveStorage.loadSessions();
    setSessions(stored);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadSessions();
    }
  }, [isFocused, loadSessions]);

  const renderItem = ({ item }: { item: DriveSession }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Summary', { session: item, reviewMode: true })}
    >
      <View style={styles.row}>
        <View>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
          <Text style={styles.subtitle}>{item.rating}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.score}>{item.score}</Text>
          <Text style={styles.duration}>{Math.floor(item.duration / 60)}m {item.duration % 60}s</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Drive History</Text>
        <Text style={styles.subtitleText}>Review past sessions and view detailed summaries.</Text>
      </View>
      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No drives yet</Text>
          <Text style={styles.emptyText}>Complete a drive and save it to see your history here.</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.medium,
  },
  header: {
    marginBottom: spacing.medium,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitleText: {
    color: colors.textSecondary,
    marginTop: spacing.small,
  },
  list: {
    paddingBottom: spacing.large,
  },
  card: {
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: spacing.small,
  },
  stats: {
    alignItems: 'flex-end',
  },
  score: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  duration: {
    color: colors.textSecondary,
    marginTop: spacing.small,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.small,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default HistoryScreen;
