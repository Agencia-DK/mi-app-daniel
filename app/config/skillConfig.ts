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

export const skillLevel = (xp: number) => Math.max(1, Math.floor(xp / 500) + 1);
