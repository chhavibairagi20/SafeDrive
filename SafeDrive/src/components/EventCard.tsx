import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Event } from '../types/Event';
import { colors, radius, spacing } from '../utils/theme';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const eventTime = new Date(event.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <View style={[styles.badge, { backgroundColor: badgeColor(event.severity) }]}>
        <Text style={styles.badgeText}>{event.severity}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{event.type}</Text>
        <Text style={styles.subtitle}>Penalty {event.penalty}</Text>
      </View>
      <Text style={styles.time}>{eventTime}</Text>
    </View>
  );
};

const badgeColor = (severity: Event['severity']) => {
  switch (severity) {
    case 'Critical':
      return colors.red;
    case 'High':
      return colors.orange;
    case 'Medium':
      return colors.yellow;
    default:
      return colors.primary;
  }
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.small,
    padding: spacing.medium,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  details: {
    flex: 1,
    marginLeft: spacing.medium,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 13,
  },
  time: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default EventCard;
