'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { fullStudyBranches } from './study-data';
import { GAME_CONFIG, INITIAL_PROGRESSION, averageStability, grantCoins, grantXp, habitStreak, percentage, revokeXp, type ProgressionState } from './config/gameConfig';
import { LEVEL_NAMES, incomeAverageMonthsForLevel, requirementForLevel } from './config/levelConfig';
import { XP_CONFIG, normalizedHabitXp, normalizedTaskXp, xpFromLabel, type XpReward } from './config/xpConfig';
import { knowledgeLevelGeneralXp, skillLevel, skillLevelXp, skillXpForTheme } from './config/skillConfig';
import { REWARD_CONFIG } from './config/rewardConfig';
import { COIN_CONFIG, coinRewardForScore } from './config/coinConfig';
import { STABILITY_CONFIG, financialStability, stabilityClassification, stabilityWindowDaysForLevel } from './config/stabilityConfig';

type MoneyTransaction = { id: number; type: 'income' | 'expense'; concept: string; amount: number; date: string };
type MoneyAsset = { id: number; name: string; detail: string; value: number; kind: 'savings' | 'investment' | 'asset' | 'debt' };
type MoneyModal = 'income' | 'expense' | 'balance' | 'asset' | 'transactions' | 'assets' | null;
const formatMoney = (value: number) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

const skills = [
  ['Finanzas', '1,870 / 2,500', '75%', '/icons/finance.webp'],
  ['Conocimiento', '2,150 / 2,800', '77%', '/icons/knowledge.webp'],
  ['Salud', '1,920 / 2,600', '74%', '/icons/health.webp'],
  ['Disciplina', '2,400 / 2,900', '83%', '/icons/discipline.webp'],
  ['Negocios', '1,600 / 2,300', '70%', '/icons/business.webp'],
];

const habits = [
  ['Hábitos', '6/8', '/icons/habits.webp'],
  ['Pendientes', '4/7', '/icons/pending.webp'],
  ['Estudio', '1h 20m', '/icons/study.webp'],
  ['Trabajo', '3h 40m', '/icons/work.webp'],
  ['Ejercicio', '45m', '/icons/exercise.webp'],
];

const dailyActivities = [
  ['Tomar agua', '2 litros', '/icons/health.webp', '+5 XP'],
  ['Entrenamiento', '45 minutos', '/icons/exercise.webp', '+15 XP'],
  ['Estudiar', '1 hora', '/icons/study.webp', '+10 XP'],
  ['Trabajo profundo', '2 horas', '/icons/work.webp', '+50 XP'],
  ['Revisar finanzas', '15 minutos', '/icons/finance.webp', '+5 XP'],
  ['Planear mañana', '10 minutos', '/icons/discipline.webp', '+5 XP'],
];

const pendingActivities = [
  ['Terminar propuesta', 'Trabajo', 'Difícil', '+70 XP'],
  ['Revisar campaña', 'Negocios', 'Importante', '+40 XP'],
  ['Responder mensajes', 'Personal', 'Media', '+40 XP'],
  ['Preparar contenido', 'Estudio', 'Media', '+40 XP'],
  ['Organizar escritorio', 'Hábitos', 'Baja', '+5 XP'],
];

const weekProgress = [65, 80, 55, 90, 72, 45, 30];
const habitXp = XP_CONFIG.habits;
const taskXp = XP_CONFIG.tasks;
const reminderCategories = ['Compras', 'Hogar', 'Trabajo', 'Negocio', 'Personal', 'Estudio'];
const initialReminders = [
  ['Comprar escritorio', 'Comparar opciones', 'Compras'],
  ['Cotizar aire acondicionado', 'Revisar precios', 'Hogar'],
  ['Investigar laptop nueva', 'Elegir especificaciones', 'Trabajo'],
  ['Terminar página de ventas', 'Revisar textos', 'Negocio'],
  ['Planear viaje a CDMX', 'Elegir fechas', 'Personal'],
  ['Aprender edición avanzada', 'Buscar un curso', 'Estudio'],
];

const initialIdeas = [
  { title: 'Agencia de contenido con IA', detail: 'Servicio mensual para negocios locales', tags: ['IA', 'Marketing'], status: 'Explorando' },
  { title: 'App de hábitos para creativos', detail: 'Progreso simple con recompensas y niveles', tags: ['App', 'Productividad'], status: 'Validar' },
  { title: 'Estudio de marca personal', detail: 'Estrategia, diseño y contenido premium', tags: ['Diseño', 'Servicios'], status: 'Prioridad' },
  { title: 'Newsletter de oportunidades', detail: 'Ideas accionables de tecnología y negocios', tags: ['Contenido', 'Negocios'], status: 'Borrador' },
];

type StudyTask = { name: string; done: boolean; xpAwarded?: boolean };
type StudyModule = { name: string; tasks: StudyTask[] };
type StudyTopic = { name: string; progress: number; locked?: boolean; modules: StudyModule[] };
type StudyBranch = { name: string; icon: string; level: number; tone: string; topics: StudyTopic[] };

const studyBranches: StudyBranch[] = [
  { name: 'Marketing', icon: '📣', level: 5, tone: 'coral', topics: [
    { name: 'Fundamentos de marketing', progress: 100, modules: [] },
    { name: 'Cliente ideal', progress: 100, modules: [] },
    { name: 'Oferta', progress: 100, modules: [] },
    { name: 'Meta Ads', progress: 65, modules: [
      { name: 'Fundamentos', tasks: [{ name: 'Entender el ecosistema de Meta', done: true }] },
      { name: 'Estructura de campañas', tasks: [{ name: 'Crear estructura de prueba', done: true }] },
      { name: 'Creativos', tasks: [{ name: 'Analizar 10 anuncios', done: true }] },
      { name: 'Audiencias', tasks: [{ name: 'Ver video sobre públicos', done: true }, { name: 'Leer artículo sobre Advantage+', done: true }, { name: 'Investigar públicos Lookalike', done: false }, { name: 'Hacer prueba en campaña real', done: false }, { name: 'Escribir mis conclusiones', done: false }] },
      { name: 'Optimización', tasks: [{ name: 'Definir métricas principales', done: false }] },
      { name: 'Escalamiento', tasks: [{ name: 'Documentar reglas de escala', done: false }] },
    ] },
    { name: 'Copywriting', progress: 40, modules: [{ name: 'Mensajes que venden', tasks: [{ name: 'Escribir 10 titulares', done: true }, { name: 'Practicar PAS y AIDA', done: false }] }] },
    { name: 'Google Ads', progress: 0, modules: [{ name: 'Primeros pasos', tasks: [{ name: 'Crear cuenta de práctica', done: false }] }] },
    { name: 'Branding avanzado', progress: 0, locked: true, modules: [] },
    { name: 'Analítica avanzada', progress: 0, locked: true, modules: [] },
  ] },
  { name: 'Tecnología / IA', icon: '💻', level: 4, tone: 'blue', topics: [{ name: 'Automatización', progress: 70, modules: [{ name: 'Flujos', tasks: [{ name: 'Crear primera automatización', done: true }, { name: 'Conectar herramientas', done: false }] }] }, { name: 'IA aplicada', progress: 45, modules: [] }, { name: 'Desarrollo web', progress: 30, modules: [] }] },
  { name: 'Negocios', icon: '📊', level: 5, tone: 'gold', topics: [{ name: 'Modelo de negocio', progress: 80, modules: [] }, { name: 'Ventas', progress: 55, modules: [] }, { name: 'Operaciones', progress: 25, modules: [] }] },
  { name: 'Finanzas', icon: '🪙', level: 3, tone: 'green', topics: [{ name: 'Finanzas personales', progress: 75, modules: [] }, { name: 'Inversión', progress: 35, modules: [] }, { name: 'Impuestos', progress: 10, modules: [] }] },
  { name: 'Salud', icon: '🏋️', level: 3, tone: 'aqua', topics: [{ name: 'Entrenamiento', progress: 70, modules: [] }, { name: 'Nutrición', progress: 40, modules: [] }, { name: 'Sueño', progress: 45, modules: [] }] },
  { name: 'Desarrollo personal', icon: '🧠', level: 4, tone: 'purple', topics: [{ name: 'Disciplina', progress: 80, modules: [] }, { name: 'Enfoque', progress: 60, modules: [] }, { name: 'Mentalidad', progress: 65, modules: [] }] },
  { name: 'Diseño', icon: '🎨', level: 3, tone: 'pink', topics: [{ name: 'Diseño visual', progress: 55, modules: [] }, { name: 'Marca', progress: 35, modules: [] }, { name: 'UX/UI', progress: 20, modules: [] }] },
  { name: 'Habilidades sociales', icon: '👥', level: 2, tone: 'orange', topics: [{ name: 'Comunicación', progress: 50, modules: [] }, { name: 'Negociación', progress: 25, modules: [] }, { name: 'Networking', progress: 20, modules: [] }] },
];

