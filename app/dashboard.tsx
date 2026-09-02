'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { fullStudyBranches, type StudyBranch } from './study-data';
import { GAME_CONFIG, INITIAL_PROGRESSION, averageStability, grantCoins, grantXp, habitStreak, percentage, revokeXp, type ProgressionState } from './config/gameConfig';
import { LEVEL_NAMES, incomeAverageMonthsForLevel, requirementForLevel } from './config/levelConfig';
import { XP_CONFIG, normalizedHabitXp, normalizedTaskXp, xpFromLabel, type XpReward } from './config/xpConfig';
import { knowledgeLevelGeneralXp, skillLevel, skillLevelXp, skillXpForTheme } from './config/skillConfig';
import { REWARD_CONFIG } from './config/rewardConfig';
import { COIN_CONFIG, coinRewardForScore } from './config/coinConfig';
import { STABILITY_CONFIG, financialStability, stabilityClassification, stabilityWindowDaysForLevel } from './config/stabilityConfig';
import StoreView from './store';
import IdeasView from './ideas';

const assetPath = (path: string) => {
  const prefix = typeof window !== 'undefined' && window.location.pathname.startsWith('/mi-app-daniel') ? '/mi-app-daniel' : '';
  return path.startsWith(prefix) ? path : `${prefix}${path}`;
};

