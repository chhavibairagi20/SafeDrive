export type EventType =
  | 'Harsh Braking'
  | 'Harsh Acceleration'
  | 'Sharp Turn'
  | 'Aggressive Steering'
  | 'Excessive Movement'
  | 'Phone Handling';

export interface Event {
  id: string;
  type: EventType;
  timestamp: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  penalty: number;
}
