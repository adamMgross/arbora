import type { JournalStorage } from '../lib/journal';

export interface SceneEnv {
  now: () => Date;
  random: () => number;
  storage: JournalStorage;
}

export const browserEnv = (): SceneEnv => ({
  now: () => new Date(),
  random: Math.random,
  storage: localStorage,
});
