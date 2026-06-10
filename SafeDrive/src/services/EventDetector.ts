import { Event, EventType } from '../types/Event';
import { SensorSample } from './SensorService';

const eventDelay = 1200;
const lastEventTimestamps: Record<EventType, number> = {
  'Harsh Braking': 0,
  'Harsh Acceleration': 0,
  'Sharp Turn': 0,
  'Aggressive Steering': 0,
  'Excessive Movement': 0,
  'Phone Handling': 0,
};

let phoneHandlingStart: number | null = null;

const createEvent = (
  type: EventType,
  severity: Event['severity'],
  penalty: number,
): Event => ({
  id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type,
  timestamp: Date.now(),
  severity,
  penalty,
});

const shouldEmit = (type: EventType) => {
  const now = Date.now();
  if (now - lastEventTimestamps[type] > eventDelay) {
    lastEventTimestamps[type] = now;
    return true;
  }
  return false;
};

export const EventDetector = {
  reset: () => {
    Object.keys(lastEventTimestamps).forEach((key) => {
      lastEventTimestamps[key as EventType] = 0;
    });
    phoneHandlingStart = null;
  },

  detect: (sample: SensorSample): Event[] => {
    const events: Event[] = [];
    const { accelerometer, gyroscope, deviceMotion } = sample;
    const rotationRate = deviceMotion.rotationRate;
    const shouldLogMovement =
      Math.abs(rotationRate.alpha) > 2.5 ||
      Math.abs(accelerometer.x) > 2.2 ||
      Math.abs(accelerometer.y) > 2.2 ||
      Math.abs(accelerometer.z) > 2.2;

    if (accelerometer.z < -2.5 && shouldEmit('Harsh Braking')) {
      events.push(createEvent('Harsh Braking', 'High', -5));
    }

    if (accelerometer.z > 2.5 && shouldEmit('Harsh Acceleration')) {
      events.push(createEvent('Harsh Acceleration', 'High', -5));
    }

    if (Math.abs(gyroscope.y) > 1.8 && shouldEmit('Sharp Turn')) {
      events.push(createEvent('Sharp Turn', 'Medium', -3));
    }

    if (Math.abs(gyroscope.x) > 2.0 && shouldEmit('Aggressive Steering')) {
      events.push(createEvent('Aggressive Steering', 'Medium', -4));
    }

    if (rotationRate.alpha > 3.0 && shouldEmit('Excessive Movement')) {
      events.push(createEvent('Excessive Movement', 'Low', -2));
    }

    if (shouldLogMovement) {
      if (!phoneHandlingStart) {
        phoneHandlingStart = Date.now();
      }

      if (phoneHandlingStart && Date.now() - phoneHandlingStart >= 3000 && shouldEmit('Phone Handling')) {
        events.push(createEvent('Phone Handling', 'Critical', -10));
        phoneHandlingStart = null;
      }
    } else {
      phoneHandlingStart = null;
    }

    return events;
  },
};
