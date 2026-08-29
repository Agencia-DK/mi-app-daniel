export const SKILL_CONFIG = {
  marketing: 'Marketing',
  technology: 'Tecnología / IA',
  business: 'Negocios',
  finance: 'Finanzas',
  health: 'Salud',
  personalDevelopment: 'Desarrollo personal',
  design: 'Diseño',
  social: 'Habilidades sociales',
} as const;

export const SKILL_LEVEL_XP = [
  0, 100, 250, 450, 700, 1_000, 1_350, 1_750, 2_200, 2_700,
  3_300, 4_000, 4_800, 5_700, 6_700, 7_800, 9_000, 10_300, 11_700, 13_200,
] as const;

export const skillLevel = (xp: number) => {
  const index = SKILL_LEVEL_XP.findLastIndex((required) => xp >= required);
  return Math.max(1, index + 1);
};

export const skillLevelXp = (level: number) => SKILL_LEVEL_XP[Math.min(20, Math.max(1, level)) - 1];

export const skillXpForTheme = (level: number, themeIndex: number, themeCount: number) => {
  if (themeCount < 1 || level >= 20) return 0;
  const span = skillLevelXp(level + 1) - skillLevelXp(level);
  const boundary = (index: number) => Math.round(index * span / themeCount * 1_000_000) / 1_000_000;
  return boundary(themeIndex + 1) - boundary(themeIndex);
};

export const knowledgeLevelGeneralXp = (level: number) => {
  if (level <= 5) return 50;
  if (level <= 10) return 100;
  if (level <= 15) return 200;
  if (level <= 19) return 300;
  return 500;
};
