'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { fullStudyBranches } from './study-data';

type MoneyTransaction = { id: number; type: 'income' | 'expense'; concept: string; amount: number; date: string };
type MoneyAsset = { id: number; name: string; detail: string; value: number };
type MoneyModal = 'income' | 'expense' | 'balance' | 'asset' | 'transactions' | 'assets' | null;
const formatMoney = (value: number) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

const levelNames = [
  'El inicio',
  'Pequeños hábitos, grandes cambios',
  'Un poco más enfocado',
  'Primeras mejoras',
  'Modo supervivencia estable',
  'Primer monitor, más productividad',
  'Usar el dinero inteligentemente',
  'Más disciplina, más resultados',
  'Mejor apariencia, más confianza',
  'Primera gran etapa completada',
  'Mejor tecnología, más oportunidades',
  'Primer guardarropa bueno',
  'Fitness visible',
  'Primer smartphone premium',
  'Primer estilo premium',
  'Primer espacio realmente bonito',
  'Primera escapada: viaje',
  'Trabajo más profesional',
  'Primer reloj de gama media',
  'Departamento propio: independencia',
  'Primer coche propio',
  'Mejor guardarropa y accesorios',
  'Oficina personal: primera oficina',
  'Primer coche premium',
  'Departamento premium',
  'Departamento premium renovado',
  'Ecosistema tecnológico premium',
  'Coche deportivo de entrada',
  'Equipo y oficina en crecimiento',
  'Vida premium nocturna',
  'Patrimonio en movimiento',
  'Penthouse y exclusividad',
  'Penthouse en Cancún',
  'Viaje premium a París',
  'Experiencias gastronómicas premium',
  'Empresa e inversiones',
  'Casa familiar premium',
  'Patrimonio internacional',
  'Club y conexiones',
  'Vida extraordinaria',
];

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
  ['Tomar agua', '2 litros', '/icons/health.webp', '+20 XP'],
  ['Entrenamiento', '45 minutos', '/icons/exercise.webp', '+50 XP'],
  ['Estudiar', '1 hora', '/icons/study.webp', '+40 XP'],
  ['Trabajo profundo', '2 horas', '/icons/work.webp', '+70 XP'],
  ['Revisar finanzas', '15 minutos', '/icons/finance.webp', '+25 XP'],
  ['Planear mañana', '10 minutos', '/icons/discipline.webp', '+20 XP'],
];

const pendingActivities = [
  ['Terminar propuesta', 'Trabajo', 'Alta', '+55 XP'],
  ['Revisar campaña', 'Negocios', 'Alta', '+55 XP'],
  ['Responder mensajes', 'Personal', 'Media', '+40 XP'],
  ['Preparar contenido', 'Estudio', 'Media', '+40 XP'],
  ['Organizar escritorio', 'Hábitos', 'Baja', '+5 XP'],
];

const weekProgress = [65, 80, 55, 90, 72, 45, 30];
const habitXp = [['5', 'Sencillo'], ['10', 'Medio'], ['15', 'Difícil'], ['25', 'Me cuesta (GYM)']];
const taskXp = [['0', 'Delegada'], ['5', 'Baja'], ['20', 'Intermedia'], ['40', 'Media'], ['55', 'Difícil'], ['70', 'Máximo']];
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

type StudyTask = { name: string; done: boolean };
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

