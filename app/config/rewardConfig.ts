export const STORE_CATEGORIES = [
  'Pequeñas recompensas', 'Dinero libre', 'Ropa', 'Experiencias / Viajes',
  'Premium', 'Lujo', 'Excepciones controladas',
] as const;

export type StoreCategory = typeof STORE_CATEGORIES[number];
export type RewardRequirements = { habits14?: number; stability?: number; stability30?: number; savingsGoal?: boolean; incomeGoal?: boolean; netIncome?: number; level?: number };
export type StoreReward = { id: string; name: string; category: StoreCategory; coinCost: number; realValue?: number; realValueLabel?: string; icon: string; description?: string; repeatable: boolean; cooldownDays?: number; requirements?: RewardRequirements; custom?: boolean };

const reward = (id: string, name: string, category: StoreCategory, coinCost: number, icon: string, extra: Partial<StoreReward> = {}): StoreReward => ({ id, name, category, coinCost, icon, repeatable: true, ...extra });

export const DEFAULT_STORE_REWARDS: StoreReward[] = [
  reward('movie_night', 'Noche de películas / series', 'Pequeñas recompensas', 15, '🎬'), reward('videogame_night', 'Noche de videojuegos', 'Pequeñas recompensas', 20, '🎮'),
  reward('friends_night', 'Salir con amigos sin alcohol', 'Pequeñas recompensas', 25, '🤝'), reward('guilt_free_afternoon', 'Tarde libre sin culpa', 'Pequeñas recompensas', 30, '🌤️'),
  reward('favorite_food', 'Comida favorita', 'Pequeñas recompensas', 40, '🍽️'), reward('free_half_day', 'Medio día completamente libre', 'Pequeñas recompensas', 40, '🕐'), reward('planned_free_day', 'Día libre planificado', 'Pequeñas recompensas', 60, '🗓️'),
  reward('free_300', '$300 MXN para gastar', 'Dinero libre', 75, '💵', { realValue: 300 }), reward('free_500', '$500 MXN para gastar', 'Dinero libre', 120, '💵', { realValue: 500 }), reward('free_1000', '$1,000 MXN para gastar', 'Dinero libre', 220, '💵', { realValue: 1000 }),
  reward('clothes_1500', 'Comprar ropa hasta $1,500', 'Ropa', 300, '👕', { realValue: 1500 }),
  reward('premium_polo', 'Polo / playera premium', 'Ropa', 350, '👔', { realValue: 2500, realValueLabel: '$1,500–$2,500 MXN', requirements: { stability30: 80, savingsGoal: true, netIncome: 80000 } }),
  reward('clothes_3000', 'Comprar ropa hasta $3,000', 'Ropa', 550, '🧥', { realValue: 3000, requirements: { stability: 75, savingsGoal: true } }),
  reward('premium_outfit', 'Outfit premium', 'Ropa', 800, '✨', { realValue: 5000, requirements: { level: 15, stability: 80, savingsGoal: true, incomeGoal: true } }),
  reward('designer_clothes', 'Ropa de diseñador', 'Ropa', 1500, '◆', { realValueLabel: 'Valor variable', requirements: { level: 20, stability: 80, savingsGoal: true, incomeGoal: true } }),
  reward('special_meal', 'Salida especial / restaurante', 'Experiencias / Viajes', 100, '🥂'), reward('day_trip', 'Viaje o salida de un día', 'Experiencias / Viajes', 200, '🚗'),
  reward('toluca_trip', 'Viaje a Toluca', 'Experiencias / Viajes', 450, '🧳', { realValue: 3000, realValueLabel: 'Máximo $3,000 MXN' }), reward('weekend_trip', 'Viaje corto de fin de semana', 'Experiencias / Viajes', 700, '🏨'),
  reward('premium_trip', 'Viaje premium', 'Experiencias / Viajes', 1100, '✈️'), reward('international_trip', 'Viaje internacional', 'Experiencias / Viajes', 1800, '🌍'),
  reward('gadget_2000', 'Gadget de hasta $2,000', 'Premium', 400, '📱', { realValue: 2000 }), reward('premium_perfume', 'Perfume premium', 'Premium', 400, '🧴'), reward('premium_sneakers', 'Tenis premium', 'Premium', 600, '👟'), reward('midrange_watch', 'Reloj gama media', 'Premium', 900, '⌚'), reward('premium_purchase_5000', 'Compra premium hasta $5,000', 'Premium', 900, '♕', { realValue: 5000 }),
  reward('controlled_cigarette', 'Fumar 1 cigarro', 'Excepciones controladas', 30, '⚠️', { cooldownDays: 14, description: 'Excepción controlada · no otorga XP, monedas ni racha.' }),
];

export const REWARD_CONFIG = {
  storeStorageKey: 'daniel-os-store-v1', maximumCoinCost: 2000, exceptionRewardId: 'controlled_cigarette',
  bossLevels: {
    10: { label: 'Completar 3 temas de conocimiento', completedKnowledgeTopics: 3 }, 20: { label: 'Completar 8 temas de conocimiento', completedKnowledgeTopics: 8 },
    30: { label: 'Completar 15 temas de conocimiento', completedKnowledgeTopics: 15 }, 40: { label: 'Completar 25 temas de conocimiento', completedKnowledgeTopics: 25 },
  },
} as const;
