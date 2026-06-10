import { Event } from '../types/Event';

export const ScoreCalculator = {
  calculate: (events: Event[]) => {
    const penalty = events.reduce((total, event) => total + event.penalty, 0);
    return Math.max(0, 100 + penalty);
  },

  getRating: (score: number) => {
    if (score >= 90) {
      return { label: 'Excellent', color: '#22C55E' };
    }
    if (score >= 75) {
      return { label: 'Good', color: '#FACC15' };
    }
    if (score >= 60) {
      return { label: 'Average', color: '#F97316' };
    }
    return { label: 'Risky', color: '#EF4444' };
  },

  getEventCounts: (events: Event[]) => {
    return events.reduce((counts, event) => {
      counts[event.type] = (counts[event.type] ?? 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  },
};
