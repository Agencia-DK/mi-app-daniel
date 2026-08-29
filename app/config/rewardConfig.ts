export const REWARD_CONFIG = {
  levelUpCoins: 0,
  bossLevels: {
    10: { label: 'Completar 3 temas de conocimiento', completedKnowledgeTopics: 3 },
    20: { label: 'Completar 8 temas de conocimiento', completedKnowledgeTopics: 8 },
    30: { label: 'Completar 15 temas de conocimiento', completedKnowledgeTopics: 15 },
    40: { label: 'Completar 25 temas de conocimiento', completedKnowledgeTopics: 25 },
  },
} as const;