type MoneyTransaction = { id: number; type: 'income' | 'expense'; concept: string; amount: number; date: string };
type MoneyAsset = { id: number; name: string; detail: string; value: number; kind: 'savings' | 'investment' | 'asset' | 'debt' };
type MoneyModal = 'income' | 'expense' | 'balance' | 'asset' | 'transactions' | 'assets' | null;
const UI_STORAGE = 'daniel-os-ui-v1';
const MONEY_VERSION = 'daniel-os-money-version';
const formatMoney = (value: number) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const formatSignedMoney = (value: number) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${formatMoney(Math.abs(value))}`;
const LEVEL_QUOTES = ['Cada paso cuenta. Sigue construyendo la vida que quieres.', 'La disciplina de hoy se convierte en la libertad de mañana.', 'No llegaste hasta aquí para detenerte ahora.', 'Tu constancia ya está dando resultados.', 'Lo difícil de ayer es la fuerza que tienes hoy.'];
const dailyActivities = [
  ['Tomar Licuado/Almorzar', 'Comer bien', '/icons/morning-salad.png', '+5 XP'],
  ['Entrenamiento', '45 minutos', '/icons/exercise.webp', '+40 XP'],
  ['Estudiar', '1 hora', '/icons/study.webp', '+10 XP'],
  ['Trabajo profundo', '1 hora', '/icons/work.webp', '+10 XP'],
  ['No fab', 'Septiembre sin fab', '/icons/no-fab.png', '+5 XP'],
  ['Prospección de clientes', 'Salones, orgánico, etc.', '/icons/client-prospecting.png', '+5 XP'],
  ['Revisar finanzas', '15 minutos', '/icons/finance.webp', '+5 XP'],
  ['Planear mañana', '10 minutos', '/icons/discipline.webp', '+5 XP'],
];
const iconForHabit = (name: string) => /no fab/i.test(name) ? '/icons/no-fab.png' : /licuado/i.test(name) ? '/icons/morning-salad.png' : /entren|ejerc|gimnas/i.test(name) ? '/icons/exercise.webp' : /estudi|leer/i.test(name) ? '/icons/study.webp' : /finanz/i.test(name) ? '/icons/finance.webp' : /plane|disciplina/i.test(name) ? '/icons/discipline.webp' : /trabajo|bloque/i.test(name) ? '/icons/work.webp' : /prospect|venta/i.test(name) ? '/icons/client-prospecting.png' : '/icons/habits.webp';
const isHealthHabit = (name: string) => /licuado|entren|ejerc|gimnas/i.test(name);
const isBusinessHabit = (name: string) => /trabajo|bloque|prospect|venta|negocio|cliente/i.test(name);

const pendingActivities: string[][] = [];

const weekProgress = [65, 80, 55, 90, 72, 45, 30];
const habitXp = XP_CONFIG.habits;
const taskXp = XP_CONFIG.tasks;
const reminderCategories = ['Compras', 'Hogar', 'Trabajo', 'Negocio', 'Personal', 'Estudio'];
const initialReminders: string[][] = [];

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

function StudyView({ skillXp, onTaskToggled, onKnowledgeSummary }: { skillXp: Record<string, number>; onTaskToggled: (branch: string, taskId: string, reason: string, done: boolean, skillAmount: number, completedLevel?: number, generalAmount?: number) => void; onKnowledgeSummary: (completed: number) => void }) {
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
      if (storedBranches) {
        const storedByName = new Map<string, StudyBranch>(storedBranches.map((branch: StudyBranch) => [branch.name, branch]));
        setBranches(fullStudyBranches.map((base) => {
          const stored = storedByName.get(base.name);
          const topics = base.topics.map((baseTopic, index) => {
            const old = stored?.topics.find((topic) => topic.name === baseTopic.name);
            const modules = baseTopic.modules.map((baseModule) => {
              const oldModule = old?.modules.find((module) => module.name === baseModule.name);
              return { ...baseModule, tasks: baseModule.tasks.map((baseTask) => {
                const oldTask = oldModule?.tasks.find((task) => task.name === baseTask.name);
                return oldTask ? { ...baseTask, ...oldTask, xpAwarded: oldTask.xpAwarded ?? oldTask.done } : baseTask;
              }) };
            });
            const progress = modules.flatMap((module) => module.tasks).length
              ? Math.round(modules.flatMap((module) => module.tasks).filter((task) => task.done).length / modules.flatMap((module) => module.tasks).length * 100)
              : old?.progress ?? baseTopic.progress;
            return { ...baseTopic, ...old, modules, progress, locked: index > 0 && (stored?.topics[index - 1]?.progress ?? base.topics[index - 1].progress) < 100 };
          });
          const books = (base.books || []).map((book) => {
            const old = stored?.books?.find((item) => item.id === book.id);
            return old ? { ...book, done: old.done, xpAwarded: old.xpAwarded ?? old.done } : book;
          });
          return { ...base, ...stored, topics, books };
        }));
      }
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
  const toggleBook = (bookId: string) => {
    if (branchIndex === null) return;
    const branch = branches[branchIndex];
    const book = branch.books?.find((item) => item.id === bookId);
    if (!book) return;
    const nextDone = !book.done;
    if (nextDone && !book.xpAwarded) onTaskToggled(branch.name, `book:${branch.name}:${book.id}`, `Libro terminado: ${book.title}`, true, 0, undefined, book.xp);
    setBranches((current) => current.map((item, index) => index !== branchIndex ? item : ({ ...item, books: item.books?.map((entry) => entry.id === bookId ? { ...entry, done: nextDone, xpAwarded: entry.xpAwarded || nextDone } : entry) })));
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
      {selectedTopic ? <div className="topicCourse"><header><span>{selectedBranch.icon} {selectedBranch.name}</span><h2>{selectedTopic.name}</h2><div><i style={{ width: `${selectedTopic.progress}%` }} /></div><b>{selectedTopic.progress}% completado</b></header><div className="moduleList">{selectedTopic.modules.length ? selectedTopic.modules.map((module, moduleIndex) => { const done = module.tasks.length > 0 && module.tasks.every((task) => task.done); return <article key={module.name}><header><span>MÓDULO {moduleIndex + 1}</span><b>{module.name}</b><em>{done ? '✓ Completado' : module.tasks.some((task) => task.done) ? 'En progreso' : 'Pendiente'}</em></header>{module.tasks.map((task, taskIndex) => <div className={`studyTask ${task.done ? 'done' : ''}`} key={task.name}><button onClick={() => toggleStudyTask(moduleIndex, taskIndex)}><i>{task.done ? '✓' : ''}</i><span>{task.name}</span></button>{task.detail && <p>{task.detail}</p>}</div>)}</article>; }) : <div className="emptyCourse"><b>Curso listo para crecer</b><p>Guarda videos, lecturas o prácticas para construir este tema.</p><button onClick={() => setShowSave(true)}>＋ Agregar material</button></div>}</div></div> : <>
        <div className={`branchTitle ${selectedBranch.tone}`}><i>{selectedBranch.icon}</i><span><small>RAMA DE CONOCIMIENTO</small><h2>{selectedBranch.name}</h2><b>Nivel {selectedBranch.level}</b></span></div>
        <div className="topicList">{selectedBranch.topics.map((topic, index) => <button disabled={topic.locked} onClick={() => setTopicIndex(index)} key={topic.name}><i>{topic.locked ? '🔒' : topic.progress === 100 ? '✓' : topic.progress > 0 ? '●' : '○'}</i><span><b>{topic.name}</b><small>{topic.locked ? 'Completa los temas anteriores' : topic.progress === 100 ? 'Completado' : topic.progress > 0 ? 'En curso' : 'Sin empezar'}</small></span>{!topic.locked && <><div><em style={{ width: `${topic.progress}%` }} /></div><strong>{topic.progress}%</strong></>}</button>)}</div>
        {!!selectedBranch.books?.length && <details className="bookResources"><summary>📚 Recursos adicionales <small>Opcional · no afecta el nivel</small></summary><div>{selectedBranch.books.map((book) => <button className={book.done ? 'done' : ''} onClick={() => toggleBook(book.id)} key={book.id}><i>{book.done ? '✓' : ''}</i><span><b>{book.title}</b><small>{book.author}</small></span><em>{book.difficulty}</em><strong>+{book.xp} XP</strong></button>)}</div></details>}
      </>}
    </div> : <><div className="studyOverview"><article><div className="progressRing" style={{ '--progress': `${overall * 3.6}deg` } as CSSProperties}><b>{overall}%</b><span>completado</span></div><ul><li><i />Completados <b>{completedTopics}</b></li><li><i />En curso <b>{totalTopics - completedTopics}</b></li><li><i />Por aprender <b>{saved.length}</b></li></ul><p>“Un poco mejor cada día, grandes resultados con el tiempo.”</p></article><div className="knowledgeTree" style={{ backgroundImage: `linear-gradient(#08051a22,#08051aaa),url(${assetPath('/study-tree.png')})` }}>{visibleBranches.map(({ branch, index }) => { const progress = branch.topics[Math.min(branch.level - 1, branch.topics.length - 1)]?.progress || 0; return <button className={`treeNode node${index + 1} ${branch.tone}`} onClick={() => openBranch(index)} key={branch.name}><i>{branch.icon}</i><span><b>{branch.name}</b><small>Nivel {branch.level} · {progress}%</small><em><strong style={{ width: `${progress}%` }} /></em></span></button>; })}</div></div>{saved.length > 0 && <section className="studyInbox"><header><div><span>📥</span><h2>Pendiente por aprender</h2></div><b>{saved.length} guardados</b></header><div>{saved.map((item, index) => <article key={`${item.title}-${index}`}><i>{item.type.split(' ')[0]}</i><span><b>{item.title}</b><small>{item.branch} → {item.topic}</small></span><em>{item.type.replace(/^\S+\s/, '')}</em></article>)}</div></section>}</>}
    {showSave && <div className="studyModalBackdrop" onMouseDown={() => setShowSave(false)}><section className="studyModal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><header><div><span>GUARDAR PARA ESTUDIAR</span><h2>Nuevo material</h2></div><button onClick={() => setShowSave(false)}>×</button></header><label>Título<input autoFocus value={material.title} onChange={(event) => setMaterial({ ...material, title: event.target.value })} placeholder="Ej. Cómo manejar objeciones" /></label><label>Rama<select value={material.branch} onChange={(event) => { const branch = branches.find((item) => item.name === event.target.value)!; setMaterial({ ...material, branch: branch.name, topic: branch.topics.find((topic) => !topic.locked)?.name || '' }); }}>{branches.map((branch) => <option key={branch.name}>{branch.name}</option>)}</select></label><label>Tema<select value={material.topic} onChange={(event) => setMaterial({ ...material, topic: event.target.value })}>{branchTopics.map((topic) => <option key={topic.name}>{topic.name}</option>)}</select></label><fieldset><legend>Tipo</legend><div>{['🎥 Video','📄 Artículo','📚 Libro','🧪 Práctica','📝 Nota'].map((type) => <button className={material.type === type ? 'selected' : ''} onClick={() => setMaterial({ ...material, type })} key={type}>{type}</button>)}</div></fieldset><button className="saveStudy" onClick={saveMaterial}>Guardar material</button></section></div>}
  </section>;
}

const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dateFromKey = (key: string) => new Date(`${key}T12:00:00`);
const weekKey = (date: Date) => { const monday = new Date(date); monday.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return dayKey(monday); };
const reminderKey = (item: string[]) => item.join('|');
const taskKey = (item: string[]) => item.join('|');
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
  const [ideaCount, setIdeaCount] = useState(0);
  const [doneActivities, setDoneActivities] = useState<number[]>([]);
  const [doneTasks, setDoneTasks] = useState<number[]>([]);
  const [activityItems, setActivityItems] = useState(dailyActivities);
  const [taskItems, setTaskItems] = useState(pendingActivities);
  const [taskExpiry, setTaskExpiry] = useState<Record<string, number>>({});
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
  const [uiReady, setUiReady] = useState(false);
  const [moneyReady, setMoneyReady] = useState(false);
  const [cash, setCash] = useState(0);
  const [moneyTransactions, setMoneyTransactions] = useState<MoneyTransaction[]>([]);
  const [moneyAssets, setMoneyAssets] = useState<MoneyAsset[]>([]);
  const [moneyModal, setMoneyModal] = useState<MoneyModal>(null);
  const [moneyConcept, setMoneyConcept] = useState('');
  const [moneyAmount, setMoneyAmount] = useState('');
  const [moneyMonth, setMoneyMonth] = useState('');
  const [moneyAdjustmentType, setMoneyAdjustmentType] = useState<'income' | 'expense'>('income');
  const [moneyAssetKind, setMoneyAssetKind] = useState<MoneyAsset['kind']>('asset');
  const [unlockedLevel, setUnlockedLevel] = useState<number | null>(null);
  const dailyResetInProgress = useRef(false);
  const celebratedLevelRef = useRef<number | null>(null);
  const [calendar, setCalendar] = useState({ label: 'Esta semana', date: '', todayIndex: 0, days: ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => ({ day, date: '' })) });
  const level = progression.highestLevelUnlocked;
  const levelCover = `/levels/level-${String(coverLevel).padStart(2, '0')}.webp`;
  const cover = completed ? '/levels/victory.webp' : levelCover;
  const levelTier = level >= 30 ? 'gold' : level >= 15 ? 'silver' : 'bronze';
  const levelTierLabel = level >= 30 ? 'oro' : level >= 15 ? 'plata' : 'bronce';
  const completion = activityItems.length ? Math.round(doneActivities.length / activityItems.length * 100) : 0;
  const taskCompletion = taskItems.length ? Math.round(doneTasks.length / taskItems.length * 100) : 0;
  const todayXp = progression.xpHistory.filter((entry) => entry.date === dayKey()).reduce((total, entry) => total + entry.amount, 0);
  const disciplineXp = progression.xpHistory.filter((entry) => entry.type === 'habit' || entry.type === 'deep_work').reduce((total, entry) => total + entry.amount, 0);
  const knowledgeXp = Object.values(progression.skillXp).reduce((total, xp) => total + xp, 0);
  const businessMonth = new Date();
  const businessMonthKey = `${businessMonth.getFullYear()}-${String(businessMonth.getMonth() + 1).padStart(2, '0')}`;
  const businessIncomeXp = Math.floor(moneyTransactions.filter((item) => item.type === 'income' && item.date.startsWith(businessMonthKey)).reduce((total, item) => total + item.amount, 0) / 1_000);
  const lifetimeExerciseDays = new Set(progression.xpHistory.filter((entry) => /entren|ejerc|gimnas/i.test(entry.reason)).map((entry) => entry.date)).size;
  const homeSkills = [
    ['Ejercicio', lifetimeExerciseDays, '/icons/exercise.webp'],
    ['Conocimiento', knowledgeXp, '/icons/knowledge.webp'],
    ['Salud', progression.skillXp.Salud || 0, '/icons/health.webp'],
    ['Disciplina', disciplineXp, '/icons/discipline.webp'],
    ['Negocios', (progression.skillXp.Negocios || 0) + businessIncomeXp, '/icons/business.webp'],
  ].map(([name, rawXp, icon]) => {
    const xp = Number(rawXp);
    const skill = xp > 0 ? skillLevel(xp) : 0;
    const base = skill ? skillLevelXp(skill) : 0;
    const target = skill >= 20 ? base : skillLevelXp(skill ? skill + 1 : 2);
    return { name: String(name), icon: String(icon), level: skill, value: `${xp.toLocaleString('es-MX')} / ${target.toLocaleString('es-MX')}`, progress: skill >= 20 ? 100 : percentage(xp - base, target - base) };
  });
  const todaySummary = [
    ['Hábitos', `${doneActivities.length}/${activityItems.length}`, '/icons/habits.webp'],
    ['Pendientes', `${doneTasks.length}/${taskItems.length}`, '/icons/pending.webp'],
    ['Estudio', `${progression.learningByDay[dayKey()] || 0} temas`, '/icons/study.webp'],
    ['Trabajo', `${doneActivities.filter((index) => /trabajo/i.test(activityItems[index]?.[0] || '')).length} sesiones`, '/icons/work.webp'],
  ];
  const dayCompletion = Math.round((completion + taskCompletion) / 2);
  const liveWeekProgress = weekProgress.map((value, index) => index > calendar.todayIndex ? 0 : index === calendar.todayIndex ? completion : value);
  const monthCalendar = buildMonth(historyMonth);
  const monthLabel = historyMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  const isCurrentMonth = historyMonth.getFullYear() === new Date().getFullYear() && historyMonth.getMonth() === new Date().getMonth();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const moneyMonthMin = `${now.getFullYear()}-01`;
  const monthlyTransactions = moneyTransactions.filter((item) => item.date.startsWith(currentMonth));
  const monthlyIncome = monthlyTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const monthlyExpense = monthlyTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const assetsTotal = moneyAssets.filter((item) => item.kind !== 'debt').reduce((sum, item) => sum + item.value, 0);
  const debtTotal = moneyAssets.filter((item) => item.kind === 'debt').reduce((sum, item) => sum + item.value, 0);
  const totalWorth = cash + assetsTotal - debtTotal;
  const netMonthlyIncome = monthlyIncome - monthlyExpense;
  const recordedMonths = [...new Set(moneyTransactions.map((item) => item.date.slice(0, 7)).filter((key) => key <= currentMonth))].sort().reverse();
  const averageNetIncome = (months: number) => recordedMonths.slice(0, months).reduce((sum, key) => sum + moneyTransactions.filter((item) => item.date.startsWith(key)).reduce((monthTotal, item) => monthTotal + (item.type === 'income' ? item.amount : -item.amount), 0), 0) / Math.max(1, Math.min(months, recordedMonths.length));
  const chartYear = now.getFullYear();
  const previousChartYear = chartYear - 1;
  const chartMonthIndex = now.getMonth();
  const comparisonCutoff = new Date(chartYear, chartMonthIndex).toLocaleDateString('es-MX', { month: 'long' });
  const monthlyChart = Array.from({ length: 12 }, (_, month) => moneyTransactions.filter((item) => item.type === 'income' && item.date.startsWith(`${chartYear}-${String(month + 1).padStart(2, '0')}`)).reduce((sum, item) => sum + item.amount, 0));
  const previousYearChart = Array.from({ length: 12 }, (_, month) => moneyTransactions.filter((item) => item.type === 'income' && item.date.startsWith(`${previousChartYear}-${String(month + 1).padStart(2, '0')}`)).reduce((sum, item) => sum + item.amount, 0));
  const comparisonCurrent = monthlyChart.slice(0, chartMonthIndex + 1).reduce((sum, value) => sum + value, 0);
  const comparisonPrevious = previousYearChart.slice(0, chartMonthIndex + 1).reduce((sum, value) => sum + value, 0);
  const comparisonDifference = comparisonCurrent - comparisonPrevious;
  const comparisonPercent = comparisonPrevious ? comparisonDifference / comparisonPrevious * 100 : null;
  const comparisonTone = comparisonDifference > 0 ? 'positive' : comparisonDifference < 0 ? 'negative' : 'neutral';
  const chartMax = Math.max(1, ...monthlyChart, ...previousYearChart);
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
  const stability30 = averageStability({ ...progression.stabilityByDay, [dayKey()]: todayStability }, now, 30);
  const stabilityLabel = stabilityClassification(stability);
  const habits14 = Math.round(Array.from({ length: 14 }, (_, index) => { const date = new Date(now); date.setDate(date.getDate() - index); const entry = index === 0 ? { done: doneActivities.length, total: activityItems.length } : progression.habitDays[dayKey(date)]; return entry?.total ? entry.done / entry.total * 100 : 0; }).reduce((sum, value) => sum + value, 0) / 14);
  const savingsGoalMet = monthlyIncome > 0 && netMonthlyIncome / monthlyIncome >= STABILITY_CONFIG.finances.savingsRateTarget;
  const incomeGoalMet = netMonthlyIncome >= stabilityIncomeTarget;

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
      const saved = JSON.parse(localStorage.getItem(UI_STORAGE) || 'null') as { active?: string; coverLevel?: number; completed?: boolean } | null;
      if (saved?.active) setActive(saved.active);
      if (saved?.coverLevel) setCoverLevel(saved.coverLevel);
      if (saved?.completed) setCompleted(true);
    } catch { /* La interfaz puede iniciar con sus valores predeterminados. */ }
    setUiReady(true);
  }, []);

  useEffect(() => {
    if (uiReady) localStorage.setItem(UI_STORAGE, JSON.stringify({ active, coverLevel, completed }));
  }, [uiReady, active, coverLevel, completed]);

  useEffect(() => {
    try {
      const today = dayKey();
      const savedDay = localStorage.getItem('daniel-os-day-v2');
      const savedHabits = JSON.parse(localStorage.getItem('daniel-os-habits') || 'null') as string[][] | null;
      const savedTasks = JSON.parse(localStorage.getItem('daniel-os-tasks') || 'null') as string[][] | null;
      const savedDoneHabits = JSON.parse(localStorage.getItem('daniel-os-done-habits-v2') || '[]') as number[];
      const savedDoneTasks = JSON.parse(localStorage.getItem('daniel-os-done-tasks-v2') || '[]') as number[];
      const savedTaskExpiry = JSON.parse(localStorage.getItem('daniel-os-task-expiry') || '{}') as Record<string, number>;
      const savedReminders = JSON.parse(localStorage.getItem('daniel-os-reminders') || 'null') as string[][] | null;
      const savedDoneReminders = JSON.parse(localStorage.getItem('daniel-os-done-reminders') || '[]') as number[];
      const savedReminderExpiry = JSON.parse(localStorage.getItem('daniel-os-reminder-expiry') || '{}') as Record<string, number>;
      const savedHistory = JSON.parse(localStorage.getItem('daniel-os-activity-history') || '{}') as Record<string, number>;
      const activityVersion = localStorage.getItem('daniel-os-activities-version');
      if (activityVersion !== '3') {
        const savedHabitList = savedHabits || dailyActivities;
        const habits = savedHabitList.filter(([name]) => !/tomar agua/i.test(name));
        const requiredHabits = dailyActivities.filter((item) => ['Tomar Licuado/Almorzar', 'No fab', 'Prospección de clientes'].includes(item[0]));
        const migratedHabits = habits.map((item) => /trabajo profundo/i.test(item[0]) ? ['Trabajo profundo', '1 hora', '/icons/work.webp', '+10 XP'] : [item[0], item[1], iconForHabit(item[0]), /entrenamiento/i.test(item[0]) ? '+40 XP' : item[3]]);
        setActivityItems([...migratedHabits, ...requiredHabits.filter((item) => !migratedHabits.some(([name]) => name === item[0]))]);
        if (savedDay === today) setDoneActivities(savedDoneHabits.filter((index) => !/tomar agua/i.test(savedHabitList[index]?.[0] || '')).map((index) => savedHabitList.slice(0, index).filter(([name]) => !/tomar agua/i.test(name)).length));
        setTaskItems([]);
        setReminderItems([]);
        setDoneTasks([]);
        setDoneReminders([]);
        setTaskExpiry({});
        setReminderExpiry({});
        localStorage.setItem('daniel-os-activities-version', '3');
      } else {
        if (savedHabits) setActivityItems(savedHabits.map((item) => [item[0], item[1], iconForHabit(item[0]), /entrenamiento/i.test(item[0]) ? '+40 XP' : item[3]]));
        if (savedTasks) setTaskItems(savedDay && savedDay !== today ? savedTasks.filter((_, index) => !savedDoneTasks.includes(index)) : savedTasks);
        if (savedReminders) setReminderItems(savedReminders);
        setDoneReminders(savedDoneReminders);
        setReminderExpiry(savedReminderExpiry);
      }
      setActivityHistory(savedHistory);
      setHistoryStart(localStorage.getItem('daniel-os-history-start') || today);
      if (savedDay === today && activityVersion === '3') {
        setDoneActivities(savedDoneHabits);
        setDoneTasks(savedDoneTasks);
        setTaskExpiry(savedTaskExpiry);
      }
      localStorage.setItem('daniel-os-day-v2', today);
    } catch {
      localStorage.setItem('daniel-os-day-v2', dayKey());
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GAME_CONFIG.storage.progression) || 'null') as Partial<ProgressionState> | null;
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
      const saved = JSON.parse(localStorage.getItem(GAME_CONFIG.storage.money) || 'null') as { cash?: number; transactions?: MoneyTransaction[]; assets?: MoneyAsset[] } | null;
      const moneyVersion = localStorage.getItem(MONEY_VERSION);
      if (moneyVersion !== '2' && moneyVersion !== '3') {
        setCash(0);
        setMoneyTransactions(saved?.transactions?.length ? saved.transactions : HISTORICAL_INCOME);
        setMoneyAssets(saved?.assets || []);
        localStorage.setItem(MONEY_VERSION, '2');
      } else if (saved) {
        setCash(Number(saved.cash) || 0);
        setMoneyTransactions((saved.transactions || []).map((item) => moneyVersion === '2' && item.type === 'income' && item.amount === 38_200 && item.date.startsWith('2026-09') ? { ...item, date: item.date.replace('2026-09', '2026-08') } : item));
        setMoneyAssets((saved.assets || []).map((asset) => ({ ...asset, kind: asset.kind || 'asset' })));
        localStorage.setItem(MONEY_VERSION, '3');
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
    localStorage.setItem('daniel-os-done-habits-v2', JSON.stringify(doneActivities));
    localStorage.setItem('daniel-os-done-tasks-v2', JSON.stringify(doneTasks));
    localStorage.setItem('daniel-os-task-expiry', JSON.stringify(taskExpiry));
    localStorage.setItem('daniel-os-reminders', JSON.stringify(reminderItems));
    localStorage.setItem('daniel-os-done-reminders', JSON.stringify(doneReminders));
    localStorage.setItem('daniel-os-reminder-expiry', JSON.stringify(reminderExpiry));
    localStorage.setItem('daniel-os-activity-history', JSON.stringify(activityHistory));
    localStorage.setItem('daniel-os-history-start', historyStart);
  }, [storageReady, activityItems, taskItems, doneActivities, doneTasks, taskExpiry, reminderItems, doneReminders, reminderExpiry, activityHistory, historyStart]);

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
    if (dailyResetInProgress.current) { dailyResetInProgress.current = false; return; }
    setProgression((current) => {
      const habitDays = { ...current.habitDays, [dayKey()]: { done: doneActivities.length, total: activityItems.length } };
      const streak = habitStreak(habitDays, new Date());
      return current.streak === streak && current.habitDays[dayKey()]?.done === doneActivities.length && current.habitDays[dayKey()]?.total === activityItems.length
        ? current : { ...current, habitDays, streak };
    });
  }, [progressionReady, storageReady, doneActivities.length, activityItems.length]);

  useEffect(() => {
    if (!progressionReady || !storageReady) return;
    const migrationId = 'migration:health-habits-v3';
    setProgression((current) => {
      if (current.claimedRewards.includes(migrationId)) return current;
      const corrected = current.claimedRewards.includes('migration:health-habits-v2') && !current.claimedRewards.includes('migration:health-habits-v2-corrected');
      const healthXp = doneActivities.reduce((total, index) => {
        const item = activityItems[index];
        if (!item || !isHealthHabit(item[0])) return total;
        const rewardId = `${dayKey()}:habit:${item[0]}:${item[1]}`;
        if (!current.xpHistory.some((entry) => entry.id === rewardId && !entry.skill)) return total;
        return total + (/entrenamiento/i.test(item[0]) ? 40 : normalizedHabitXp(xpFromLabel(item[3])));
      }, 0);
      if (!healthXp && !corrected) return current;
      return { ...current, skillXp: { ...current.skillXp, Salud: Math.max(0, (current.skillXp.Salud || 0) - (corrected ? 40 : 0) + healthXp) }, claimedRewards: [...current.claimedRewards, ...(corrected ? ['migration:health-habits-v2-corrected'] : []), migrationId] };
    });
  }, [progressionReady, storageReady, doneActivities, activityItems]);

  useEffect(() => {
    if (!progressionReady || !storageReady) return;
    const migrationId = 'migration:business-habits-v1';
    setProgression((current) => {
      if (current.claimedRewards.includes(migrationId)) return current;
      const businessXp = doneActivities.reduce((total, index) => {
        const item = activityItems[index];
        if (!item || !isBusinessHabit(item[0])) return total;
        const rewardId = `${dayKey()}:habit:${item[0]}:${item[1]}`;
        if (!current.xpHistory.some((entry) => entry.id === rewardId && !entry.skill)) return total;
        return total + normalizedHabitXp(xpFromLabel(item[3]));
      }, 0);
      return { ...current, skillXp: { ...current.skillXp, Negocios: (current.skillXp.Negocios || 0) + businessXp }, claimedRewards: [...current.claimedRewards, migrationId] };
    });
  }, [progressionReady, storageReady, doneActivities, activityItems]);

  useEffect(() => {
    if (!progressionReady || !storageReady) return;
    const correctionId = 'migration:business-habits-v1-corrected';
    setProgression((current) => {
      if (!current.claimedRewards.includes('migration:business-habits-v1') || current.claimedRewards.includes(correctionId)) return current;
      const duplicatedXp = doneActivities.reduce((total, index) => {
        const item = activityItems[index];
        if (!item || !isBusinessHabit(item[0])) return total;
        const rewardId = `${dayKey()}:habit:${item[0]}:${item[1]}`;
        if (!current.xpHistory.some((entry) => entry.id === rewardId && entry.skill === 'Negocios')) return total;
        return total + normalizedHabitXp(xpFromLabel(item[3]));
      }, 0);
      return { ...current, skillXp: { ...current.skillXp, Negocios: Math.max(0, (current.skillXp.Negocios || 0) - duplicatedXp) }, claimedRewards: [...current.claimedRewards, correctionId] };
    });
  }, [progressionReady, storageReady, doneActivities, activityItems]);

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
      const closedMonths = [...new Set(moneyTransactions.filter((item) => item.id > 0).map((item) => item.date.slice(0, 7)))].filter((month) => month < currentMonth);
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
    if (!storageReady) return;
    const nextExpiry = Math.min(...Object.values(taskExpiry));
    if (!Number.isFinite(nextExpiry)) return;
    const timer = window.setTimeout(() => {
      const expired = Object.entries(taskExpiry).filter(([, expires]) => expires <= Date.now()).map(([key]) => key);
      if (!expired.length) return;
      setTaskItems((current) => {
        const kept = current.map((item, index) => ({ item, index })).filter(({ item }) => !expired.includes(taskKey(item)));
        setDoneTasks((done) => done.filter((index) => kept.some((entry) => entry.index === index)).map((index) => kept.findIndex((entry) => entry.index === index)));
        return kept.map(({ item }) => item);
      });
      setTaskExpiry((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !expired.includes(key))));
    }, Math.max(0, nextExpiry - Date.now()));
    return () => window.clearTimeout(timer);
  }, [storageReady, taskExpiry]);

  useEffect(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const timer = window.setTimeout(() => {
      dailyResetInProgress.current = true;
      setProgression((current) => {
        const habitDays = { ...current.habitDays, [dayKey()]: { done: doneActivities.length, total: activityItems.length } };
        return { ...current, habitDays, streak: habitStreak(habitDays, new Date()) };
      });
      setDoneActivities([]);
      setTaskItems((current) => current.filter((_, index) => !doneTasks.includes(index)));
      setDoneTasks([]);
      localStorage.setItem('daniel-os-day-v2', dayKey());
    }, endOfDay.getTime() - now.getTime());
    return () => window.clearTimeout(timer);
  }, [doneActivities.length, activityItems.length, doneTasks]);

  useEffect(() => { setCoverLevel(level); }, [level]);

  const activityReward = (index: number): XpReward => {
    const item = activityItems[index];
    const isDeepWork = /trabajo profundo/i.test(item?.[0] || '');
    const isWorkout = /entrenamiento/i.test(item?.[0] || '');
    const general = isWorkout ? 40 : normalizedHabitXp(xpFromLabel(item?.[3]));
    const skill = isHealthHabit(item?.[0] || '') ? 'Salud' : isBusinessHabit(item?.[0] || '') ? 'Negocios' : undefined;
    return { id: `${dayKey()}:${isDeepWork ? 'deep' : 'habit'}:${item?.[0]}:${item?.[1]}`, date: dayKey(), general,
      reason: item?.[0] || 'Hábito', type: isDeepWork ? 'deep_work' : 'habit', ...(skill ? { skill, skillAmount: general } : {}) };
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
    const key = taskKey(taskItems[index]);
    setTaskExpiry((current) => done ? Object.fromEntries(Object.entries(current).filter(([item]) => item !== key)) : { ...current, [key]: Date.now() + 3 * 60 * 1000 });
  };
  const toggleStudyProgress = (branch: string, taskId: string, reason: string, done: boolean, skillAmount: number, completedLevel?: number, generalAmount = 0) => setProgression((current) => {
    let next = skillAmount > 0 || generalAmount > 0 ? grantXp(current, { id: `knowledge-theme:${taskId}`, date: dayKey(), general: generalAmount, reason, type: 'special', skill: branch, skillAmount }) : current;
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
      setReminderExpiry((current) => ({ ...current, [key]: Date.now() + 3 * 60 * 1000 }));
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
    if (modalType === 'habit') setActivityItems((current) => [...current, [name, description, iconForHabit(name), `+${itemXp} XP`]]);
    else if (modalType === 'task') {
      const difficulty = taskXp.find(([xp]) => xp === itemXp)?.[1] || 'Delegada';
      setTaskItems((current) => [...current, [name, description, difficulty, `+${itemXp} XP`]]);
    } else setReminderItems((current) => [...current, [name, description, itemCategory]]);
    setModalType(null);
  };
  const openMoneyModal = (type: MoneyModal) => { setMoneyModal(type); setMoneyConcept(''); setMoneyAmount(''); setMoneyMonth(currentMonth); setMoneyAdjustmentType('income'); setMoneyAssetKind('asset'); };
  const saveMoney = () => {
    const amount = Number(moneyAmount);
    if (!moneyModal || !Number.isFinite(amount) || amount < 0 || (moneyModal !== 'balance' && amount === 0)) return;
    if (moneyModal === 'balance') setCash((value) => Math.max(0, value + (moneyAdjustmentType === 'income' ? amount : -amount)));
    else if (moneyModal === 'asset') setMoneyAssets((items) => [...items, { id: Date.now(), name: moneyConcept.trim() || 'Patrimonio', detail: moneyAssetKind === 'debt' ? 'Deuda registrada' : 'Valor registrado', value: amount, kind: moneyAssetKind }]);
    else if (moneyModal === 'income' || moneyModal === 'expense') {
      const type = moneyModal;
      setMoneyTransactions((items) => [{ id: Date.now(), type, concept: moneyConcept.trim() || (type === 'income' ? 'Ingreso' : 'Gasto'), amount, date: `${moneyMonth || currentMonth}-15T12:00:00.000Z` }, ...items]);
      setCash((value) => value + (type === 'income' ? amount : -amount));
    }
    setMoneyModal(null);
  };
  const deleteMoney = (transaction: MoneyTransaction) => {
    setMoneyTransactions((items) => items.filter((item) => item.id !== transaction.id));
    setCash((value) => value - (transaction.type === 'income' ? transaction.amount : -transaction.amount));
  };

  const spendCoins = (amount: number) => {
    if (amount <= 0 || progression.coins < amount) return false;
    setProgression((current) => current.coins >= amount ? { ...current, coins: current.coins - amount } : current);
    return true;
  };

  const nextLevel = Math.min(level + 1, 40);
  const nextRequirement = requirementForLevel(nextLevel);
  const currentRequirement = requirementForLevel(level);
  const headerXpProgress = level >= GAME_CONFIG.maxLevel ? 100 : percentage(Math.max(0, progression.generalXp - currentRequirement.xp), Math.max(1, nextRequirement.xp - currentRequirement.xp));
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
  const totalLevelProgress = Math.round(profileRequirements.reduce((sum, item) => sum + Math.min(100, item.progress), 0) / profileRequirements.length);
  const recentXp = progression.xpHistory.slice(-5).reverse();
  const nextFinancialMilestone = Object.entries(XP_CONFIG.financialMilestones).map(([target, reward]) => ({ target: Number(target), reward })).find((item) => item.target > totalWorth);
  const nextStreakMilestone = Object.entries(XP_CONFIG.streaks).map(([target, reward]) => ({ target: Number(target), reward })).find((item) => item.target > progression.streak);
  const nextBossLevel = Object.entries(REWARD_CONFIG.bossLevels).map(([bossLevel, requirement]) => ({ level: Number(bossLevel), ...requirement })).find((boss) => boss.level > level);

  useEffect(() => {
    if (!progressionReady || !canLevelUp) return;
    if (celebratedLevelRef.current === level) return;
    celebratedLevelRef.current = level;
    const unlocked = Math.min(GAME_CONFIG.maxLevel, level + 1);
    setProgression((current) => grantCoins({ ...current, level: unlocked, highestLevelUnlocked: Math.max(current.highestLevelUnlocked, unlocked) }, `coins:general-level:${unlocked}`, unlocked * COIN_CONFIG.generalLevelMultiplier));
    setUnlockedLevel(unlocked);
  }, [progressionReady, canLevelUp, level]);

  return (
    <main className="stage">
      <section className="dashboard" aria-label="Panel de progreso personal">
        <header className="topbar">
          <div className="profile"><div className={`avatar ${levelTier}`} role="img" aria-label={`Nivel ${level}, categoría ${levelTierLabel}`}><b>{level}</b></div><div><strong>DANIEL</strong><span>Nivel {level} <i aria-label={`${headerXpProgress}% de XP hacia el nivel ${nextLevel}`} style={{ background: `linear-gradient(90deg,#9f64ff ${headerXpProgress}%,#282430 ${headerXpProgress}%)` }} /></span></div></div>
          <div className="topStats">
            <div className="statCard"><img src={assetPath('/icons/xp.webp')} alt="" /><span><b>XP</b><strong>{progression.generalXp.toLocaleString('es-MX')}</strong></span></div>
            <div className="statCard"><img src={assetPath('/icons/coins.webp')} alt="" /><span><b>Monedas</b><strong>{progression.coins.toLocaleString('es-MX')}</strong></span></div>
            <div className="statCard streakCard" title="Regla semanal: mínimo 4 días con 6 hábitos y hasta 2 días de tolerancia con 5"><img src={assetPath('/icons/streak.webp')} alt="" /><span><b>Racha</b><strong>{progression.streak} <small>días</small></strong></span></div>
          </div>
        </header>

        {active === 'Ideas' ? (
          <IdeasView onCountChange={setIdeaCount} />
        ) : active === 'Estudio' ? (
          <StudyView skillXp={progression.skillXp} onTaskToggled={toggleStudyProgress} onKnowledgeSummary={setKnowledgeTopics} />
        ) : active === 'Actividades' ? (
          <section className="activitiesView" aria-label="Panel de actividades">
            <div className="activitiesHeading"><div><span>HOY · {calendar.date || 'FECHA ACTUAL'}</span><h1>Actividades</h1><p>Pequeñas acciones, grandes resultados.</p></div><div className="dailyScore"><b>{doneActivities.length}/{activityItems.length}</b><span>completadas</span></div></div>
            <div className="activitySummary">
              <article><img src={assetPath('/icons/streak.webp')} alt="" /><span><small>Racha</small><b>{progression.streak} días</b></span></article>
              <article><img src={assetPath('/icons/xp.webp')} alt="" /><span><small>XP de hoy</small><b>+{todayXp}</b></span></article>
              <article><img src={assetPath('/icons/habits.webp')} alt="" /><span><small>Objetivo diario</small><b>{completion}%</b></span></article>
              <article><img src={assetPath('/icons/pending.webp')} alt="" /><span><small>Pendientes</small><b>{taskItems.length} activos</b></span></article>
            </div>
            <div className="activityBoard">
              <article className="activityBox habitsBox"><header><div><b>Hábitos de hoy</b><small>Marca lo que vayas completando</small></div><div className="boxActions"><strong>{doneActivities.length}/{activityItems.length}</strong><button onClick={() => openItemModal('habit')}>＋ Agregar hábito</button></div></header><div className="activityList">{activityItems.map(([name, detail, icon, xp], index) => <div className="activityRow" key={`${name}-${index}`}><button className={`activityCheck ${doneActivities.includes(index) ? 'done' : ''}`} onClick={() => toggleActivity(index)}><i>{doneActivities.includes(index) ? '✓' : ''}</i><img src={assetPath(/no fab/i.test(name) ? '/icons/no-fab.png' : /prospect/i.test(name) ? '/icons/client-prospecting.png' : icon)} alt="" /><span><b>{name}</b><small>{detail}</small></span><em>{/entrenamiento/i.test(name) ? '+40 XP' : xp}</em></button><button className="deleteHabit" onClick={() => setHabitToDelete(index)} aria-label={`Eliminar hábito ${name}`} title="Eliminar hábito">🗑</button></div>)}</div></article>
              <article className="activityBox pendingBox"><header><div><b>Pendientes prioritarios</b><small>Enfócate en lo importante</small></div><div className="boxActions"><strong>{doneTasks.length}/{taskItems.length}</strong><button onClick={() => openItemModal('task')}>＋ Agregar tarea</button></div></header><div className="pendingList">{taskItems.map(([name, description, difficulty, xp], index) => <button className={doneTasks.includes(index) ? 'done' : ''} onClick={() => toggleTask(index)} key={`${name}-${index}`}><i>{doneTasks.includes(index) ? '✓' : ''}</i><span><b>{name}</b><small>{description}</small></span><span className="taskMeta"><em className={`priority ${difficulty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>{difficulty}</em><small>{xp}</small></span></button>)}</div></article>
              <article className="activityBox statsBox"><header><div><b>▥ Estadísticas de hoy</b><small>Tu progreso en números</small></div></header><div className="todayStats"><div><span>✓ Hábitos</span><b>{doneActivities.length} / {activityItems.length}</b><i><em style={{width:`${completion}%`}} /></i><small>{completion}%</small></div><div><span>▣ Pendientes</span><b>{doneTasks.length} / {taskItems.length}</b><i><em style={{width:`${taskCompletion}%`}} /></i><small>{taskCompletion}%</small></div><div><span>✦ XP ganado</span><b>+{todayXp}</b><i><em style={{width:`${Math.min(todayXp / 3, 100)}%`}} /></i><small>{todayXp} XP</small></div><div><span>★ Día completado</span><b>{dayCompletion}%</b><i><em style={{width:`${dayCompletion}%`}} /></i><small>{dayCompletion}%</small></div></div></article>
              <article className="activityBox weeklyBox"><header><div><b>Progreso semanal</b><small>{calendar.label} · hoy se actualiza al marcar hábitos</small></div><div className="weeklyActions"><strong>{completion}%</strong><button onClick={() => setShowHistory(true)}>Ver resumen</button></div></header><div className="weekChart">{liveWeekProgress.map((value, index) => <div className={`${index === calendar.todayIndex ? 'todayBar' : ''} ${index > calendar.todayIndex ? 'futureBar' : ''}`} key={index}><span><i style={{ height: `${value}%` }} /></span><b>{calendar.days[index].day}<small>{calendar.days[index].date}</small></b></div>)}</div></article>
              <article className="activityBox generalBox"><header><div><b>▰ Pendientes generales</b><small>Ideas, compras y recordatorios sin fecha · sin XP ni monedas</small></div><button onClick={() => openItemModal('reminder')}>＋ Agregar</button></header><div className="reminderList">{reminderItems.map(([name, description, category], index) => <button className={doneReminders.includes(index) ? 'done' : ''} onClick={() => toggleReminder(index)} key={`${name}-${index}`}><i>{doneReminders.includes(index) ? '✓' : ''}</i><span><b>{name}</b><small>{description}</small></span><em className={`reminderTag ${category.toLowerCase()}`}>{category}</em><strong>⋮</strong></button>)}</div></article>
            </div>
          </section>
        ) : active === 'Tiendita' ? (
          <StoreView coins={progression.coins} onSpend={spendCoins} metrics={{ level, stability, stability30, habits14, savingsGoal: savingsGoalMet, incomeGoal: incomeGoalMet, netIncome: netMonthlyIncome }} />
        ) : active === 'Perfil' ? (
          <section className="profileView" aria-label="Perfil y requisitos del siguiente nivel">
            <div className="profileHeading"><div><span>♕ MI NIVEL</span><h1>Nivel actual</h1><p>{LEVEL_NAMES[level - 1]} · {progression.generalXp.toLocaleString('es-MX')} XP total</p></div><div className={`profileMedal ${levelTier}`}><small>NIVEL</small><b>{level}</b></div></div>
            <article className="levelUnlockCard">
              <div className="unlockGlow" aria-hidden="true">◇</div>
              <header><span>⌃ {level === GAME_CONFIG.maxLevel ? 'NIVEL MÁXIMO' : 'SIGUIENTE NIVEL'}</span><h2>{level === GAME_CONFIG.maxLevel ? 'NIVEL 40 · COMPLETADO' : <>NIVEL {level} <em>→</em> NIVEL {nextLevel}</>}</h2><p>Sigue avanzando. Cada paso te acerca a una mejor versión de ti.</p></header>
              <aside className="totalLevelProgress"><i>★</i><span><b>Progreso total</b><strong>{totalLevelProgress}%</strong></span><q>Disciplina hoy,<br />libertad mañana.</q></aside>
              <div className="requirementList">{profileRequirements.map((item) => <div className={`requirement ${item.tone}`} key={item.label}><i>{item.icon}</i><span><b>{item.label}</b><small>{item.current} / {item.target}</small><strong><em style={{ width: `${item.progress}%` }} /></strong></span>{item.progress >= 100 ? <mark>✓ COMPLETADO</mark> : <mark>{item.progress}%</mark>}</div>)}</div>
              {level < GAME_CONFIG.maxLevel && <aside className="levelRewardPreview"><img src={assetPath('/icons/xp.webp')} alt="" /><h3>Recompensa al llegar<br />a Nivel {nextLevel}</h3><p><b>🪙</b> +{nextLevel * COIN_CONFIG.generalLevelMultiplier} monedas</p><p><b>🔒</b> Nivel guardado permanentemente</p><button onClick={() => document.querySelector('.levelInsights')?.scrollIntoView({ behavior: 'smooth' })}>Ver próximos hitos →</button></aside>}
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
              <article className="moneyChart comparisonChart">
                <header><b>▥ DINERO GANADO <em>{previousChartYear}</em> vs <em>{chartYear}</em></b><div className={`yearComparisonSummary ${comparisonTone}`}><strong>{chartYear} acumulado a {comparisonCutoff}: {formatMoney(comparisonCurrent)}</strong><span>{comparisonPercent === null ? 'Sin referencia' : `${comparisonDifference >= 0 ? '▲ +' : '▼ -'}${Math.abs(comparisonPercent).toLocaleString('es-MX', { maximumFractionDigits: 1 })}% vs ${previousChartYear}`}</span><span>{comparisonDifference >= 0 ? '▲ ' : '▼ '}{formatSignedMoney(comparisonDifference)} vs {previousChartYear}</span></div></header>
                <div className="chartLegend"><span><i className="previous" />{previousChartYear}</span><span><i className="current" />{chartYear}</span></div>
                <div className="chartBars grouped">{monthlyChart.map((value, index) => {
                  const previous = previousYearChart[index];
                  const future = index > chartMonthIndex;
                  const difference = value - previous;
                  const percent = previous ? `${difference >= 0 ? '+' : '−'}${Math.abs(difference / previous * 100).toLocaleString('es-MX', { maximumFractionDigits: 2 })}%` : 'N/A';
                  const month = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][index];
                  const tooltip = `${month}\n${previousChartYear}: ${formatMoney(previous)}\n${chartYear}: ${future ? 'Sin registrar' : formatMoney(value)}\nDiferencia: ${future ? '—' : formatSignedMoney(difference)}\nCambio: ${future ? '—' : percent}`;
                  return <div className="chartGroup" title={tooltip} key={index}><i className="previous" style={{height:`${previous ? Math.max(4, previous / chartMax * 100) : 0}%`}}><b>{previous ? formatMoney(previous) : '$0'}</b>{previous > 0 && <span />}</i><i className={`current ${future ? 'future' : ''}`} style={{height:`${!future && value ? Math.max(4, value / chartMax * 100) : 0}%`}}><b>{future ? '—' : value ? formatMoney(value) : '$0'}</b>{!future && value > 0 && <span />}</i></div>;
                })}</div>
                <div className="chartMonths">{['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map((month) => <span key={month}>{month}</span>)}</div>
              </article>
            </section>
          </section>
        ) : (
          <>
            <section className="hero coverHero" style={{ backgroundImage: `url(${assetPath(cover)})` }} aria-label={completed ? 'Pantalla final del recorrido' : `Portada del nivel ${coverLevel}: ${LEVEL_NAMES[coverLevel - 1]}`}>
              <div className="coverShade" />
              <button type="button" className="coverArrow left" onClick={() => completed ? setCompleted(false) : setCoverLevel(Math.max(1, coverLevel - 1))} disabled={coverLevel === 1 && !completed} aria-label={completed ? 'Volver al nivel 40' : 'Nivel anterior'}>‹</button>
              <div className="coverInfo"><span>{completed ? 'RECORRIDO COMPLETADO' : `NIVEL ${coverLevel} DE 40`}</span><b>{completed ? 'Felicidades, has ganado en la vida' : LEVEL_NAMES[coverLevel - 1]}</b></div>
            </section>

            <section className="skills" aria-label="Habilidades">
              {homeSkills.map((skill) => <article className="skill" key={skill.name}><div><span className="dot"><img src={assetPath(skill.icon)} alt="" /> </span>{skill.name}<small>{skill.name === 'Ejercicio' ? 'Histórico' : `Nivel ${skill.level}`}</small></div><div className="bar"><i style={{ width: `${skill.name === 'Ejercicio' ? Math.min(lifetimeExerciseDays, 100) : skill.progress}%` }} /></div><p>{skill.name === 'Ejercicio' ? `${lifetimeExerciseDays} ${lifetimeExerciseDays === 1 ? 'día' : 'días'} en total` : skill.value}</p></article>)}
            </section>

            <section className="lower">
              <div className="today"><div className="sectionTitle"><b>HOY</b><span>{calendar.date || 'Fecha actual'}</span></div><div className="habitGrid">{todaySummary.map(([name, value, icon]) => <article className="habit" key={name}><img className="habitIcon" src={assetPath(icon)} alt="" /><div><small>{name}</small><b>{value}</b></div></article>)}</div></div>
              <button type="button" className="ideaPanel" onClick={() => setActive('Ideas')} aria-label="Abrir panel de ideas"><img src={assetPath('/icons/ideas.webp')} alt="" /><span><small>CREAR</small><b>＋ IDEA</b><em>{ideaCount} ideas guardadas</em></span></button>
            </section>
          </>
        )}

        {moneyModal && <div className="modalBackdrop" role="presentation" onMouseDown={() => setMoneyModal(null)}><section className="itemModal moneyModal" role="dialog" aria-modal="true" aria-label="Registro de dinero" onMouseDown={(event) => event.stopPropagation()}><header><div><span>MI DINERO</span><h2>{moneyModal === 'income' ? 'Registrar ingreso' : moneyModal === 'expense' ? 'Registrar gasto' : moneyModal === 'balance' ? 'Ajustar dinero actual' : moneyModal === 'asset' ? 'Agregar patrimonio' : moneyModal === 'transactions' ? 'Todos los movimientos' : 'Todo mi patrimonio'}</h2></div><button onClick={() => setMoneyModal(null)} aria-label="Cerrar">×</button></header>{moneyModal === 'transactions' ? <div className="moneyDetailList">{moneyTransactions.length ? moneyTransactions.map((item) => <article key={item.id}><span><b>{item.concept}</b><small>{new Date(item.date).toLocaleDateString('es-MX')}</small></span><strong className={item.type}>{item.type === 'expense' ? '−' : '+'}{formatMoney(item.amount)}</strong><button className="deleteMoney" onClick={() => deleteMoney(item)} aria-label={`Eliminar ${item.concept}`}>Eliminar</button></article>) : <p>No hay movimientos todavía.</p>}</div> : moneyModal === 'assets' ? <div className="moneyDetailList">{moneyAssets.length ? moneyAssets.map((asset) => <article key={asset.id}><span><b>{asset.name}</b><small>{asset.detail}</small></span><strong>{asset.kind === 'debt' ? '−' : ''}{formatMoney(asset.value)}</strong></article>) : <p>No hay patrimonio registrado todavía.</p>}</div> : <>{moneyModal !== 'income' && <label>{moneyModal === 'asset' ? 'Nombre del patrimonio' : moneyModal === 'balance' ? 'Nota (opcional)' : 'Concepto'}<input autoFocus value={moneyConcept} onChange={(event) => setMoneyConcept(event.target.value)} placeholder={moneyModal === 'asset' ? 'Ej. Ahorros' : moneyModal === 'balance' ? 'Ej. Ajuste de caja' : 'Ej. Venta del mes'} /></label>}{(moneyModal === 'income' || moneyModal === 'expense') && <label>Selecciona mes<input autoFocus={moneyModal === 'income'} type="month" min={moneyMonthMin} max={currentMonth} value={moneyMonth} onChange={(event) => setMoneyMonth(event.target.value)} /></label>}{moneyModal === 'balance' && <fieldset><legend>¿Qué tipo de movimiento es?</legend><div className="categoryOptions"><button className={moneyAdjustmentType === 'income' ? 'selected' : ''} onClick={() => setMoneyAdjustmentType('income')}>Ingreso</button><button className={moneyAdjustmentType === 'expense' ? 'selected' : ''} onClick={() => setMoneyAdjustmentType('expense')}>Egreso</button></div><p className="noReward">Solo ajusta el dinero disponible; no modifica los ingresos ni gastos del mes.</p></fieldset>}<label>Cantidad MXN<input type="number" min="0" step="100" value={moneyAmount} onChange={(event) => setMoneyAmount(event.target.value)} placeholder="$0" /></label>{moneyModal === 'asset' && <fieldset><legend>Tipo</legend><div className="categoryOptions">{([['savings','Ahorro'],['investment','Inversión'],['asset','Activo'],['debt','Deuda']] as const).map(([kind, label]) => <button className={moneyAssetKind === kind ? 'selected' : ''} onClick={() => setMoneyAssetKind(kind)} key={kind}>{label}</button>)}</div></fieldset>}<button className="saveItem" onClick={saveMoney}>Guardar registro</button></>}</section></div>}
        {modalType && <div className="modalBackdrop" role="presentation" onMouseDown={() => setModalType(null)}><section className="itemModal" role="dialog" aria-modal="true" aria-label={modalType === 'habit' ? 'Agregar hábito' : 'Agregar pendiente'} onMouseDown={(event) => event.stopPropagation()}><header><div><span>{modalType === 'habit' ? 'NUEVO HÁBITO' : modalType === 'task' ? 'NUEVA TAREA' : 'NUEVO RECORDATORIO'}</span><h2>{modalType === 'habit' ? 'Agregar hábito' : modalType === 'task' ? 'Agregar pendiente' : 'Pendiente general'}</h2></div><button onClick={() => setModalType(null)} aria-label="Cerrar">×</button></header><label>{modalType === 'habit' ? 'Hábito' : 'Tarea'}<input autoFocus value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder={modalType === 'habit' ? 'Ej. Ir al gimnasio' : 'Ej. Llamar a proveedor'} /></label><label>Descripción {modalType === 'habit' && <small>Máximo 3 palabras</small>}<input value={itemDescription} onChange={(event) => setItemDescription(modalType === 'habit' ? event.target.value.split(/\s+/).slice(0, 3).join(' ') : event.target.value)} placeholder="Detalle breve" /></label>{modalType === 'reminder' ? <fieldset><legend>Categoría</legend><div className="categoryOptions">{reminderCategories.map((category) => <button className={itemCategory === category ? 'selected' : ''} onClick={() => setItemCategory(category)} key={category}>{category}</button>)}</div><p className="noReward">Este recordatorio no otorga XP ni monedas.</p></fieldset> : <fieldset><legend>Valor XP</legend><div className="xpOptions">{(modalType === 'habit' ? habitXp : taskXp).map(([xp, label]) => <button className={itemXp === xp ? 'selected' : ''} onClick={() => setItemXp(xp)} key={xp}><b>{xp} XP</b><span>{label}</span></button>)}</div></fieldset>}<button className="saveItem" onClick={saveItem}>Guardar {modalType === 'habit' ? 'hábito' : modalType === 'task' ? 'tarea' : 'recordatorio'}</button></section></div>}
        {habitToDelete !== null && <div className="modalBackdrop" role="presentation" onMouseDown={() => setHabitToDelete(null)}><section className="deleteModal" role="alertdialog" aria-modal="true" aria-labelledby="delete-habit-title" onMouseDown={(event) => event.stopPropagation()}><span>ELIMINAR HÁBITO</span><h2 id="delete-habit-title">¿Quieres borrar “{activityItems[habitToDelete]?.[0]}”?</h2><p>El hábito dejará de aparecer en tu lista diaria.</p><div><button onClick={() => setHabitToDelete(null)}>Cancelar</button><button className="confirmDelete" onClick={deleteHabit}>Confirmar</button></div></section></div>}
        {showHistory && <div className="modalBackdrop" role="presentation" onMouseDown={() => setShowHistory(false)}><section className="historyModal" role="dialog" aria-modal="true" aria-label="Historial mensual de hábitos" onMouseDown={(event) => event.stopPropagation()}><header><div><span>HISTORIAL DE HÁBITOS</span><h2>{monthLabel}</h2></div><button onClick={() => setShowHistory(false)} aria-label="Cerrar">×</button></header><div className="monthControls"><button onClick={() => setHistoryMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}>‹ Mes anterior</button><p>El historial comienza el {new Date(`${historyStart}T12:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p><button disabled={isCurrentMonth} onClick={() => setHistoryMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>Mes siguiente ›</button></div><div className="monthWeekdays">{['L','M','X','J','V','S','D'].map((day) => <b key={day}>{day}</b>)}</div><div className="monthGrid">{monthCalendar.map((cell, index) => cell ? <article className={`${cell.key === dayKey() ? 'today' : ''} ${cell.key < historyStart || cell.key > dayKey() ? 'emptyDay' : ''}`} key={cell.key}><span>{cell.day}</span>{activityHistory[cell.key] === undefined ? <small>—</small> : <><div><i style={{ height: `${activityHistory[cell.key]}%` }} /></div><b>{activityHistory[cell.key]}%</b></>}</article> : <i key={`empty-${index}`} />)}</div><footer><span><i /> Sin actividad</span><span><i /> Progreso registrado</span></footer></section></div>}

        <nav className="nav" aria-label="Navegación principal">
          {['Ideas', 'Estudio'].map((item) => <button type="button" className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Ideas' ? '✦' : '▤'}</span>{item}</button>)}
          <button type="button" className={`homeButton ${active === 'HOME' ? 'active' : ''}`} onClick={() => setActive('HOME')} aria-label="Ir a la página principal"><span>⌂</span>HOME</button>
          {['Actividades', 'Tiendita', 'Perfil'].map((item) => <button type="button" className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Actividades' ? '▦' : item === 'Tiendita' ? '🛍' : '♙'}</span>{item}</button>)}
        </nav>
      </section>
      {unlockedLevel && <section className="levelCelebration" role="dialog" aria-modal="true" aria-labelledby="level-complete-title">
        <div className="celebrationParticles" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i style={{ '--particle': index } as CSSProperties} key={index} />)}</div>
        <article>
          <div className="celebrationRings" aria-hidden="true"><i /><i /><i /></div>
          <span>✦ PROGRESO DESBLOQUEADO ✦</span>
          <b className="celebrationLevel">{unlockedLevel - 1}</b>
          <h2 id="level-complete-title">Nivel {unlockedLevel - 1} completado</h2>
          <h3>{LEVEL_NAMES[unlockedLevel - 2]}</h3>
          <blockquote>“{LEVEL_QUOTES[(unlockedLevel - 2) % LEVEL_QUOTES.length]}”</blockquote>
          <p>Has desbloqueado el <strong>Nivel {unlockedLevel}</strong> y recibido <strong>+{unlockedLevel * COIN_CONFIG.generalLevelMultiplier} monedas</strong>.</p>
          <button type="button" autoFocus onClick={() => setUnlockedLevel(null)}>Listo</button>
        </article>
      </section>}
    </main>
  );
}
const HISTORICAL_INCOME: MoneyTransaction[] = [
  ...[27000, 37400, 60600, 54350, 70000, 108000, 73000, 94600, 133000, 132000, 107000, 49000]
    .map((amount, month) => ({ id: -(202500 + month + 1), type: 'income' as const, concept: `Ingreso ${new Date(2025, month).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}`, amount, date: `2025-${String(month + 1).padStart(2, '0')}-15T12:00:00.000Z` })),
  ...[[1, 42600], [2, 40000], [3, 68800], [4, 71850], [5, 34000], [6, 40000], [7, 26800]]
    .map(([month, amount]) => ({ id: -(202600 + month), type: 'income' as const, concept: `Ingreso ${new Date(2026, month - 1).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}`, amount, date: `2026-${String(month).padStart(2, '0')}-15T12:00:00.000Z` })),
];
