import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

interface ScoreCardProps {
  score: number;
  rating: string;
  color: string;
  subtitle?: string;
}

const ScoreCard = ({ score, rating, color, subtitle }: ScoreCardProps) => (
  <View style={styles.card}>
    <View style={[styles.indicator, { backgroundColor: color }]} />
    <View style={styles.content}>
      <Text style={styles.label}>{subtitle ?? 'Score'}</Text>
      <Text style={styles.value}>{score}</Text>
      <Text style={[styles.rating, { color }]}>{rating}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.card,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 120,
  },
  indicator: {
    width: 8,
  },
  content: {
    flex: 1,
    padding: spacing.medium,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  rating: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ScoreCard;
