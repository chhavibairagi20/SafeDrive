import { Event } from './Event';

export interface DriveSession {
  id: string;
  date: string;
  duration: number;
  score: number;
  rating: string;
  events: Event[];
}