function StudyView({ skillXp, onTaskToggled, onKnowledgeSummary }: { skillXp: Record<string, number>; onTaskToggled: (branch: string, taskId: string, reason: string, done: boolean, skillAmount: number, completedLevel?: number) => void; onKnowledgeSummary: (completed: number) => void }) {
  const [branches, setBranches] = useState(fullStudyBranches);
  const [branchIndex, setBranchIndex] = useState<number | null>(null);
  const [topicIndex, setTopicIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [material, setMaterial] = useState({ title: '', branch: 'Marketing', topic: 'Meta Ads', type: '🎥 Video' });
  const [saved, setSaved] = useState<{ title: string; branch: string; topic: string; type: string }[]>([]);
  const [studyReady, setStudyReady] = useState(false);

  useEffect(() => {
    try {
      const storedBranches = JSON.parse(localStorage.getItem('daniel-os-study-v2') || 'null');
      const storedSaved = JSON.parse(localStorage.getItem('daniel-os-study-saved') || 'null');
      if (storedBranches) setBranches(storedBranches.map((branch: StudyBranch) => ({
        ...branch,
        topics: branch.topics.map((topic, index) => ({
          ...topic,
          locked: index > 0 && branch.topics[index - 1].progress < 100,
          modules: topic.modules.map((module) => ({
            ...module,
            tasks: module.tasks.map((task) => ({ ...task, xpAwarded: task.xpAwarded ?? task.done })),
          })),
        })),
      })));
      if (storedSaved) setSaved(storedSaved);
    } catch { /* Keep the starter curriculum. */ }
    setStudyReady(true);
  }, []);
  useEffect(() => { if (studyReady) localStorage.setItem('daniel-os-study-v2', JSON.stringify(branches)); }, [branches, studyReady]);
  useEffect(() => { if (studyReady) localStorage.setItem('daniel-os-study-saved', JSON.stringify(saved)); }, [saved, studyReady]);

  const selectedBranch = branchIndex === null ? null : branches[branchIndex];
  const selectedTopic = selectedBranch && topicIndex !== null ? selectedBranch.topics[topicIndex] : null;
  const completedTopics = branches.flatMap((branch) => branch.topics).filter((topic) => topic.progress === 100).length;
  const totalTopics = branches.flatMap((branch) => branch.topics).length;
  const overall = Math.round(branches.flatMap((branch) => branch.topics).reduce((sum, topic) => sum + topic.progress, 0) / totalTopics);
  const visibleBranches = branches.map((branch, index) => ({ branch, index })).filter(({ branch }) => branch.name.toLowerCase().includes(query.toLowerCase()) || branch.topics.some((topic) => topic.name.toLowerCase().includes(query.toLowerCase())));
  const openBranch = (index: number) => { setBranchIndex(index); setTopicIndex(null); };
  const toggleStudyTask = (moduleIndex: number, taskIndex: number) => {
    if (branchIndex === null || topicIndex === null) return;
    const branch = branches[branchIndex];
    const topic = branch.topics[topicIndex];
    if (topic.locked) return;
    const task = topic.modules[moduleIndex].tasks[taskIndex];
    const nextDone = !task.done;
    const allTasks = topic.modules.flatMap((module) => module.tasks);
    const themeIndex = topic.modules.slice(0, moduleIndex).reduce((sum, module) => sum + module.tasks.length, 0) + taskIndex;
    const skillAmount = nextDone && !task.xpAwarded ? skillXpForTheme(topicIndex + 1, themeIndex, allTasks.length) : 0;
    const willComplete = nextDone && allTasks.every((item) => item === task || item.done);
    onTaskToggled(branch.name, `${branchIndex}:${topicIndex}:${moduleIndex}:${taskIndex}:${task.name}`, task.name, nextDone, skillAmount, willComplete ? topicIndex + 1 : undefined);
    setBranches((current) => current.map((branch, bi) => {
      if (bi !== branchIndex) return branch;
      let topics = branch.topics.map((topic, ti) => {
        if (ti !== topicIndex) return topic;
        const modules = topic.modules.map((module, mi) => mi !== moduleIndex ? module : { ...module, tasks: module.tasks.map((task, xi) => xi === taskIndex ? { ...task, done: !task.done, xpAwarded: task.xpAwarded || !task.done } : task) });
        const tasks = modules.flatMap((module) => module.tasks);
        const progress = tasks.length ? Math.round(tasks.filter((task) => task.done).length / tasks.length * 100) : topic.progress;
        return { ...topic, modules, progress };
      });
      topics = topics.map((topic, index) => ({ ...topic, locked: index > 0 && topics[index - 1].progress < 100 }));
      const completedLevels = topics.filter((topic) => topic.progress === 100).length;
      return { ...branch, topics, level: Math.min(topics.length, completedLevels + 1) };
    }));
    if (willComplete) window.setTimeout(() => window.alert(`NIVEL COMPLETADO\n\n${branch.name}\nNivel ${topicIndex + 1} completado\n\n+${skillLevelXp(Math.min(20, topicIndex + 2))} XP total conseguido${topicIndex < branch.topics.length - 1 ? `\n\nNIVEL ${topicIndex + 2} DESBLOQUEADO` : ''}`), 0);
  };
  useEffect(() => { if (studyReady) onKnowledgeSummary(completedTopics); }, [studyReady, completedTopics]);
  const saveMaterial = () => {
    if (!material.title.trim()) return;
    setSaved((current) => [{ ...material, title: material.title.trim() }, ...current]);
    setMaterial((current) => ({ ...current, title: '' }));
    setShowSave(false);
  };
  const branchTopics = branches.find((branch) => branch.name === material.branch)?.topics.filter((topic) => !topic.locked) || [];

  return <section className="studyView" aria-label="Panel de estudio">
    <header className="studyHeader"><div><span>📖 PLAN DE ESTUDIOS</span><h1>Árbol de conocimiento</h1><p>Aprende hoy, construye la vida que quieres.</p></div><div className="studyTools"><label>⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ramas o temas" /></label><button onClick={() => setShowSave(true)}>＋ Guardar para estudiar</button></div></header>
    {selectedBranch ? <div className="coursePanel">
      <button className="studyBack" onClick={() => topicIndex === null ? setBranchIndex(null) : setTopicIndex(null)}>‹ {topicIndex === null ? 'Volver al árbol' : selectedBranch.name}</button>
      <small>{selectedBranch.name}: {Math.round(skillXp[selectedBranch.name] || 0)} XP · Nivel {skillLevel(skillXp[selectedBranch.name] || 0)}</small>
      {selectedTopic ? <div className="topicCourse"><header><span>{selectedBranch.icon} {selectedBranch.name}</span><h2>{selectedTopic.name}</h2><div><i style={{ width: `${selectedTopic.progress}%` }} /></div><b>{selectedTopic.progress}% completado</b></header><div className="moduleList">{selectedTopic.modules.length ? selectedTopic.modules.map((module, moduleIndex) => { const done = module.tasks.length > 0 && module.tasks.every((task) => task.done); return <article key={module.name}><header><span>MÓDULO {moduleIndex + 1}</span><b>{module.name}</b><em>{done ? '✓ Completado' : module.tasks.some((task) => task.done) ? 'En progreso' : 'Pendiente'}</em></header>{module.tasks.map((task, taskIndex) => <button className={task.done ? 'done' : ''} onClick={() => toggleStudyTask(moduleIndex, taskIndex)} key={task.name}><i>{task.done ? '✓' : ''}</i><span>{task.name}</span></button>)}</article>; }) : <div className="emptyCourse"><b>Curso listo para crecer</b><p>Guarda videos, lecturas o prácticas para construir este tema.</p><button onClick={() => setShowSave(true)}>＋ Agregar material</button></div>}</div></div> : <><div className={`branchTitle ${selectedBranch.tone}`}><i>{selectedBranch.icon}</i><span><small>RAMA DE CONOCIMIENTO</small><h2>{selectedBranch.name}</h2><b>Nivel {selectedBranch.level}</b></span></div><div className="topicList">{selectedBranch.topics.map((topic, index) => <button disabled={topic.locked} onClick={() => setTopicIndex(index)} key={topic.name}><i>{topic.locked ? '🔒' : topic.progress === 100 ? '✓' : topic.progress > 0 ? '●' : '○'}</i><span><b>{topic.name}</b><small>{topic.locked ? 'Completa los temas anteriores' : topic.progress === 100 ? 'Completado' : topic.progress > 0 ? 'En curso' : 'Sin empezar'}</small></span>{!topic.locked && <><div><em style={{ width: `${topic.progress}%` }} /></div><strong>{topic.progress}%</strong></>}</button>)}</div></>}
    </div> : <><div className="studyOverview"><article><div className="progressRing" style={{ '--progress': `${overall * 3.6}deg` } as CSSProperties}><b>{overall}%</b><span>completado</span></div><ul><li><i />Completados <b>{completedTopics}</b></li><li><i />En curso <b>{totalTopics - completedTopics}</b></li><li><i />Por aprender <b>{saved.length}</b></li></ul><p>“Un poco mejor cada día, grandes resultados con el tiempo.”</p></article><div className="knowledgeTree" style={{ backgroundImage: 'linear-gradient(#08051a22,#08051aaa),url(/study-tree.png)' }}>{visibleBranches.map(({ branch, index }) => { const progress = branch.topics[Math.min(branch.level - 1, branch.topics.length - 1)]?.progress || 0; return <button className={`treeNode node${index + 1} ${branch.tone}`} onClick={() => openBranch(index)} key={branch.name}><i>{branch.icon}</i><span><b>{branch.name}</b><small>Nivel {branch.level} · {progress}%</small><em><strong style={{ width: `${progress}%` }} /></em></span></button>; })}</div></div>{saved.length > 0 && <section className="studyInbox"><header><div><span>📥</span><h2>Pendiente por aprender</h2></div><b>{saved.length} guardados</b></header><div>{saved.map((item, index) => <article key={`${item.title}-${index}`}><i>{item.type.split(' ')[0]}</i><span><b>{item.title}</b><small>{item.branch} → {item.topic}</small></span><em>{item.type.replace(/^\S+\s/, '')}</em></article>)}</div></section>}</>}
    {showSave && <div className="studyModalBackdrop" onMouseDown={() => setShowSave(false)}><section className="studyModal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><header><div><span>GUARDAR PARA ESTUDIAR</span><h2>Nuevo material</h2></div><button onClick={() => setShowSave(false)}>×</button></header><label>Título<input autoFocus value={material.title} onChange={(event) => setMaterial({ ...material, title: event.target.value })} placeholder="Ej. Cómo manejar objeciones" /></label><label>Rama<select value={material.branch} onChange={(event) => { const branch = branches.find((item) => item.name === event.target.value)!; setMaterial({ ...material, branch: branch.name, topic: branch.topics.find((topic) => !topic.locked)?.name || '' }); }}>{branches.map((branch) => <option key={branch.name}>{branch.name}</option>)}</select></label><label>Tema<select value={material.topic} onChange={(event) => setMaterial({ ...material, topic: event.target.value })}>{branchTopics.map((topic) => <option key={topic.name}>{topic.name}</option>)}</select></label><fieldset><legend>Tipo</legend><div>{['🎥 Video','📄 Artículo','📚 Libro','🧪 Práctica','📝 Nota'].map((type) => <button className={material.type === type ? 'selected' : ''} onClick={() => setMaterial({ ...material, type })} key={type}>{type}</button>)}</div></fieldset><button className="saveStudy" onClick={saveMaterial}>Guardar material</button></section></div>}
  </section>;
}

const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dateFromKey = (key: string) => new Date(`${key}T12:00:00`);
const weekKey = (date: Date) => { const monday = new Date(date); monday.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return dayKey(monday); };
const reminderKey = (item: string[]) => item.join('|');
const buildMonth = (month: Date) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const total = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: Math.ceil((offset + total) / 7) * 7 }, (_, index) => {
    const day = index - offset + 1;
    return day > 0 && day <= total ? { day, key: dayKey(new Date(year, monthIndex, day)) } : null;
  });
};

