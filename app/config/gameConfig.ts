import { COIN_CONFIG } from './coinConfig';

export const GAME_CONFIG = {
  maxLevel: 40,
  stabilityWindowDays: 7,
  storage: {
    progression: 'daniel-os-progression-v1',
    money: 'daniel-os-money-v2',
    study: 'daniel-os-study-v2',
  },
} as const;

export type StabilityScores = {
  habits: number;
  productivity: number;
  finances: number;
  health: number;
  learning: number;
};

export type ProgressionState = {
  level: number;
  generalXp: number;
  coins: number;
  streak: number;
  skillXp: Record<string, number>;
  learningByDay: Record<string, number>;
  stabilityByDay: Record<string, StabilityScores>;
};

export const INITIAL_PROGRESSION: ProgressionState = {
  level: 1,
  generalXp: 0,
  coins: COIN_CONFIG.initialBalance,
  streak: 0,
  skillXp: {},
  learningByDay: {},
  stabilityByDay: {},
};

export const percentage = (part: number, total: number) => total > 0 ? Math.min(100, Math.round(part / total * 100)) : 0;

export const averageStability = (history: Record<string, StabilityScores>, today: Date) => {
  const days = Array.from({ length: GAME_CONFIG.stabilityWindowDays }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const score = history[key];
    return score ? Object.values(score).reduce((sum, value) => sum + value, 0) / 5 : 0;
  });
  return Math.round(days.reduce((sum, value) => sum + value, 0) / days.length);
};
