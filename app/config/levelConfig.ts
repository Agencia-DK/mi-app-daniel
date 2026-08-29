import { GAME_CONFIG } from './gameConfig';
import { REWARD_CONFIG } from './rewardConfig';

export type LevelRequirement = {
  level: number;
  xp: number;
  netWorth: number;
  netMonthlyIncome: number;
  stability: number;
  boss?: { label: string; completedKnowledgeTopics: number };
};

export const LEVEL_NAMES = [
  'El inicio', 'Pequeños hábitos, grandes cambios', 'Un poco más enfocado', 'Primeras mejoras',
  'Modo supervivencia estable', 'Primer monitor, más productividad', 'Usar el dinero inteligentemente',
  'Más disciplina, más resultados', 'Mejor apariencia, más confianza', 'Primera gran etapa completada',
  'Mejor tecnología, más oportunidades', 'Primer guardarropa bueno', 'Fitness visible',
  'Primer smartphone premium', 'Primer estilo premium', 'Primer espacio realmente bonito',
  'Primera escapada: viaje', 'Trabajo más profesional', 'Primer reloj de gama media',
  'Departamento propio: independencia', 'Primer coche propio', 'Mejor guardarropa y accesorios',
  'Oficina personal: primera oficina', 'Primer coche premium', 'Departamento premium',
  'Departamento premium renovado', 'Ecosistema tecnológico premium', 'Coche deportivo de entrada',
  'Equipo y oficina en crecimiento', 'Vida premium nocturna', 'Patrimonio en movimiento',
  'Penthouse y exclusividad', 'Penthouse en Cancún', 'Viaje premium a París',
  'Experiencias gastronómicas premium', 'Empresa e inversiones', 'Casa familiar premium',
  'Patrimonio internacional', 'Club y conexiones', 'Vida extraordinaria',
] as const;

export const LEVEL_CONFIG: LevelRequirement[] = Array.from({ length: GAME_CONFIG.maxLevel }, (_, index) => {
  const level = index + 1;
  const boss = REWARD_CONFIG.bossLevels[level as keyof typeof REWARD_CONFIG.bossLevels];
  return {
    level,
    xp: level === 1 ? 0 : Math.round(1000 * level ** 1.6),
    netWorth: level === 1 ? 0 : level <= 5 ? level * 5000 : Math.round(10000 * level ** 2),
    netMonthlyIncome: level === 1 ? 0 : level <= 5 ? level * 1000 : level * 5000,
    stability: level === 1 ? 0 : Math.min(90, Math.round(20 + level * 1.5)),
    boss,
  };
});

export const requirementForLevel = (level: number) => LEVEL_CONFIG[Math.min(GAME_CONFIG.maxLevel, Math.max(1, level)) - 1];