function StudyView() {
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
      if (storedBranches) setBranches(storedBranches);
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
    setBranches((current) => current.map((branch, bi) => {
      if (bi !== branchIndex) return branch;
      let topics = branch.topics.map((topic, ti) => {
        if (ti !== topicIndex) return topic;
        const modules = topic.modules.map((module, mi) => mi !== moduleIndex ? module : { ...module, tasks: module.tasks.map((task, xi) => xi === taskIndex ? { ...task, done: !task.done } : task) });
        const tasks = modules.flatMap((module) => module.tasks);
        const progress = tasks.length ? Math.round(tasks.filter((task) => task.done).length / tasks.length * 100) : topic.progress;
        return { ...topic, modules, progress };
      });
      topics = topics.map((topic, index) => ({ ...topic, locked: index > 0 && topics[index - 1].progress < 100 }));
      const completedLevels = topics.filter((topic) => topic.progress === 100).length;
      return { ...branch, topics, level: Math.min(topics.length, completedLevels + 1) };
    }));
  };
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
      {selectedTopic ? <div className="topicCourse"><header><span>{selectedBranch.icon} {selectedBranch.name}</span><h2>{selectedTopic.name}</h2><div><i style={{ width: `${selectedTopic.progress}%` }} /></div><b>{selectedTopic.progress}% completado</b></header><div className="moduleList">{selectedTopic.modules.length ? selectedTopic.modules.map((module, moduleIndex) => { const done = module.tasks.length > 0 && module.tasks.every((task) => task.done); return <article key={module.name}><header><span>MÓDULO {moduleIndex + 1}</span><b>{module.name}</b><em>{done ? '✓ Completado' : module.tasks.some((task) => task.done) ? 'En progreso' : 'Pendiente'}</em></header>{module.tasks.map((task, taskIndex) => <button className={task.done ? 'done' : ''} onClick={() => toggleStudyTask(moduleIndex, taskIndex)} key={task.name}><i>{task.done ? '✓' : ''}</i><span>{task.name}</span></button>)}</article>; }) : <div className="emptyCourse"><b>Curso listo para crecer</b><p>Guarda videos, lecturas o prácticas para construir este tema.</p><button onClick={() => setShowSave(true)}>＋ Agregar material</button></div>}</div></div> : <><div className={`branchTitle ${selectedBranch.tone}`}><i>{selectedBranch.icon}</i><span><small>RAMA DE CONOCIMIENTO</small><h2>{selectedBranch.name}</h2><b>Nivel {selectedBranch.level}</b></span></div><div className="topicList">{selectedBranch.topics.map((topic, index) => <button disabled={topic.locked} onClick={() => setTopicIndex(index)} key={topic.name}><i>{topic.locked ? '🔒' : topic.progress === 100 ? '✓' : topic.progress > 0 ? '●' : '○'}</i><span><b>{topic.name}</b><small>{topic.locked ? 'Completa los temas anteriores' : topic.progress === 100 ? 'Completado' : topic.progress > 0 ? 'En curso' : 'Sin empezar'}</small></span>{!topic.locked && <><div><em style={{ width: `${topic.progress}%` }} /></div><strong>{topic.progress}%</strong></>}</button>)}</div></>}
    </div> : <><div className="studyOverview"><article><div className="progressRing" style={{ '--progress': `${overall * 3.6}deg` } as CSSProperties}><b>{overall}%</b><span>completado</span></div><ul><li><i />Completados <b>{completedTopics}</b></li><li><i />En curso <b>{totalTopics - completedTopics}</b></li><li><i />Por aprender <b>{saved.length}</b></li></ul><p>“Un poco mejor cada día, grandes resultados con el tiempo.”</p></article><div className="knowledgeTree" style={{ backgroundImage: 'linear-gradient(#08051a22,#08051aaa),url(/study-tree.png)' }}>{visibleBranches.map(({ branch, index }) => { const progress = Math.round(branch.topics.reduce((sum, topic) => sum + topic.progress, 0) / branch.topics.length); return <button className={`treeNode node${index + 1} ${branch.tone}`} onClick={() => openBranch(index)} key={branch.name}><i>{branch.icon}</i><span><b>{branch.name}</b><small>Nivel {branch.level} · {progress}%</small><em><strong style={{ width: `${progress}%` }} /></em></span></button>; })}</div></div>{saved.length > 0 && <section className="studyInbox"><header><div><span>📥</span><h2>Pendiente por aprender</h2></div><b>{saved.length} guardados</b></header><div>{saved.map((item, index) => <article key={`${item.title}-${index}`}><i>{item.type.split(' ')[0]}</i><span><b>{item.title}</b><small>{item.branch} → {item.topic}</small></span><em>{item.type.replace(/^\S+\s/, '')}</em></article>)}</div></section>}</>}
    {showSave && <div className="studyModalBackdrop" onMouseDown={() => setShowSave(false)}><section className="studyModal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><header><div><span>GUARDAR PARA ESTUDIAR</span><h2>Nuevo material</h2></div><button onClick={() => setShowSave(false)}>×</button></header><label>Título<input autoFocus value={material.title} onChange={(event) => setMaterial({ ...material, title: event.target.value })} placeholder="Ej. Cómo manejar objeciones" /></label><label>Rama<select value={material.branch} onChange={(event) => { const branch = branches.find((item) => item.name === event.target.value)!; setMaterial({ ...material, branch: branch.name, topic: branch.topics.find((topic) => !topic.locked)?.name || '' }); }}>{branches.map((branch) => <option key={branch.name}>{branch.name}</option>)}</select></label><label>Tema<select value={material.topic} onChange={(event) => setMaterial({ ...material, topic: event.target.value })}>{branchTopics.map((topic) => <option key={topic.name}>{topic.name}</option>)}</select></label><fieldset><legend>Tipo</legend><div>{['🎥 Video','📄 Artículo','📚 Libro','🧪 Práctica','📝 Nota'].map((type) => <button className={material.type === type ? 'selected' : ''} onClick={() => setMaterial({ ...material, type })} key={type}>{type}</button>)}</div></fieldset><button className="saveStudy" onClick={saveMaterial}>Guardar material</button></section></div>}
  </section>;
}

