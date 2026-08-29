export const XP_CONFIG = {
  dailyGeneralLimit: 300,
  habits: [['5', 'Sencillo'], ['10', 'Medio'], ['15', 'Difícil']],
  tasks: [['5', 'Pequeña'], ['20', 'Normal'], ['40', 'Importante'], ['70', 'Difícil']],
  deepWork: { perFullHour: 25, dailyLimit: 100 },
  streaks: { 7: 100, 30: 500, 90: 1500, 180: 2500, 365: 5000 },
  projects: { small: 500, important: 1000, large: 2000, mainMission: 2500 },
  financialMilestones: { 1000000: 5000, 5000000: 10000, 10000000: 15000, 20000000: 25000 },
  study: {
    videoShort: { label: 'Video 10-30 minutos', skill: 20, general: 10 },
    videoLong: { label: 'Video 31-60 minutos', skill: 40, general: 20 },
    class: { label: 'Clase 1-2 horas', skill: 60, general: 30 },
    topicNotes: { label: 'Tema estudiado + notas', skill: 80, general: 40 },
    practice: { label: 'Ejercicio práctico', skill: 100, general: 50 },
    book: { label: 'Libro terminado', skill: 300, general: 150 },
    smallCourse: { label: 'Curso pequeño', skill: 400, general: 200 },
    mediumCourse: { label: 'Curso mediano', skill: 800, general: 350 },
    largeCourse: { label: 'Curso grande', skill: 1500, general: 600 },
    practicalProject: { label: 'Proyecto práctico', skill: 500, general: 250 },
    realProject: { label: 'Proyecto real', skill: 1000, general: 500 },
  },
} as const;

export type XpType = 'habit' | 'task' | 'deep_work' | 'study' | 'streak' | 'project' | 'mission' | 'financial' | 'special';
export type XpHistoryEntry = { id: string; date: string; amount: number; reason: string; type: XpType; skill?: string };
export type XpReward = { id: string; date: string; general: number; reason: string; type: XpType; skill?: string; skillAmount?: number };

export const xpFromLabel = (label = '') => Number(label.replace(/\D/g, '')) || 0;
export const isCappedXp = (type: XpType) => ['habit', 'task', 'deep_work', 'study'].includes(type);
export const normalizedHabitXp = (value: number) => value <= 5 ? 5 : value <= 10 ? 10 : 15;
export const normalizedTaskXp = (value: number) => value <= 5 ? 5 : value <= 20 ? 20 : value <= 40 ? 40 : 70;