export default function Home() {
  const [active, setActive] = useState('HOME');
  const [progression, setProgression] = useState<ProgressionState>(INITIAL_PROGRESSION);
  const [progressionReady, setProgressionReady] = useState(false);
  const [coverLevel, setCoverLevel] = useState(1);
  const [knowledgeTopics, setKnowledgeTopics] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [ideaItems, setIdeaItems] = useState(initialIdeas);
  const [newIdea, setNewIdea] = useState('');
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [doneActivities, setDoneActivities] = useState<number[]>([]);
  const [doneTasks, setDoneTasks] = useState<number[]>([]);
  const [activityItems, setActivityItems] = useState(dailyActivities);
  const [taskItems, setTaskItems] = useState(pendingActivities);
  const [reminderItems, setReminderItems] = useState(initialReminders);
  const [doneReminders, setDoneReminders] = useState<number[]>([]);
  const [reminderExpiry, setReminderExpiry] = useState<Record<string, number>>({});
  const [activityHistory, setActivityHistory] = useState<Record<string, number>>({});
  const [historyStart, setHistoryStart] = useState(dayKey());
  const [showHistory, setShowHistory] = useState(false);
  const [historyMonth, setHistoryMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); });
  const [modalType, setModalType] = useState<'habit' | 'task' | 'reminder' | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemXp, setItemXp] = useState('5');
  const [itemCategory, setItemCategory] = useState('Compras');
  const [habitToDelete, setHabitToDelete] = useState<number | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [moneyReady, setMoneyReady] = useState(false);
  const [cash, setCash] = useState(0);
  const [moneyTransactions, setMoneyTransactions] = useState<MoneyTransaction[]>([]);
  const [moneyAssets, setMoneyAssets] = useState<MoneyAsset[]>([]);
  const [moneyModal, setMoneyModal] = useState<MoneyModal>(null);
  const [moneyConcept, setMoneyConcept] = useState('');
  const [moneyAmount, setMoneyAmount] = useState('');
  const [moneyAssetKind, setMoneyAssetKind] = useState<MoneyAsset['kind']>('asset');
  const [unlockedLevel, setUnlockedLevel] = useState<number | null>(null);
  const [calendar, setCalendar] = useState({ label: 'Esta semana', date: '', todayIndex: 0, days: ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => ({ day, date: '' })) });
  const level = progression.highestLevelUnlocked;
  const levelCover = `/levels/level-${String(coverLevel).padStart(2, '0')}.webp`;
  const cover = completed ? '/levels/victory.webp' : levelCover;
  const levelTier = level >= 30 ? 'gold' : level >= 15 ? 'silver' : 'bronze';
  const levelTierLabel = level >= 30 ? 'oro' : level >= 15 ? 'plata' : 'bronce';
  const completion = activityItems.length ? Math.round(doneActivities.length / activityItems.length * 100) : 0;
  const taskCompletion = taskItems.length ? Math.round(doneTasks.length / taskItems.length * 100) : 0;
  const todayXp = progression.xpHistory.filter((entry) => entry.date === dayKey()).reduce((total, entry) => total + entry.amount, 0);
  const dayCompletion = Math.round((completion + taskCompletion) / 2);
  const liveWeekProgress = weekProgress.map((value, index) => index > calendar.todayIndex ? 0 : index === calendar.todayIndex ? completion : value);
  const monthCalendar = buildMonth(historyMonth);
  const monthLabel = historyMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  const isCurrentMonth = historyMonth.getFullYear() === new Date().getFullYear() && historyMonth.getMonth() === new Date().getMonth();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyTransactions = moneyTransactions.filter((item) => item.date.startsWith(currentMonth));
  const monthlyIncome = monthlyTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const monthlyExpense = monthlyTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const assetsTotal = moneyAssets.filter((item) => item.kind !== 'debt').reduce((sum, item) => sum + item.value, 0);
  const debtTotal = moneyAssets.filter((item) => item.kind === 'debt').reduce((sum, item) => sum + item.value, 0);
  const totalWorth = cash + assetsTotal - debtTotal;
  const netMonthlyIncome = monthlyIncome - monthlyExpense;
  const averageNetIncome = (months: number) => Array.from({ length: months }, (_, offset) => {
    const month = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    return moneyTransactions.filter((item) => item.date.startsWith(key)).reduce((sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount), 0);
  }).reduce((sum, value) => sum + value, 0) / months;
  const annualIncome = moneyTransactions.filter((item) => item.type === 'income' && item.date.startsWith(String(now.getFullYear()))).reduce((sum, item) => sum + item.amount, 0);
  const monthlyChart = Array.from({ length: 12 }, (_, month) => moneyTransactions.filter((item) => item.type === 'income' && item.date.startsWith(`${now.getFullYear()}-${String(month + 1).padStart(2, '0')}`)).reduce((sum, item) => sum + item.amount, 0));
  const chartMax = Math.max(1, ...monthlyChart);
  const targetLevelForStability = Math.min(level + 1, GAME_CONFIG.maxLevel);
  const stabilityIncomeTarget = requirementForLevel(targetLevelForStability).netMonthlyIncome;
  const importantTaskIndexes = taskItems.map((item, index) => ({ item, index })).filter(({ item }) => xpFromLabel(item[3]) >= 20).map(({ index }) => index);
  const priorityCompletion = percentage(importantTaskIndexes.filter((index) => doneTasks.includes(index)).length, importantTaskIndexes.length);
  const healthActivityIndexes = activityItems.map((item, index) => ({ item, index })).filter(({ item }) => STABILITY_CONFIG.healthPattern.test(`${item[0]} ${item[1]}`)).map(({ index }) => index);
  const healthCompletion = percentage(healthActivityIndexes.filter((index) => doneActivities.includes(index)).length, healthActivityIndexes.length);
  const todayStability = {
    habits: completion,
    productivity: priorityCompletion,
    finances: monthlyTransactions.length ? financialStability(netMonthlyIncome, monthlyIncome, monthlyExpense, stabilityIncomeTarget) : 0,
    health: healthCompletion,
    learning: percentage(progression.learningByDay[dayKey()] || 0, STABILITY_CONFIG.learningDailyTarget),
  };
  const stabilityWindowDays = stabilityWindowDaysForLevel(targetLevelForStability);
  const stability = averageStability({ ...progression.stabilityByDay, [dayKey()]: todayStability }, now, stabilityWindowDays);
  const stabilityLabel = stabilityClassification(stability);

  useEffect(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const dayLetters = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const days = dayLetters.map((day, index) => { const date = new Date(monday); date.setDate(monday.getDate() + index); return { day, date: String(date.getDate()) }; });
    setCalendar({ label: now.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }), date: now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }), todayIndex: (now.getDay() + 6) % 7, days });
  }, []);

  useEffect(() => {
    try {
      const savedStudy = JSON.parse(localStorage.getItem(GAME_CONFIG.storage.study) || 'null') as StudyBranch[] | null;
      if (savedStudy) setKnowledgeTopics(savedStudy.flatMap((branch) => branch.topics).filter((topic) => topic.progress === 100).length);
    } catch { /* Keep knowledge progress at zero until valid local data exists. */ }
  }, []);

  useEffect(() => {
    try {
      const today = dayKey();
      const savedDay = localStorage.getItem('daniel-os-day');
      const savedHabits = JSON.parse(localStorage.getItem('daniel-os-habits') || 'null') as string[][] | null;
      const savedTasks = JSON.parse(localStorage.getItem('daniel-os-tasks') || 'null') as string[][] | null;
      const savedDoneHabits = JSON.parse(localStorage.getItem('daniel-os-done-habits') || '[]') as number[];
      const savedDoneTasks = JSON.parse(localStorage.getItem('daniel-os-done-tasks') || '[]') as number[];
      const savedReminders = JSON.parse(localStorage.getItem('daniel-os-reminders') || 'null') as string[][] | null;
      const savedDoneReminders = JSON.parse(localStorage.getItem('daniel-os-done-reminders') || '[]') as number[];
      const savedReminderExpiry = JSON.parse(localStorage.getItem('daniel-os-reminder-expiry') || '{}') as Record<string, number>;
      const savedHistory = JSON.parse(localStorage.getItem('daniel-os-activity-history') || '{}') as Record<string, number>;
      if (savedHabits) setActivityItems(savedHabits);
      if (savedTasks) setTaskItems(savedDay && savedDay !== today ? savedTasks.filter((_, index) => !savedDoneTasks.includes(index)) : savedTasks);
      if (savedReminders) setReminderItems(savedReminders);
      setDoneReminders(savedDoneReminders);
      setReminderExpiry(savedReminderExpiry);
      setActivityHistory(savedHistory);
      setHistoryStart(localStorage.getItem('daniel-os-history-start') || today);
      if (savedDay === today) {
        setDoneActivities(savedDoneHabits);
        setDoneTasks(savedDoneTasks);
      }
      localStorage.setItem('daniel-os-day', today);
    } catch {
      localStorage.setItem('daniel-os-day', dayKey());
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GAME_CONFIG.storage.progression) || localStorage.getItem('daniel-os-progression-v1') || 'null') as Partial<ProgressionState> | null;
      if (saved) setProgression({ ...INITIAL_PROGRESSION, ...saved,
        level: Math.max(1, saved.highestLevelUnlocked || saved.level || 1), highestLevelUnlocked: Math.max(1, saved.highestLevelUnlocked || saved.level || 1),
        skillXp: saved.skillXp || {}, learningByDay: saved.learningByDay || {}, stabilityByDay: saved.stabilityByDay || {},
        habitDays: saved.habitDays || {}, dailyGeneralXp: saved.dailyGeneralXp || {}, activeXpAwards: saved.activeXpAwards || [],
        claimedRewards: saved.claimedRewards || [], xpHistory: saved.xpHistory || [] });
    } catch { /* El sistema comienza en cero. */ }
    setProgressionReady(true);
  }, []);

  useEffect(() => {
    if (progressionReady) localStorage.setItem(GAME_CONFIG.storage.progression, JSON.stringify(progression));
  }, [progressionReady, progression]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GAME_CONFIG.storage.money) || localStorage.getItem('daniel-os-money-v1') || 'null') as { cash?: number; transactions?: MoneyTransaction[]; assets?: MoneyAsset[] } | null;
      if (saved) {
        setCash(Number(saved.cash) || 0);
        setMoneyTransactions(saved.transactions || []);
        setMoneyAssets((saved.assets || []).map((asset) => ({ ...asset, kind: asset.kind || 'asset' })));
      }
    } catch { /* Empieza en cero si el registro local no es válido. */ }
    setMoneyReady(true);
  }, []);

  useEffect(() => {
    if (moneyReady) localStorage.setItem(GAME_CONFIG.storage.money, JSON.stringify({ cash, transactions: moneyTransactions, assets: moneyAssets }));
  }, [moneyReady, cash, moneyTransactions, moneyAssets]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem('daniel-os-habits', JSON.stringify(activityItems));
    localStorage.setItem('daniel-os-tasks', JSON.stringify(taskItems));
    localStorage.setItem('daniel-os-done-habits', JSON.stringify(doneActivities));
    localStorage.setItem('daniel-os-done-tasks', JSON.stringify(doneTasks));
    localStorage.setItem('daniel-os-reminders', JSON.stringify(reminderItems));
    localStorage.setItem('daniel-os-done-reminders', JSON.stringify(doneReminders));
    localStorage.setItem('daniel-os-reminder-expiry', JSON.stringify(reminderExpiry));
    localStorage.setItem('daniel-os-activity-history', JSON.stringify(activityHistory));
    localStorage.setItem('daniel-os-history-start', historyStart);
  }, [storageReady, activityItems, taskItems, doneActivities, doneTasks, reminderItems, doneReminders, reminderExpiry, activityHistory, historyStart]);

  useEffect(() => {
    if (!storageReady) return;
    setActivityHistory((current) => current[dayKey()] === completion ? current : { ...current, [dayKey()]: completion });
  }, [storageReady, completion]);

  useEffect(() => {
    if (!progressionReady || !storageReady || !moneyReady) return;
    setProgression((current) => ({ ...current, stabilityByDay: { ...current.stabilityByDay, [dayKey()]: todayStability } }));
  }, [progressionReady, storageReady, moneyReady, completion, taskCompletion, healthCompletion, monthlyIncome, monthlyExpense, progression.learningByDay[dayKey()]]);

  useEffect(() => {
    if (!progressionReady || !storageReady) return;
    setProgression((current) => {
      const habitDays = { ...current.habitDays, [dayKey()]: { done: doneActivities.length, total: activityItems.length } };
      const streak = habitStreak(habitDays, new Date());
      return current.streak === streak && current.habitDays[dayKey()]?.done === doneActivities.length && current.habitDays[dayKey()]?.total === activityItems.length
        ? current : { ...current, habitDays, streak };
    });
  }, [progressionReady, storageReady, doneActivities.length, activityItems.length]);

  useEffect(() => {
    if (!progressionReady) return;
    setProgression((current) => {
      let next = current;
      let changed = false;
      for (const [daysText, amount] of Object.entries(XP_CONFIG.streaks)) {
        const days = Number(daysText);
        const id = `streak:${days}`;
        if (current.streak < days || next.claimedRewards.includes(id)) continue;
        next = grantXp(next, { id, date: dayKey(), general: amount, reason: `Racha de ${days} días`, type: 'streak' });
        next = { ...next, claimedRewards: [...next.claimedRewards, id] };
        changed = true;
      }
      for (const [daysText, amount] of Object.entries(COIN_CONFIG.streaks)) {
        const days = Number(daysText);
        const updated = current.streak >= days ? grantCoins(next, `coins:streak:${days}`, amount) : next;
        if (updated !== next) { next = updated; changed = true; }
      }
      return changed ? next : current;
    });
  }, [progressionReady, progression.streak]);

  useEffect(() => {
    if (!progressionReady) return;
    setProgression((current) => {
      let next = current;
      const today = dayKey();
      const weeks = new Map<string, number>();
      const months = new Map<string, number>();
      Object.entries(current.stabilityByDay).forEach(([key, scores]) => {
        if (key >= today) return;
        next = grantCoins(next, `coins:day:${key}`, coinRewardForScore('daily', scores.productivity));
        weeks.set(weekKey(dateFromKey(key)), (weeks.get(weekKey(dateFromKey(key))) || 0) + scores.productivity);
        const month = key.slice(0, 7);
        months.set(month, (months.get(month) || 0) + scores.productivity);
      });
      weeks.forEach((sum, key) => {
        const end = dateFromKey(key); end.setDate(end.getDate() + 6);
        if (dayKey(end) < today) next = grantCoins(next, `coins:week:${key}`, coinRewardForScore('weekly', Math.round(sum / 7)));
      });
      months.forEach((sum, key) => {
        const [year, month] = key.split('-').map(Number);
        if (key < today.slice(0, 7)) next = grantCoins(next, `coins:month:${key}`, coinRewardForScore('monthly', Math.round(sum / new Date(year, month, 0).getDate())));
      });
      return next;
    });
  }, [progressionReady, progression.stabilityByDay]);

  useEffect(() => {
    if (!progressionReady || !moneyReady) return;
    setProgression((current) => {
      let next = current;
      let changed = false;
      for (const [worthText, amount] of Object.entries(XP_CONFIG.financialMilestones)) {
        const worth = Number(worthText);
        const id = `patrimonio:${worth}`;
        if (totalWorth < worth || next.claimedRewards.includes(id)) continue;
        next = grantXp(next, { id, date: dayKey(), general: amount, reason: `Hito de patrimonio: ${formatMoney(worth)}`, type: 'financial' });
        next = { ...next, claimedRewards: [...next.claimedRewards, id] };
        changed = true;
      }
      return changed ? next : current;
    });
  }, [progressionReady, moneyReady, totalWorth]);

  useEffect(() => {
    if (!progressionReady || !moneyReady) return;
    setProgression((current) => {
      let next = current;
      const closedMonths = [...new Set(moneyTransactions.map((item) => item.date.slice(0, 7)))].filter((month) => month < currentMonth);
      const incomeTarget = requirementForLevel(Math.min(current.highestLevelUnlocked + 1, GAME_CONFIG.maxLevel)).netMonthlyIncome;
      closedMonths.forEach((month) => {
        const transactions = moneyTransactions.filter((item) => item.date.startsWith(month));
        const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
        const expenses = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
        const net = income - expenses;
        if (incomeTarget > 0 && net >= incomeTarget) next = grantCoins(next, `coins:income-goal:${month}`, COIN_CONFIG.monthlyIncomeGoal);
        if (income > 0 && net / income >= STABILITY_CONFIG.finances.savingsRateTarget) next = grantCoins(next, `coins:savings-goal:${month}`, COIN_CONFIG.monthlySavingsGoal);
      });
      return next;
    });
  }, [progressionReady, moneyReady, moneyTransactions, currentMonth]);

  useEffect(() => {
    if (!storageReady) return;
    const removeExpired = () => {
      const expired = Object.entries(reminderExpiry).filter(([, expires]) => expires <= Date.now()).map(([key]) => key);
      if (!expired.length) return;
      setReminderItems((current) => {
        const kept = current.map((item, index) => ({ item, index })).filter(({ item }) => !expired.includes(reminderKey(item)));
        setDoneReminders((done) => done.filter((index) => kept.some((entry) => entry.index === index)).map((index) => kept.findIndex((entry) => entry.index === index)));
        return kept.map(({ item }) => item);
      });
      setReminderExpiry((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !expired.includes(key))));
    };
    removeExpired();
    const timer = window.setInterval(removeExpired, 30_000);
    return () => window.clearInterval(timer);
  }, [storageReady, reminderExpiry]);

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timer = window.setTimeout(() => {
      setDoneActivities([]);
      setTaskItems((current) => current.filter((_, index) => !doneTasks.includes(index)));
      setDoneTasks([]);
      localStorage.setItem('daniel-os-day', dayKey());
    }, midnight.getTime() - now.getTime());
    return () => window.clearTimeout(timer);
  }, [doneTasks]);

  useEffect(() => { setCoverLevel(level); }, [level]);

  const activityReward = (index: number): XpReward => {
    const item = activityItems[index];
    const isDeepWork = /trabajo profundo/i.test(item?.[0] || '');
    const hours = Number((item?.[1] || '').match(/\d+/)?.[0] || 0);
    return { id: `${dayKey()}:${isDeepWork ? 'deep' : 'habit'}:${item?.[0]}:${item?.[1]}`, date: dayKey(),
      general: isDeepWork ? Math.min(XP_CONFIG.deepWork.dailyLimit, Math.floor(hours) * XP_CONFIG.deepWork.perFullHour) : normalizedHabitXp(xpFromLabel(item?.[3])),
      reason: item?.[0] || 'Hábito', type: isDeepWork ? 'deep_work' : 'habit' };
  };
  const taskReward = (index: number): XpReward => {
    const item = taskItems[index];
    return { id: `${dayKey()}:task:${item?.[0]}:${item?.[1]}`, date: dayKey(), general: normalizedTaskXp(xpFromLabel(item?.[3])), reason: item?.[0] || 'Tarea', type: 'task' };
  };
  const toggleActivity = (index: number) => {
    const done = doneActivities.includes(index);
    const reward = activityReward(index);
    setProgression((current) => done ? revokeXp(current, reward) : grantXp(current, reward));
    setDoneActivities((current) => done ? current.filter((item) => item !== index) : [...current, index]);
  };
  const toggleTask = (index: number) => {
    const done = doneTasks.includes(index);
    const reward = taskReward(index);
    setProgression((current) => done ? revokeXp(current, reward) : grantXp(current, reward));
    setDoneTasks((current) => done ? current.filter((item) => item !== index) : [...current, index]);
  };
  const toggleStudyProgress = (branch: string, taskId: string, reason: string, done: boolean, skillAmount: number, completedLevel?: number) => setProgression((current) => {
    let next = skillAmount > 0 ? grantXp(current, { id: `knowledge-theme:${taskId}`, date: dayKey(), general: 0, reason, type: 'special', skill: branch, skillAmount }) : current;
    if (completedLevel) {
      next = grantXp(next, { id: `knowledge-level:${branch}:${completedLevel}`, date: dayKey(), general: knowledgeLevelGeneralXp(completedLevel), reason: `${branch}: Nivel ${completedLevel} completado`, type: 'special' });
      next = grantCoins(next, `coins:skill-level:${branch}:${completedLevel}`, COIN_CONFIG.skillLevelMilestones[completedLevel as keyof typeof COIN_CONFIG.skillLevelMilestones] || 0);
    }
    return { ...next, learningByDay: { ...next.learningByDay, [dayKey()]: Math.max(0, (next.learningByDay[dayKey()] || 0) + (done ? 1 : -1)) } };
  });
  const toggleReminder = (index: number) => {
    const key = reminderKey(reminderItems[index]);
    if (doneReminders.includes(index)) {
      setDoneReminders((current) => current.filter((item) => item !== index));
      setReminderExpiry((current) => { const next = { ...current }; delete next[key]; return next; });
    } else {
      setDoneReminders((current) => [...current, index]);
      setReminderExpiry((current) => ({ ...current, [key]: Date.now() + 60 * 60 * 1000 }));
    }
  };
  const deleteHabit = () => {
    if (habitToDelete === null) return;
    if (doneActivities.includes(habitToDelete)) {
      const reward = activityReward(habitToDelete);
      setProgression((current) => revokeXp(current, reward));
    }
    setActivityItems((current) => current.filter((_, index) => index !== habitToDelete));
    setDoneActivities((current) => current.filter((index) => index !== habitToDelete).map((index) => index > habitToDelete ? index - 1 : index));
    setHabitToDelete(null);
  };
  const openItemModal = (type: 'habit' | 'task' | 'reminder') => { setModalType(type); setItemName(''); setItemDescription(''); setItemXp(type === 'habit' ? '5' : '0'); setItemCategory('Compras'); };
  const saveItem = () => {
    const name = itemName.trim();
    if (!name || !modalType) return;
    const description = itemDescription.trim() || 'Sin descripción';
    if (modalType === 'habit') setActivityItems((current) => [...current, [name, description, '/icons/habits.webp', `+${itemXp} XP`]]);
    else if (modalType === 'task') {
      const difficulty = taskXp.find(([xp]) => xp === itemXp)?.[1] || 'Delegada';
      setTaskItems((current) => [...current, [name, description, difficulty, `+${itemXp} XP`]]);
    } else setReminderItems((current) => [...current, [name, description, itemCategory]]);
    setModalType(null);
  };
  const saveIdea = () => {
    const title = newIdea.trim();
    if (!title) return;
    setIdeaItems((current) => [{ title, detail: 'Idea nueva · agrega detalles cuando la desarrolles', tags: ['Nueva'], status: 'Capturada' }, ...current]);
    setNewIdea('');
    setShowIdeaForm(false);
  };
  const openMoneyModal = (type: MoneyModal) => { setMoneyModal(type); setMoneyConcept(''); setMoneyAmount(''); setMoneyAssetKind('asset'); };
  const saveMoney = () => {
    const amount = Number(moneyAmount);
    if (!moneyModal || !Number.isFinite(amount) || amount < 0 || (moneyModal !== 'balance' && amount === 0)) return;
    if (moneyModal === 'balance') setCash(amount);
    else if (moneyModal === 'asset') setMoneyAssets((items) => [...items, { id: Date.now(), name: moneyConcept.trim() || 'Patrimonio', detail: moneyAssetKind === 'debt' ? 'Deuda registrada' : 'Valor registrado', value: amount, kind: moneyAssetKind }]);
    else {
      const type = moneyModal;
      setMoneyTransactions((items) => [{ id: Date.now(), type, concept: moneyConcept.trim() || (type === 'income' ? 'Ingreso' : 'Gasto'), amount, date: new Date().toISOString() }, ...items]);
      setCash((value) => value + (type === 'income' ? amount : -amount));
    }
    setMoneyModal(null);
  };

  const nextLevel = Math.min(level + 1, 40);
  const nextRequirement = requirementForLevel(nextLevel);
  const incomeAverageMonths = incomeAverageMonthsForLevel(nextLevel);
  const qualifyingNetIncome = averageNetIncome(incomeAverageMonths);
  const bossRequirement = REWARD_CONFIG.bossLevels[nextLevel as keyof typeof REWARD_CONFIG.bossLevels];
  const profileRequirements = [
    { icon: '✦', label: 'XP general', current: progression.generalXp.toLocaleString('es-MX'), target: nextRequirement.xp.toLocaleString('es-MX'), progress: percentage(progression.generalXp, nextRequirement.xp), tone: 'purple', missing: `${Math.max(0, nextRequirement.xp - progression.generalXp).toLocaleString('es-MX')} XP general` },
    { icon: '$', label: 'Patrimonio neto', current: formatMoney(totalWorth), target: formatMoney(nextRequirement.netWorth), progress: percentage(totalWorth, nextRequirement.netWorth), tone: 'green', missing: `${formatMoney(Math.max(0, nextRequirement.netWorth - totalWorth))} de patrimonio` },
    { icon: '↗', label: `Ingreso neto · promedio ${incomeAverageMonths} meses`, current: formatMoney(qualifyingNetIncome), target: formatMoney(nextRequirement.netMonthlyIncome), progress: percentage(qualifyingNetIncome, nextRequirement.netMonthlyIncome), tone: 'blue', missing: `${formatMoney(Math.max(0, nextRequirement.netMonthlyIncome - qualifyingNetIncome))} de ingreso neto promedio` },
    { icon: '◈', label: `Estabilidad · ${stabilityLabel} · ${stabilityWindowDays} días`, current: `${stability}%`, target: `${nextRequirement.stability}%`, progress: percentage(stability, nextRequirement.stability), tone: 'orange', missing: `${Math.max(0, nextRequirement.stability - stability)}% de estabilidad` },
    ...(bossRequirement ? [{ icon: '♛', label: 'Requisito Boss Level', current: knowledgeTopics.toLocaleString('es-MX'), target: bossRequirement.completedKnowledgeTopics.toLocaleString('es-MX'), progress: percentage(knowledgeTopics, bossRequirement.completedKnowledgeTopics), tone: 'purple', missing: `${Math.max(0, bossRequirement.completedKnowledgeTopics - knowledgeTopics)} temas de conocimiento` }] : []),
  ];
  const missingRequirements = level === GAME_CONFIG.maxLevel ? [] : profileRequirements.filter((item) => item.progress < 100);
  const canLevelUp = level < GAME_CONFIG.maxLevel && profileRequirements.every((item) => item.progress >= 100);
  const recentXp = progression.xpHistory.slice(-5).reverse();
  const nextFinancialMilestone = Object.entries(XP_CONFIG.financialMilestones).map(([target, reward]) => ({ target: Number(target), reward })).find((item) => item.target > totalWorth);
  const nextStreakMilestone = Object.entries(XP_CONFIG.streaks).map(([target, reward]) => ({ target: Number(target), reward })).find((item) => item.target > progression.streak);
  const nextBossLevel = Object.entries(REWARD_CONFIG.bossLevels).map(([bossLevel, requirement]) => ({ level: Number(bossLevel), ...requirement })).find((boss) => boss.level > level);

  useEffect(() => {
    if (!progressionReady || !canLevelUp) return;
    const unlocked = Math.min(GAME_CONFIG.maxLevel, level + 1);
    setProgression((current) => grantCoins({ ...current, level: unlocked, highestLevelUnlocked: Math.max(current.highestLevelUnlocked, unlocked) }, `coins:general-level:${unlocked}`, unlocked * COIN_CONFIG.generalLevelMultiplier));
    setUnlockedLevel(unlocked);
  }, [progressionReady, canLevelUp, level]);

  useEffect(() => {
    if (!unlockedLevel) return;
    const timer = window.setTimeout(() => setUnlockedLevel(null), 3500);
    return () => window.clearTimeout(timer);
  }, [unlockedLevel]);

  return (
    <main className="stage">
      <section className="dashboard" aria-label="Panel de progreso personal">
        <header className="topbar">
          <div className="profile"><div className={`avatar ${levelTier}`} role="img" aria-label={`Nivel ${level}, categoría ${levelTierLabel}`}><b>{level}</b></div><div><strong>DANIEL</strong><span>Nivel {level} <i /></span></div></div>
          <div className="topStats">
            <div className="statCard"><img src="/icons/xp.webp" alt="" /><span><b>XP</b><strong>{progression.generalXp.toLocaleString('es-MX')}</strong></span></div>
            <div className="statCard"><img src="/icons/coins.webp" alt="" /><span><b>Monedas</b><strong>{progression.coins.toLocaleString('es-MX')}</strong></span></div>
            <div className="statCard streakCard"><img src="/icons/streak.webp" alt="" /><span><b>Racha</b><strong>{progression.streak} <small>días</small></strong></span></div>
          </div>
        </header>

        {active === 'Ideas' ? (
          <section className="ideasView" aria-label="Panel de ideas de negocio">
            <div className="ideasHeading"><div><span>BANCO DE OPORTUNIDADES</span><h1>Ideas</h1><p>Guarda lo que se te ocurra y decide después qué desarrollar.</p></div><button onClick={() => setShowIdeaForm(true)}><img src="/icons/ideas.webp" alt="" />＋ Nueva idea</button></div>
            {showIdeaForm && <div className="newIdeaForm"><input autoFocus value={newIdea} onChange={(event) => setNewIdea(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && saveIdea()} placeholder="Escribe tu idea de negocio…" aria-label="Título de la nueva idea" /><button onClick={saveIdea}>Guardar</button><button className="cancel" onClick={() => setShowIdeaForm(false)}>Cancelar</button></div>}
            <div className="ideaList">
              {ideaItems.map((idea, index) => <article key={`${idea.title}-${index}`}><div className="ideaNumber">{String(index + 1).padStart(2, '0')}</div><div className="ideaCopy"><b>{idea.title}</b><p>{idea.detail}</p><div>{idea.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><em>{idea.status}</em><button aria-label={`Ver detalles de ${idea.title}`}>›</button></article>)}
            </div>
          </section>
        ) : active === 'Estudio' ? (
          <StudyView skillXp={progression.skillXp} onTaskToggled={toggleStudyProgress} onKnowledgeSummary={setKnowledgeTopics} />
        ) : active === 'Actividades' ? (
          <section className="activitiesView" aria-label="Panel de actividades">
            <div className="activitiesHeading"><div><span>HOY · {calendar.date || 'FECHA ACTUAL'}</span><h1>Actividades</h1><p>Pequeñas acciones, grandes resultados.</p></div><div className="dailyScore"><b>{doneActivities.length}/{activityItems.length}</b><span>completadas</span></div></div>
            <div className="activitySummary">
              <article><img src="/icons/streak.webp" alt="" /><span><small>Racha</small><b>{progression.streak} días</b></span></article>
              <article><img src="/icons/xp.webp" alt="" /><span><small>XP de hoy</small><b>+{todayXp}</b></span></article>
              <article><img src="/icons/habits.webp" alt="" /><span><small>Objetivo diario</small><b>{completion}%</b></span></article>
              <article><img src="/icons/pending.webp" alt="" /><span><small>Pendientes</small><b>{taskItems.length} activos</b></span></article>
            </div>
            <div className="activityBoard">
              <article className="activityBox habitsBox"><header><div><b>Hábitos de hoy</b><small>Marca lo que vayas completando</small></div><div className="boxActions"><strong>{doneActivities.length}/{activityItems.length}</strong><button onClick={() => openItemModal('habit')}>＋ Agregar hábito</button></div></header><div className="activityList">{activityItems.map(([name, detail, icon, xp], index) => <div className="activityRow" key={`${name}-${index}`}><button className={`activityCheck ${doneActivities.includes(index) ? 'done' : ''}`} onClick={() => toggleActivity(index)}><i>{doneActivities.includes(index) ? '✓' : ''}</i><img src={icon} alt="" /><span><b>{name}</b><small>{detail}</small></span><em>{xp}</em></button><button className="deleteHabit" onClick={() => setHabitToDelete(index)} aria-label={`Eliminar hábito ${name}`} title="Eliminar hábito">🗑</button></div>)}</div></article>
              <article className="activityBox pendingBox"><header><div><b>Pendientes prioritarios</b><small>Enfócate en lo importante</small></div><div className="boxActions"><strong>{doneTasks.length}/{taskItems.length}</strong><button onClick={() => openItemModal('task')}>＋ Agregar tarea</button></div></header><div className="pendingList">{taskItems.map(([name, description, difficulty, xp], index) => <button className={doneTasks.includes(index) ? 'done' : ''} onClick={() => toggleTask(index)} key={`${name}-${index}`}><i>{doneTasks.includes(index) ? '✓' : ''}</i><span><b>{name}</b><small>{description}</small></span><span className="taskMeta"><em className={`priority ${difficulty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>{difficulty}</em><small>{xp}</small></span></button>)}</div></article>
              <article className="activityBox statsBox"><header><div><b>▥ Estadísticas de hoy</b><small>Tu progreso en números</small></div></header><div className="todayStats"><div><span>✓ Hábitos</span><b>{doneActivities.length} / {activityItems.length}</b><i><em style={{width:`${completion}%`}} /></i><small>{completion}%</small></div><div><span>▣ Pendientes</span><b>{doneTasks.length} / {taskItems.length}</b><i><em style={{width:`${taskCompletion}%`}} /></i><small>{taskCompletion}%</small></div><div><span>✦ XP ganado</span><b>+{todayXp}</b><i><em style={{width:`${Math.min(todayXp / 3, 100)}%`}} /></i><small>{todayXp} XP</small></div><div><span>★ Día completado</span><b>{dayCompletion}%</b><i><em style={{width:`${dayCompletion}%`}} /></i><small>{dayCompletion}%</small></div></div></article>
              <article className="activityBox weeklyBox"><header><div><b>Progreso semanal</b><small>{calendar.label} · hoy se actualiza al marcar hábitos</small></div><div className="weeklyActions"><strong>{completion}%</strong><button onClick={() => setShowHistory(true)}>Ver resumen</button></div></header><div className="weekChart">{liveWeekProgress.map((value, index) => <div className={`${index === calendar.todayIndex ? 'todayBar' : ''} ${index > calendar.todayIndex ? 'futureBar' : ''}`} key={index}><span><i style={{ height: `${value}%` }} /></span><b>{calendar.days[index].day}<small>{calendar.days[index].date}</small></b></div>)}</div></article>
              <article className="activityBox generalBox"><header><div><b>▰ Pendientes generales</b><small>Ideas, compras y recordatorios sin fecha · sin XP ni monedas</small></div><button onClick={() => openItemModal('reminder')}>＋ Agregar</button></header><div className="reminderList">{reminderItems.map(([name, description, category], index) => <button className={doneReminders.includes(index) ? 'done' : ''} onClick={() => toggleReminder(index)} key={`${name}-${index}`}><i>{doneReminders.includes(index) ? '✓' : ''}</i><span><b>{name}</b><small>{description}</small></span><em className={`reminderTag ${category.toLowerCase()}`}>{category}</em><strong>⋮</strong></button>)}</div></article>
            </div>
          </section>
        ) : active === 'Perfil' ? (
          <section className="profileView" aria-label="Perfil y requisitos del siguiente nivel">
            <div className="profileHeading"><div><span>♕ MI NIVEL</span><h1>Nivel actual</h1><p>{LEVEL_NAMES[level - 1]} · {progression.generalXp.toLocaleString('es-MX')} XP total</p></div><div className={`profileMedal ${levelTier}`}><small>NIVEL</small><b>{level}</b></div></div>
            <article className="levelUnlockCard">
              <div className="unlockGlow" aria-hidden="true">◇</div>
              <div className="profileCharacter"><img src={`/levels/level-${String(level).padStart(2, '0')}.webp`} alt={`Personaje correspondiente al nivel ${level}`} /><span><small>NIVEL ACTUAL</small><b>NIVEL {level}</b><em>{progression.generalXp.toLocaleString('es-MX')} XP TOTAL</em></span></div>
              <header><span>⌃ {level === GAME_CONFIG.maxLevel ? 'NIVEL MÁXIMO' : 'SIGUIENTE NIVEL'}</span><h2>{level === GAME_CONFIG.maxLevel ? 'NIVEL 40 · COMPLETADO' : <>NIVEL {level} <em>→</em> NIVEL {nextLevel}</>}</h2></header>
              <div className="requirementList">{profileRequirements.map((item) => <div className={`requirement ${item.tone}`} key={item.label}><i>{item.icon}</i><span><b>{item.label}</b><small>{item.current} / {item.target}</small><strong><em style={{ width: `${item.progress}%` }} /></strong></span>{item.progress >= 100 ? <mark>✓ COMPLETADO</mark> : <mark>{item.progress}%</mark>}</div>)}</div>
            </article>
            <div className="profileBottom">
              <article className="missingCard"><span>{missingRequirements.length ? 'TE FALTA:' : '✓ COMPLETADO'}</span>{missingRequirements.length ? missingRequirements.map((item) => <p key={item.label}><i>{item.icon}</i><b>{item.missing}</b></p>) : <p><i>✓</i><b>Todos los requisitos están completos</b></p>}</article>
              <article className={`rewardCard ${unlockedLevel ? 'unlocking' : ''}`}><span>{unlockedLevel ? `NIVEL ${unlockedLevel} DESBLOQUEADO` : 'AL COMPLETAR TODOS LOS REQUISITOS'}</span><b>♕</b><h3>{level === GAME_CONFIG.maxLevel ? 'NIVEL MÁXIMO' : 'NIVEL DESBLOQUEADO'}</h3><p>Tu progreso queda guardado para siempre.</p><small>▣ Nivel guardado permanentemente</small></article>
            </div>
            <div className="levelInsights">
              <article><header><b>✦ XP GANADO RECIENTEMENTE</b></header>{recentXp.length ? recentXp.map((entry) => <p key={`${entry.id}-${entry.date}`}><span><b>{entry.reason}</b><small>{entry.date}{entry.skill ? ` · ${entry.skill}` : ''}</small></span><strong className={entry.amount < 0 ? 'negative' : ''}>{entry.amount > 0 ? '+' : ''}{entry.amount} XP</strong></p>) : <p className="emptyInsight">Aún no hay movimientos de XP.</p>}</article>
              <article><header><b>◇ PRÓXIMOS HITOS</b></header>{level < GAME_CONFIG.maxLevel && <p><span><b>Nivel {nextLevel}</b><small>{nextRequirement.xp.toLocaleString('es-MX')} XP total</small></span><strong>{Math.min(100, percentage(progression.generalXp, nextRequirement.xp))}%</strong></p>}{nextFinancialMilestone && <p><span><b>{formatMoney(nextFinancialMilestone.target)} de patrimonio</b><small>Recompensa única</small></span><strong>+{nextFinancialMilestone.reward.toLocaleString('es-MX')} XP</strong></p>}{nextStreakMilestone && <p><span><b>Racha de {nextStreakMilestone.target} días</b><small>Mínimo 60–70% de hábitos</small></span><strong>+{nextStreakMilestone.reward.toLocaleString('es-MX')} XP</strong></p>}</article>
              <article className="bossInsight"><header><b>♛ BOSS LEVEL PRÓXIMO</b></header>{nextBossLevel ? <><strong>NIVEL {nextBossLevel.level}</strong><p><span><b>{nextBossLevel.label}</b><small>{knowledgeTopics} / {nextBossLevel.completedKnowledgeTopics} temas completados</small></span><mark>{percentage(knowledgeTopics, nextBossLevel.completedKnowledgeTopics)}%</mark></p></> : <p className="emptyInsight">Todos los Boss Levels fueron superados.</p>}</article>
            </div>
            <section className="moneyPanel" aria-label="Resumen de dinero y patrimonio">
              <header><div><span>▱</span><h2>MI DINERO</h2><p>Resumen simple de tu dinero y patrimonio.</p></div><b>♨</b></header>
              <div className="moneyTotals"><article><span>▣ PATRIMONIO NETO</span><b>{formatMoney(totalWorth)}</b><small>MXN</small><em>Activos menos deudas</em></article><article><span>▤ DISPONIBLE</span><b>{formatMoney(cash)}</b><small>MXN</small><em>Dinero actual</em></article><article><span>◇ ACTIVOS NETOS</span><b>{formatMoney(assetsTotal - debtTotal)}</b><small>MXN</small><em>Ahorros, inversiones y activos</em></article></div>
              <div className="moneyActions"><button onClick={() => openMoneyModal('income')}><i>＋</i><span><b>INGRESO DEL MES</b><small>Registra tu ingreso</small></span></button><button onClick={() => openMoneyModal('expense')}><i>−</i><span><b>GASTO DEL MES</b><small>Registra tus gastos</small></span></button><button onClick={() => openMoneyModal('balance')}><i>↗</i><span><b>AJUSTAR DINERO ACTUAL</b><small>Actualiza tu saldo</small></span></button></div>
              <div className="moneyGrid"><article className="monthSummary"><header><b>▥ RESUMEN DEL MES</b><button onClick={() => openMoneyModal('transactions')}>Ver todo</button></header><p><span>Ingreso del mes</span><strong>{formatMoney(monthlyIncome)} ↑</strong></p><p><span>Gasto del mes</span><strong>−{formatMoney(monthlyExpense)} ↓</strong></p><p><span>Balance mensual</span><strong>{formatMoney(monthlyIncome - monthlyExpense)}</strong></p><p className="cashRow"><span>Dinero actual</span><strong>{formatMoney(cash)}</strong></p></article><article className="assetsSummary"><header><b>◇ PATRIMONIO <small>(tus activos suman a tu riqueza)</small></b><button onClick={() => openMoneyModal('assets')}>Ver todo</button></header>{moneyAssets.length ? moneyAssets.slice(0, 3).map((asset) => <p key={asset.id}><i>◇</i><span><b>{asset.name}</b><small>{asset.detail}</small></span><strong>{formatMoney(asset.value)} <small>MXN</small></strong></p>) : <p className="emptyMoney">Aún no has registrado patrimonio.</p>}<button className="addAsset" onClick={() => openMoneyModal('asset')}>＋ Agregar patrimonio</button></article></div>
              <article className="moneyChart"><header><b>▥ DINERO GANADO {now.getFullYear()}</b><strong>▲ +{formatMoney(annualIncome)} este año</strong></header><div className="chartBars">{monthlyChart.map((value, index) => <i style={{height:`${value ? Math.max(4, value / chartMax * 100) : 0}%`}} key={index}><b>{formatMoney(value)}</b>{value > 0 && <span />}</i>)}</div><div className="chartMonths">{['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map((month) => <span key={month}>{month}</span>)}</div></article>
            </section>
          </section>
        ) : (
          <>
            <section className="hero coverHero" style={{ backgroundImage: `url(${cover})` }} aria-label={completed ? 'Pantalla final del recorrido' : `Portada del nivel ${coverLevel}: ${LEVEL_NAMES[coverLevel - 1]}`}>
              <div className="coverShade" />
              <button className="coverArrow left" onClick={() => completed ? setCompleted(false) : setCoverLevel(Math.max(1, coverLevel - 1))} disabled={coverLevel === 1 && !completed} aria-label={completed ? 'Volver al nivel 40' : 'Nivel anterior'}>‹</button>
              <div className="coverInfo"><span>{completed ? 'RECORRIDO COMPLETADO' : `NIVEL ${coverLevel} DE 40`}</span><b>{completed ? 'Felicidades, has ganado en la vida' : LEVEL_NAMES[coverLevel - 1]}</b></div>
            </section>

            <section className="skills" aria-label="Habilidades">
              {skills.map(([name, value, width, icon], index) => <article className="skill" key={name}><div><span className="dot"><img src={icon} alt="" /> </span>{name}<small>Nivel 2{index + 3}</small></div><div className="bar"><i style={{ width }} /></div><p>{value}</p></article>)}
            </section>

            <section className="lower">
              <div className="today"><div className="sectionTitle"><b>HOY</b><span>Jueves, 27 de agosto</span></div><div className="habitGrid">{habits.map(([name, value, icon]) => <article className="habit" key={name}><img className="habitIcon" src={icon} alt="" /><div><small>{name}</small><b>{value}</b></div></article>)}</div></div>
              <button className="ideaPanel" onClick={() => setActive('Ideas')} aria-label="Abrir panel de ideas"><img src="/icons/ideas.webp" alt="" /><span><small>CREAR</small><b>＋ IDEA</b><em>{ideaItems.length} ideas guardadas</em></span></button>
            </section>
          </>
        )}

        {moneyModal && <div className="modalBackdrop" role="presentation" onMouseDown={() => setMoneyModal(null)}><section className="itemModal moneyModal" role="dialog" aria-modal="true" aria-label="Registro de dinero" onMouseDown={(event) => event.stopPropagation()}><header><div><span>MI DINERO</span><h2>{moneyModal === 'income' ? 'Registrar ingreso' : moneyModal === 'expense' ? 'Registrar gasto' : moneyModal === 'balance' ? 'Ajustar dinero actual' : moneyModal === 'asset' ? 'Agregar patrimonio' : moneyModal === 'transactions' ? 'Todos los movimientos' : 'Todo mi patrimonio'}</h2></div><button onClick={() => setMoneyModal(null)} aria-label="Cerrar">×</button></header>{moneyModal === 'transactions' ? <div className="moneyDetailList">{moneyTransactions.length ? moneyTransactions.map((item) => <article key={item.id}><span><b>{item.concept}</b><small>{new Date(item.date).toLocaleDateString('es-MX')}</small></span><strong className={item.type}>{item.type === 'expense' ? '−' : '+'}{formatMoney(item.amount)}</strong></article>) : <p>No hay movimientos todavía.</p>}</div> : moneyModal === 'assets' ? <div className="moneyDetailList">{moneyAssets.length ? moneyAssets.map((asset) => <article key={asset.id}><span><b>{asset.name}</b><small>{asset.detail}</small></span><strong>{asset.kind === 'debt' ? '−' : ''}{formatMoney(asset.value)}</strong></article>) : <p>No hay patrimonio registrado todavía.</p>}</div> : <><label>{moneyModal === 'asset' ? 'Nombre del patrimonio' : moneyModal === 'balance' ? 'Nota (opcional)' : 'Concepto'}<input autoFocus value={moneyConcept} onChange={(event) => setMoneyConcept(event.target.value)} placeholder={moneyModal === 'asset' ? 'Ej. Ahorros' : 'Ej. Venta del mes'} /></label><label>Cantidad MXN<input type="number" min="0" step="100" value={moneyAmount} onChange={(event) => setMoneyAmount(event.target.value)} placeholder="$0" /></label>{moneyModal === 'asset' && <fieldset><legend>Tipo</legend><div className="categoryOptions">{([['savings','Ahorro'],['investment','Inversión'],['asset','Activo'],['debt','Deuda']] as const).map(([kind, label]) => <button className={moneyAssetKind === kind ? 'selected' : ''} onClick={() => setMoneyAssetKind(kind)} key={kind}>{label}</button>)}</div></fieldset>}<button className="saveItem" onClick={saveMoney}>Guardar registro</button></>}</section></div>}
        {modalType && <div className="modalBackdrop" role="presentation" onMouseDown={() => setModalType(null)}><section className="itemModal" role="dialog" aria-modal="true" aria-label={modalType === 'habit' ? 'Agregar hábito' : 'Agregar pendiente'} onMouseDown={(event) => event.stopPropagation()}><header><div><span>{modalType === 'habit' ? 'NUEVO HÁBITO' : modalType === 'task' ? 'NUEVA TAREA' : 'NUEVO RECORDATORIO'}</span><h2>{modalType === 'habit' ? 'Agregar hábito' : modalType === 'task' ? 'Agregar pendiente' : 'Pendiente general'}</h2></div><button onClick={() => setModalType(null)} aria-label="Cerrar">×</button></header><label>{modalType === 'habit' ? 'Hábito' : 'Tarea'}<input autoFocus value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder={modalType === 'habit' ? 'Ej. Ir al gimnasio' : 'Ej. Llamar a proveedor'} /></label><label>Descripción {modalType === 'habit' && <small>Máximo 3 palabras</small>}<input value={itemDescription} onChange={(event) => setItemDescription(modalType === 'habit' ? event.target.value.split(/\s+/).slice(0, 3).join(' ') : event.target.value)} placeholder="Detalle breve" /></label>{modalType === 'reminder' ? <fieldset><legend>Categoría</legend><div className="categoryOptions">{reminderCategories.map((category) => <button className={itemCategory === category ? 'selected' : ''} onClick={() => setItemCategory(category)} key={category}>{category}</button>)}</div><p className="noReward">Este recordatorio no otorga XP ni monedas.</p></fieldset> : <fieldset><legend>Valor XP</legend><div className="xpOptions">{(modalType === 'habit' ? habitXp : taskXp).map(([xp, label]) => <button className={itemXp === xp ? 'selected' : ''} onClick={() => setItemXp(xp)} key={xp}><b>{xp} XP</b><span>{label}</span></button>)}</div></fieldset>}<button className="saveItem" onClick={saveItem}>Guardar {modalType === 'habit' ? 'hábito' : modalType === 'task' ? 'tarea' : 'recordatorio'}</button></section></div>}
        {habitToDelete !== null && <div className="modalBackdrop" role="presentation" onMouseDown={() => setHabitToDelete(null)}><section className="deleteModal" role="alertdialog" aria-modal="true" aria-labelledby="delete-habit-title" onMouseDown={(event) => event.stopPropagation()}><span>ELIMINAR HÁBITO</span><h2 id="delete-habit-title">¿Quieres borrar “{activityItems[habitToDelete]?.[0]}”?</h2><p>El hábito dejará de aparecer en tu lista diaria.</p><div><button onClick={() => setHabitToDelete(null)}>Cancelar</button><button className="confirmDelete" onClick={deleteHabit}>Confirmar</button></div></section></div>}
        {showHistory && <div className="modalBackdrop" role="presentation" onMouseDown={() => setShowHistory(false)}><section className="historyModal" role="dialog" aria-modal="true" aria-label="Historial mensual de hábitos" onMouseDown={(event) => event.stopPropagation()}><header><div><span>HISTORIAL DE HÁBITOS</span><h2>{monthLabel}</h2></div><button onClick={() => setShowHistory(false)} aria-label="Cerrar">×</button></header><div className="monthControls"><button onClick={() => setHistoryMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}>‹ Mes anterior</button><p>El historial comienza el {new Date(`${historyStart}T12:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p><button disabled={isCurrentMonth} onClick={() => setHistoryMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>Mes siguiente ›</button></div><div className="monthWeekdays">{['L','M','X','J','V','S','D'].map((day) => <b key={day}>{day}</b>)}</div><div className="monthGrid">{monthCalendar.map((cell, index) => cell ? <article className={`${cell.key === dayKey() ? 'today' : ''} ${cell.key < historyStart || cell.key > dayKey() ? 'emptyDay' : ''}`} key={cell.key}><span>{cell.day}</span>{activityHistory[cell.key] === undefined ? <small>—</small> : <><div><i style={{ height: `${activityHistory[cell.key]}%` }} /></div><b>{activityHistory[cell.key]}%</b></>}</article> : <i key={`empty-${index}`} />)}</div><footer><span><i /> Sin actividad</span><span><i /> Progreso registrado</span></footer></section></div>}

        <nav className="nav" aria-label="Navegación principal">
          {['Ideas', 'Estudio'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Ideas' ? '✦' : '▤'}</span>{item}</button>)}
          <button className={`homeButton ${active === 'HOME' ? 'active' : ''}`} onClick={() => setActive('HOME')} aria-label="Ir a la página principal"><span>⌂</span>HOME</button>
          {['Actividades', 'Perfil'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Actividades' ? '▦' : '♙'}</span>{item}</button>)}
        </nav>
      </section>
    </main>
  );
}
