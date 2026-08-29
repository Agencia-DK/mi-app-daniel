export const XP_CONFIG = {
  habits: [['5', 'Sencillo'], ['10', 'Medio'], ['15', 'Difícil'], ['25', 'Me cuesta (GYM)']],
  tasks: [['0', 'Delegada'], ['5', 'Baja'], ['20', 'Intermedia'], ['40', 'Media'], ['55', 'Difícil'], ['70', 'Máximo']],
  studyTask: { skill: 25, general: 5 },
} as const;

export const xpFromLabel = (label = '') => Number(label.replace(/\D/g, '')) || 0;
