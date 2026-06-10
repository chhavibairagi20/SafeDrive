import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

interface AnalyticsCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const AnalyticsCard = ({ title, value, subtitle }: AnalyticsCardProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.value}>{value}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.medium,
    marginRight: spacing.small,
    minHeight: 110,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  title: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.small,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.small,
  },
});

export default AnalyticsCard;
