export const COIN_CONFIG = {
  initialBalance: 0,
  daily: [[95, 5], [80, 3]],
  weekly: [[95, 50], [90, 30], [80, 15]],
  monthly: [[95, 250], [90, 150], [80, 75]],
  weeklyReview: 10,
  monthlySavingsGoal: 100,
  monthlyIncomeGoal: 100,
  streaks: { 7: 20, 30: 100, 90: 350, 180: 750, 365: 2_000 },
  generalLevelMultiplier: 10,
  skillLevelMilestones: { 5: 25, 10: 75, 15: 150, 20: 300 },
} as const;

type CoinPeriod = 'daily' | 'weekly' | 'monthly';

export const coinRewardForScore = (period: CoinPeriod, score: number) =>
  COIN_CONFIG[period].find(([minimum]) => score >= minimum)?.[1] || 0;
