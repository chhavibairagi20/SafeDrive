import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriveSession } from '../types/DriveSession';

const STORAGE_KEY = '@safedrive:drive_sessions';

export const DriveStorage = {
  loadSessions: async (): Promise<DriveSession[]> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as DriveSession[];
    } catch {
      return [];
    }
  },

  saveSession: async (session: DriveSession): Promise<DriveSession[]> => {
    const sessions = await DriveStorage.loadSessions();
    const nextSessions = [session, ...sessions];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSessions));
    return nextSessions;
  },

  clearSessions: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