const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
  const [level, setLevel] = useState(1);
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
  const [calendar, setCalendar] = useState({ label: 'Esta semana', date: '', todayIndex: 0, days: ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => ({ day, date: '' })) });
  const levelCover = `/levels/level-${String(level).padStart(2, '0')}.webp`;
  const cover = completed ? '/levels/victory.webp' : levelCover;
  const levelTier = level >= 30 ? 'gold' : level >= 15 ? 'silver' : 'bronze';
  const levelTierLabel = level >= 30 ? 'oro' : level >= 15 ? 'plata' : 'bronce';
  const completion = activityItems.length ? Math.round(doneActivities.length / activityItems.length * 100) : 0;
  const taskCompletion = taskItems.length ? Math.round(doneTasks.length / taskItems.length * 100) : 0;
  const earnedXp = doneActivities.reduce((total, index) => total + Number(activityItems[index]?.[3].replace(/\D/g, '') || 0), 0) + doneTasks.reduce((total, index) => total + Number(taskItems[index]?.[3].replace(/\D/g, '') || 0), 0);
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
  const assetsTotal = moneyAssets.reduce((sum, item) => sum + item.value, 0);
  const totalWorth = cash + assetsTotal;
  const annualIncome = moneyTransactions.filter((item) => item.type === 'income' && item.date.startsWith(String(now.getFullYear()))).reduce((sum, item) => sum + item.amount, 0);
  const monthlyChart = Array.from({ length: 12 }, (_, month) => moneyTransactions.filter((item) => item.type === 'income' && item.date.startsWith(`${now.getFullYear()}-${String(month + 1).padStart(2, '0')}`)).reduce((sum, item) => sum + item.amount, 0));
  const chartMax = Math.max(1, ...monthlyChart);

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
      const saved = JSON.parse(localStorage.getItem('daniel-os-money-v1') || 'null') as { cash?: number; transactions?: MoneyTransaction[]; assets?: MoneyAsset[] } | null;
      if (saved) {
        setCash(Number(saved.cash) || 0);
        setMoneyTransactions(saved.transactions || []);
        setMoneyAssets(saved.assets || []);
      }
    } catch { /* Empieza en cero si el registro local no es válido. */ }
    setMoneyReady(true);
  }, []);

  useEffect(() => {
    if (moneyReady) localStorage.setItem('daniel-os-money-v1', JSON.stringify({ cash, transactions: moneyTransactions, assets: moneyAssets }));
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

  const chooseLevel = (next: number) => {
    if (next > 40) return;
    setLevel(next);
    setCompleted(false);
    setActive('HOME');
  };

  const toggleActivity = (index: number) => setDoneActivities((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  const toggleTask = (index: number) => setDoneTasks((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
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
  const openMoneyModal = (type: MoneyModal) => { setMoneyModal(type); setMoneyConcept(''); setMoneyAmount(''); };
  const saveMoney = () => {
    const amount = Number(moneyAmount);
    if (!moneyModal || !Number.isFinite(amount) || amount < 0 || (moneyModal !== 'balance' && amount === 0)) return;
    if (moneyModal === 'balance') setCash(amount);
    else if (moneyModal === 'asset') setMoneyAssets((items) => [...items, { id: Date.now(), name: moneyConcept.trim() || 'Patrimonio', detail: 'Valor registrado', value: amount }]);
    else {
      const type = moneyModal;
      setMoneyTransactions((items) => [{ id: Date.now(), type, concept: moneyConcept.trim() || (type === 'income' ? 'Ingreso' : 'Gasto'), amount, date: new Date().toISOString() }, ...items]);
      setCash((value) => value + (type === 'income' ? amount : -amount));
    }
    setMoneyModal(null);
  };

  const nextLevel = Math.min(level + 1, 40);
  const profileRequirements = [
    { icon: '✦', label: 'XP', current: earnedXp.toLocaleString('es-MX'), target: '3,500', progress: Math.min(100, Math.round(earnedXp / 3500 * 100)), tone: 'purple' },
    { icon: '$', label: 'Patrimonio', current: formatMoney(totalWorth), target: '$1,000,000', progress: Math.min(100, Math.round(totalWorth / 1_000_000 * 100)), tone: 'green' },
    { icon: '↗', label: 'Ingreso mensual', current: formatMoney(monthlyIncome), target: '$70,000', progress: Math.min(100, Math.round(monthlyIncome / 70_000 * 100)), tone: 'blue' },
    { icon: '◈', label: 'Estabilidad', current: '0%', target: '70%', progress: 0, tone: 'orange' },
  ];

  return (
    <main className="stage">
      <section className="dashboard" aria-label="Panel de progreso personal">
        <header className="topbar">
          <div className="profile"><div className={`avatar ${levelTier}`} role="img" aria-label={`Nivel ${level}, categoría ${levelTierLabel}`}><b>{level}</b></div><div><strong>DANIEL</strong><span>Nivel {level} <i /></span></div></div>
          <div className="topStats">
            <div className="statCard"><img src="/icons/xp.webp" alt="" /><span><b>XP</b><strong>{earnedXp.toLocaleString('es-MX')}</strong></span></div>
            <div className="statCard"><img src="/icons/coins.webp" alt="" /><span><b>Monedas</b><strong>0</strong></span></div>
            <div className="statCard streakCard"><img src="/icons/streak.webp" alt="" /><span><b>Racha</b><strong>0 <small>días</small></strong></span></div>
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
          <StudyView />
        ) : active === 'Actividades' ? (
          <section className="activitiesView" aria-label="Panel de actividades">
            <div className="activitiesHeading"><div><span>HOY · {calendar.date || 'FECHA ACTUAL'}</span><h1>Actividades</h1><p>Pequeñas acciones, grandes resultados.</p></div><div className="dailyScore"><b>{doneActivities.length}/{activityItems.length}</b><span>completadas</span></div></div>
            <div className="activitySummary">
              <article><img src="/icons/streak.webp" alt="" /><span><small>Racha</small><b>0 días</b></span></article>
              <article><img src="/icons/xp.webp" alt="" /><span><small>XP de hoy</small><b>+{earnedXp}</b></span></article>
              <article><img src="/icons/habits.webp" alt="" /><span><small>Objetivo diario</small><b>{completion}%</b></span></article>
              <article><img src="/icons/pending.webp" alt="" /><span><small>Pendientes</small><b>{taskItems.length} activos</b></span></article>
            </div>
            <div className="activityBoard">
              <article className="activityBox habitsBox"><header><div><b>Hábitos de hoy</b><small>Marca lo que vayas completando</small></div><div className="boxActions"><strong>{doneActivities.length}/{activityItems.length}</strong><button onClick={() => openItemModal('habit')}>＋ Agregar hábito</button></div></header><div className="activityList">{activityItems.map(([name, detail, icon, xp], index) => <div className="activityRow" key={`${name}-${index}`}><button className={`activityCheck ${doneActivities.includes(index) ? 'done' : ''}`} onClick={() => toggleActivity(index)}><i>{doneActivities.includes(index) ? '✓' : ''}</i><img src={icon} alt="" /><span><b>{name}</b><small>{detail}</small></span><em>{xp}</em></button><button className="deleteHabit" onClick={() => setHabitToDelete(index)} aria-label={`Eliminar hábito ${name}`} title="Eliminar hábito">🗑</button></div>)}</div></article>
              <article className="activityBox pendingBox"><header><div><b>Pendientes prioritarios</b><small>Enfócate en lo importante</small></div><div className="boxActions"><strong>{doneTasks.length}/{taskItems.length}</strong><button onClick={() => openItemModal('task')}>＋ Agregar tarea</button></div></header><div className="pendingList">{taskItems.map(([name, description, difficulty, xp], index) => <button className={doneTasks.includes(index) ? 'done' : ''} onClick={() => toggleTask(index)} key={`${name}-${index}`}><i>{doneTasks.includes(index) ? '✓' : ''}</i><span><b>{name}</b><small>{description}</small></span><span className="taskMeta"><em className={`priority ${difficulty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>{difficulty}</em><small>{xp}</small></span></button>)}</div></article>
              <article className="activityBox statsBox"><header><div><b>▥ Estadísticas de hoy</b><small>Tu progreso en números</small></div></header><div className="todayStats"><div><span>✓ Hábitos</span><b>{doneActivities.length} / {activityItems.length}</b><i><em style={{width:`${completion}%`}} /></i><small>{completion}%</small></div><div><span>▣ Pendientes</span><b>{doneTasks.length} / {taskItems.length}</b><i><em style={{width:`${taskCompletion}%`}} /></i><small>{taskCompletion}%</small></div><div><span>✦ XP ganado</span><b>+{earnedXp}</b><i><em style={{width:`${Math.min(earnedXp / 3, 100)}%`}} /></i><small>{earnedXp} XP</small></div><div><span>★ Día completado</span><b>{dayCompletion}%</b><i><em style={{width:`${dayCompletion}%`}} /></i><small>{dayCompletion}%</small></div></div></article>
              <article className="activityBox weeklyBox"><header><div><b>Progreso semanal</b><small>{calendar.label} · hoy se actualiza al marcar hábitos</small></div><div className="weeklyActions"><strong>{completion}%</strong><button onClick={() => setShowHistory(true)}>Ver resumen</button></div></header><div className="weekChart">{liveWeekProgress.map((value, index) => <div className={`${index === calendar.todayIndex ? 'todayBar' : ''} ${index > calendar.todayIndex ? 'futureBar' : ''}`} key={index}><span><i style={{ height: `${value}%` }} /></span><b>{calendar.days[index].day}<small>{calendar.days[index].date}</small></b></div>)}</div></article>
              <article className="activityBox generalBox"><header><div><b>▰ Pendientes generales</b><small>Ideas, compras y recordatorios sin fecha · sin XP ni monedas</small></div><button onClick={() => openItemModal('reminder')}>＋ Agregar</button></header><div className="reminderList">{reminderItems.map(([name, description, category], index) => <button className={doneReminders.includes(index) ? 'done' : ''} onClick={() => toggleReminder(index)} key={`${name}-${index}`}><i>{doneReminders.includes(index) ? '✓' : ''}</i><span><b>{name}</b><small>{description}</small></span><em className={`reminderTag ${category.toLowerCase()}`}>{category}</em><strong>⋮</strong></button>)}</div></article>
            </div>
          </section>
        ) : active === 'Perfil' ? (
          <section className="profileView" aria-label="Perfil y requisitos del siguiente nivel">
            <div className="profileHeading"><div><span>♕ MI NIVEL</span><h1>Tu siguiente etapa</h1><p>Completa los requisitos para desbloquear el próximo nivel.</p></div><div className={`profileMedal ${levelTier}`}><small>NIVEL</small><b>{level}</b></div></div>
            <article className="levelUnlockCard">
              <div className="unlockGlow" aria-hidden="true">◇</div>
              <header><span>⌃ SIGUIENTE NIVEL</span><h2>NIVEL {level} <em>→</em> NIVEL {nextLevel}</h2></header>
              <div className="requirementList">{profileRequirements.map((item) => <div className={`requirement ${item.tone}`} key={item.label}><i>{item.icon}</i><span><b>{item.label}</b><small>{item.current} / {item.target}</small><strong><em style={{ width: `${item.progress}%` }} /></strong></span>{item.progress >= 100 ? <mark>✓</mark> : <mark>{item.progress}%</mark>}</div>)}</div>
            </article>
            <div className="profileBottom">
              <article className="missingCard"><span>TE FALTA:</span><p><i>$</i><b>{formatMoney(Math.max(0, 1_000_000 - totalWorth))} de patrimonio</b></p><p><i>✦</i><b>{Math.max(0, 3500 - earnedXp).toLocaleString('es-MX')} XP</b></p></article>
              <article className="rewardCard"><span>AL COMPLETAR TODOS LOS REQUISITOS</span><b>♕</b><h3>NIVEL DESBLOQUEADO</h3><p>Tu progreso queda guardado para siempre.</p><small>▣ Nivel guardado permanentemente</small></article>
            </div>
            <section className="moneyPanel" aria-label="Resumen de dinero y patrimonio">
              <header><div><span>▱</span><h2>MI DINERO</h2><p>Resumen simple de tu dinero y patrimonio.</p></div><b>♨</b></header>
              <div className="moneyTotals"><article><span>▣ PATRIMONIO TOTAL</span><b>{formatMoney(totalWorth)}</b><small>MXN</small><em>Incluye patrimonio</em></article><article><span>▤ DISPONIBLE</span><b>{formatMoney(cash)}</b><small>MXN</small><em>Dinero actual</em></article><article><span>◇ PATRIMONIO</span><b>{formatMoney(assetsTotal)}</b><small>MXN</small><em>Valor de activos</em></article></div>
              <div className="moneyActions"><button onClick={() => openMoneyModal('income')}><i>＋</i><span><b>INGRESO DEL MES</b><small>Registra tu ingreso</small></span></button><button onClick={() => openMoneyModal('expense')}><i>−</i><span><b>GASTO DEL MES</b><small>Registra tus gastos</small></span></button><button onClick={() => openMoneyModal('balance')}><i>↗</i><span><b>AJUSTAR DINERO ACTUAL</b><small>Actualiza tu saldo</small></span></button></div>
              <div className="moneyGrid"><article className="monthSummary"><header><b>▥ RESUMEN DEL MES</b><button onClick={() => openMoneyModal('transactions')}>Ver todo</button></header><p><span>Ingreso del mes</span><strong>{formatMoney(monthlyIncome)} ↑</strong></p><p><span>Gasto del mes</span><strong>−{formatMoney(monthlyExpense)} ↓</strong></p><p><span>Balance mensual</span><strong>{formatMoney(monthlyIncome - monthlyExpense)}</strong></p><p className="cashRow"><span>Dinero actual</span><strong>{formatMoney(cash)}</strong></p></article><article className="assetsSummary"><header><b>◇ PATRIMONIO <small>(tus activos suman a tu riqueza)</small></b><button onClick={() => openMoneyModal('assets')}>Ver todo</button></header>{moneyAssets.length ? moneyAssets.slice(0, 3).map((asset) => <p key={asset.id}><i>◇</i><span><b>{asset.name}</b><small>{asset.detail}</small></span><strong>{formatMoney(asset.value)} <small>MXN</small></strong></p>) : <p className="emptyMoney">Aún no has registrado patrimonio.</p>}<button className="addAsset" onClick={() => openMoneyModal('asset')}>＋ Agregar patrimonio</button></article></div>
              <article className="moneyChart"><header><b>▥ DINERO GANADO {now.getFullYear()}</b><strong>▲ +{formatMoney(annualIncome)} este año</strong></header><div className="chartBars">{monthlyChart.map((value, index) => <i style={{height:`${value ? Math.max(4, value / chartMax * 100) : 0}%`}} key={index}><b>{formatMoney(value)}</b>{value > 0 && <span />}</i>)}</div><div className="chartMonths">{['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map((month) => <span key={month}>{month}</span>)}</div></article>
            </section>
          </section>
        ) : (
          <>
            <section className="hero coverHero" style={{ backgroundImage: `url(${cover})` }} aria-label={completed ? 'Pantalla final del recorrido' : `Portada del nivel ${level}: ${levelNames[level - 1]}`}>
              <div className="coverShade" />
              <button className="coverArrow left" onClick={() => completed ? setCompleted(false) : setLevel(Math.max(1, level - 1))} disabled={level === 1 && !completed} aria-label={completed ? 'Volver al nivel 40' : 'Nivel anterior'}>‹</button>
              <div className="coverInfo"><span>{completed ? 'RECORRIDO COMPLETADO' : `NIVEL ${level} DE 40`}</span><b>{completed ? 'Felicidades, has ganado en la vida' : levelNames[level - 1]}</b></div>
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

        {moneyModal && <div className="modalBackdrop" role="presentation" onMouseDown={() => setMoneyModal(null)}><section className="itemModal moneyModal" role="dialog" aria-modal="true" aria-label="Registro de dinero" onMouseDown={(event) => event.stopPropagation()}><header><div><span>MI DINERO</span><h2>{moneyModal === 'income' ? 'Registrar ingreso' : moneyModal === 'expense' ? 'Registrar gasto' : moneyModal === 'balance' ? 'Ajustar dinero actual' : moneyModal === 'asset' ? 'Agregar patrimonio' : moneyModal === 'transactions' ? 'Todos los movimientos' : 'Todo mi patrimonio'}</h2></div><button onClick={() => setMoneyModal(null)} aria-label="Cerrar">×</button></header>{moneyModal === 'transactions' ? <div className="moneyDetailList">{moneyTransactions.length ? moneyTransactions.map((item) => <article key={item.id}><span><b>{item.concept}</b><small>{new Date(item.date).toLocaleDateString('es-MX')}</small></span><strong className={item.type}>{item.type === 'expense' ? '−' : '+'}{formatMoney(item.amount)}</strong></article>) : <p>No hay movimientos todavía.</p>}</div> : moneyModal === 'assets' ? <div className="moneyDetailList">{moneyAssets.length ? moneyAssets.map((asset) => <article key={asset.id}><span><b>{asset.name}</b><small>{asset.detail}</small></span><strong>{formatMoney(asset.value)}</strong></article>) : <p>No hay patrimonio registrado todavía.</p>}</div> : <><label>{moneyModal === 'asset' ? 'Nombre del patrimonio' : moneyModal === 'balance' ? 'Nota (opcional)' : 'Concepto'}<input autoFocus value={moneyConcept} onChange={(event) => setMoneyConcept(event.target.value)} placeholder={moneyModal === 'asset' ? 'Ej. Ahorros' : 'Ej. Venta del mes'} /></label><label>Cantidad MXN<input type="number" min="0" step="100" value={moneyAmount} onChange={(event) => setMoneyAmount(event.target.value)} placeholder="$0" /></label><button className="saveItem" onClick={saveMoney}>Guardar registro</button></>}</section></div>}
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
