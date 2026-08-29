export type StabilityScores = {
  habits: number;
  productivity: number;
  finances: number;
  health: number;
  learning: number;
};

export const STABILITY_CONFIG = {
  weights: { habits: 0.30, productivity: 0.20, finances: 0.20, health: 0.15, learning: 0.15 },
  windows: { standardDays: 30, advancedDays: 90, advancedFromLevel: 30 },
  finances: { savingsRateTarget: 0.20, maximumExpenseRate: 0.80 },
  healthPattern: /salud|agua|ejercicio|entren|gym|sueño|dormir/i,
  learningDailyTarget: 1,
  classifications: [
    { min: 95, label: 'Dominando' },
    { min: 85, label: 'Excelente' },
    { min: 75, label: 'Bien' },
    { min: 65, label: 'Mejorando' },
    { min: 50, label: 'Inestable' },
    { min: 0, label: 'Mal' },
  ],
} as const;

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const stabilityWindowDaysForLevel = (level: number) => level >= STABILITY_CONFIG.windows.advancedFromLevel
  ? STABILITY_CONFIG.windows.advancedDays
  : STABILITY_CONFIG.windows.standardDays;

export const weightedStability = (scores: StabilityScores) => clamp(
  Object.entries(STABILITY_CONFIG.weights).reduce((total, [key, weight]) => total + scores[key as keyof StabilityScores] * weight, 0),
);

export const financialStability = (netIncome: number, grossIncome: number, expenses: number, incomeTarget: number) => {
  const income = incomeTarget > 0 ? clamp(Math.max(0, netIncome) / incomeTarget * 100) : 100;
  const savingsRate = grossIncome > 0 ? Math.max(0, netIncome) / grossIncome : 0;
  const savings = clamp(savingsRate / STABILITY_CONFIG.finances.savingsRateTarget * 100);
  const expenseRate = grossIncome > 0 ? expenses / grossIncome : 1;
  const budget = expenseRate <= STABILITY_CONFIG.finances.maximumExpenseRate ? 100 : clamp((1 - expenseRate) / (1 - STABILITY_CONFIG.finances.maximumExpenseRate) * 100);
  return clamp((income + savings + budget) / 3);
};

export const stabilityClassification = (score: number) => STABILITY_CONFIG.classifications.find(({ min }) => score >= min)!.label;
