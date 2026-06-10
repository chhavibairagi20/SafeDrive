import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SensorService, SensorSample } from '../services/SensorService';
import { EventDetector } from '../services/EventDetector';
import { ScoreCalculator } from '../services/ScoreCalculator';
import SensorCard from '../components/SensorCard';
import EventCard from '../components/EventCard';
import { Event } from '../types/Event';
import { colors, radius, spacing } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';


const initialSample: SensorSample = {
  accelerometer: { x: 0, y: 0, z: 0 },
  gyroscope: { x: 0, y: 0, z: 0 },
  deviceMotion: {
    rotation: { alpha: 0, beta: 0, gamma: 0 },
    rotationRate: { alpha: 0, beta: 0, gamma: 0 },
    accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
  },
};

const DrivingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Driving'>>();
  const [sample, setSample] = useState<SensorSample>(initialSample);
  const [events, setEvents] = useState<Event[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventDetector.reset();
    SensorService.start(handleSensorUpdate);
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    setLoading(false);

    return () => {
      clearInterval(interval);
      SensorService.stop();
    };
  }, []);

  const handleSensorUpdate = (data: SensorSample) => {
    setSample(data);
    const detected = EventDetector.detect(data);
    if (detected.length > 0) {
      setEvents((prev) => [...detected, ...prev]);
    }
  };

  const score = useMemo(() => ScoreCalculator.calculate(events), [events]);
  const rating = useMemo(() => ScoreCalculator.getRating(score), [score]);

  const formatDuration = (value: number) => {
    const minutes = Math.floor(value / 60);
    const secondsLeft = value % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
  };

  const handleEndDrive = () => {
    SensorService.stop();
    const sessionId = `drive-${Date.now()}`;
    const driveSession = {
      id: sessionId,
      date: new Date().toISOString(),
      duration: seconds,
      score,
      rating: rating.label,
      events: events.slice().reverse(),
    };
    navigation.navigate('Summary', { session: driveSession });
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Live Driving Score</Text>
          <Text style={[styles.score, { color: rating.color }]}>{score}</Text>
          <Text style={styles.rating}>{rating.label}</Text>
          <Text style={styles.detailText}>Duration: {formatDuration(seconds)}</Text>
          <Text style={styles.detailText}>Total Events: {events.length}</Text>
        </View>

        <View style={styles.sensorGrid}>
          <SensorCard label="Accelerometer" values={sample.accelerometer} />
          <SensorCard label="Gyroscope" values={sample.gyroscope} />
          <SensorCard label="Device Motion" values={sample.deviceMotion.rotationRate} showZ={true} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Detected Events</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : events.length === 0 ? (
            <Text style={styles.emptyText}>No unsafe events detected yet.</Text>
          ) : (
            events.slice(0, 5).map((event) => <EventCard key={event.id} event={event} />)
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.floatingButton} onPress={handleEndDrive}>
        <Text style={styles.floatingButtonText}>End Drive</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
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
  headerCard: {
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
  headerTitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginBottom: spacing.small,
  },
  score: {
    fontSize: 52,
    fontWeight: '800',
  },
  rating: {
    marginTop: spacing.small,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  detailText: {
    marginTop: spacing.small,
    color: colors.textSecondary,
    fontSize: 14,
  },
  sensorGrid: {
    flexDirection: 'column',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.medium,
    marginTop: spacing.medium,
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
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: spacing.large,
    left: spacing.medium,
    right: spacing.medium,
    height: 56,
    backgroundColor: colors.red,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DrivingScreen;
