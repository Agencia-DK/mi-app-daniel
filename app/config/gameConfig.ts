import { COIN_CONFIG } from './coinConfig';
import { XP_CONFIG, isCappedXp, type XpHistoryEntry, type XpReward } from './xpConfig';

export const GAME_CONFIG = {
  maxLevel: 40,
  stabilityWindowDays: 7,
  storage: {
    progression: 'daniel-os-progression-v2',
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
  highestLevelUnlocked: number;
  generalXp: number;
  coins: number;
  streak: number;
  skillXp: Record<string, number>;
  learningByDay: Record<string, number>;
  stabilityByDay: Record<string, StabilityScores>;
  habitDays: Record<string, { done: number; total: number }>;
  dailyGeneralXp: Record<string, number>;
  activeXpAwards: string[];
  claimedRewards: string[];
  xpHistory: XpHistoryEntry[];
};

export const INITIAL_PROGRESSION: ProgressionState = {
  level: 1,
  highestLevelUnlocked: 1,
  generalXp: 0,
  coins: COIN_CONFIG.initialBalance,
  streak: 0,
  skillXp: {},
  learningByDay: {},
  stabilityByDay: {},
  habitDays: {},
  dailyGeneralXp: {},
  activeXpAwards: [],
  claimedRewards: [],
  xpHistory: [],
};

export const grantXp = (state: ProgressionState, reward: XpReward) => {
  if (state.activeXpAwards.includes(reward.id)) return state;
  const available = Math.max(0, XP_CONFIG.dailyGeneralLimit - (state.dailyGeneralXp[reward.date] || 0));
  const deepWorkToday = state.xpHistory.filter((entry) => entry.date === reward.date && entry.type === 'deep_work').reduce((sum, entry) => sum + entry.amount, 0);
  const sourceAmount = reward.type === 'deep_work' ? Math.min(reward.general, Math.max(0, XP_CONFIG.deepWork.dailyLimit - deepWorkToday)) : reward.general;
  const general = isCappedXp(reward.type) ? Math.min(sourceAmount, available) : sourceAmount;
  const skillXp = reward.skill && reward.skillAmount ? { ...state.skillXp, [reward.skill]: (state.skillXp[reward.skill] || 0) + reward.skillAmount } : state.skillXp;
  return { ...state, generalXp: state.generalXp + general, skillXp,
    dailyGeneralXp: { ...state.dailyGeneralXp, [reward.date]: (state.dailyGeneralXp[reward.date] || 0) + (isCappedXp(reward.type) ? general : 0) },
    activeXpAwards: [...state.activeXpAwards, reward.id],
    xpHistory: general ? [...state.xpHistory, { id: reward.id, date: reward.date, amount: general, reason: reward.reason, type: reward.type, ...(reward.skill ? { skill: reward.skill } : {}) }] : state.xpHistory };
};

export const revokeXp = (state: ProgressionState, reward: XpReward) => {
  if (!state.activeXpAwards.includes(reward.id)) return state;
  const originalEntry = [...state.xpHistory].reverse().find((entry) => entry.id === reward.id);
  const original = originalEntry?.amount || 0;
  const awardedDate = originalEntry?.date || reward.date;
  const skillXp = reward.skill && reward.skillAmount ? { ...state.skillXp, [reward.skill]: Math.max(0, (state.skillXp[reward.skill] || 0) - reward.skillAmount) } : state.skillXp;
  return { ...state, generalXp: Math.max(0, state.generalXp - original), skillXp,
    dailyGeneralXp: { ...state.dailyGeneralXp, [awardedDate]: Math.max(0, (state.dailyGeneralXp[awardedDate] || 0) - (isCappedXp(reward.type) ? original : 0)) },
    activeXpAwards: state.activeXpAwards.filter((id) => id !== reward.id),
    xpHistory: original ? [...state.xpHistory, { id: `${reward.id}:reversed:${Date.now()}`, date: reward.date, amount: -original, reason: `Corrección: ${reward.reason}`, type: reward.type, ...(reward.skill ? { skill: reward.skill } : {}) }] : state.xpHistory };
};

const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const habitStreak = (days: ProgressionState['habitDays'], today: Date) => {
  const cursor = new Date(today);
  const eligible = (key: string) => { const day = days[key]; return !!day && day.total > 0 && day.done / day.total >= 0.6 && day.total - day.done <= 1; };
  if (!eligible(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (eligible(dateKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
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
