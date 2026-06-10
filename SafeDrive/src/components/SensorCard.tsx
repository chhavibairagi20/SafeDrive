import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

interface SensorCardProps {
  label: string;
  values: Record<string, number>;
  showZ?: boolean;
}

const SensorCard = ({ label, values }: SensorCardProps) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.row}>
      {Object.entries(values).map(([name, value]) => (
        <Text key={name} style={styles.value}>
          {name.toUpperCase()}: {value.toFixed(2)}
        </Text>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.small,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default SensorCard;
