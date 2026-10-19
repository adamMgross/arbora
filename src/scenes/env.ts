import type { JournalStorage } from '../lib/journal';
import type { Place } from '../lib/place';

export interface SceneEnv {
  now: () => Date;
  random: () => number;
  storage: JournalStorage;
  locate: () => Promise<Place>;
}

const locate = (): Promise<Place> =>
  new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is unavailable'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      reject,
      { maximumAge: 3600000, timeout: 15000 },
    );
  });

export const browserEnv = (): SceneEnv => ({
  now: () => new Date(),
  random: Math.random,
  storage: localStorage,
  locate,
});
