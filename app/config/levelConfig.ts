import { GAME_CONFIG } from './gameConfig';

export type LevelRequirement = {
  level: number;
  xp: number;
  netWorth: number;
  netMonthlyIncome: number;
  stability: number;
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

const XP = [0,500,1200,2000,3000,4500,6000,8000,10000,12500,15500,19000,23000,27500,32500,38000,44000,51000,59000,68000,78000,89000,101000,114000,128000,143000,159000,176000,194000,213000,233000,254000,276000,299000,323000,348000,374000,401000,429000,458000];
const NET_WORTH = [0,25000,50000,75000,100000,150000,250000,400000,650000,1000000,1250000,1500000,1800000,2100000,2500000,2900000,3300000,3800000,4400000,5000000,5500000,6000000,6600000,7200000,7800000,8500000,9200000,10000000,11000000,12000000,12800000,13600000,14400000,15200000,16000000,16800000,17600000,18400000,19200000,20000000];
const NET_INCOME = [0,10000,15000,20000,25000,30000,35000,45000,55000,70000,75000,80000,90000,100000,110000,120000,130000,140000,145000,150000,165000,180000,195000,210000,225000,240000,255000,270000,285000,300000,320000,340000,360000,380000,400000,420000,440000,460000,480000,500000];
const STABILITY = [0,60,60,60,60,65,65,65,65,70,72,72,72,72,72,75,75,75,75,75,78,78,78,78,78,82,82,82,82,82,85,85,85,85,85,88,88,88,88,90];

export const LEVEL_CONFIG: LevelRequirement[] = Array.from({ length: GAME_CONFIG.maxLevel }, (_, index) => ({
  level: index + 1,
  xp: XP[index],
  netWorth: NET_WORTH[index],
  netMonthlyIncome: NET_INCOME[index],
  stability: STABILITY[index],
}));

export const requirementForLevel = (level: number) => LEVEL_CONFIG[Math.min(GAME_CONFIG.maxLevel, Math.max(1, level)) - 1];
export const incomeAverageMonthsForLevel = (level: number) => level >= 30 ? 6 : 3;
