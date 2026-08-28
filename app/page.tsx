'use client';

import { useEffect, useState } from 'react';

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

export default function Home() {
  const [active, setActive] = useState('HOME');
  const [level, setLevel] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [ideaItems, setIdeaItems] = useState(initialIdeas);
  const [newIdea, setNewIdea] = useState('');
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [doneActivities, setDoneActivities] = useState([0, 2, 4]);
  const [doneTasks, setDoneTasks] = useState([1]);
  const [activityItems, setActivityItems] = useState(dailyActivities);
  const [taskItems, setTaskItems] = useState(pendingActivities);
  const [reminderItems, setReminderItems] = useState(initialReminders);
  const [doneReminders, setDoneReminders] = useState<number[]>([]);
  const [modalType, setModalType] = useState<'habit' | 'task' | 'reminder' | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemXp, setItemXp] = useState('5');
  const [itemCategory, setItemCategory] = useState('Compras');
  const [calendar, setCalendar] = useState({ label: 'Esta semana', date: '', todayIndex: 0, days: ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => ({ day, date: '' })) });
  const levelCover = `/levels/level-${String(level).padStart(2, '0')}.webp`;
  const cover = completed ? '/levels/victory.webp' : levelCover;
  const levelTier = level >= 30 ? 'gold' : level >= 15 ? 'silver' : 'bronze';
  const levelTierLabel = level >= 30 ? 'oro' : level >= 15 ? 'plata' : 'bronce';
  const completion = activityItems.length ? Math.round(doneActivities.length / activityItems.length * 100) : 0;
  const taskCompletion = taskItems.length ? Math.round(doneTasks.length / taskItems.length * 100) : 0;
  const earnedXp = doneActivities.reduce((total, index) => total + Number(activityItems[index]?.[3].replace(/\D/g, '') || 0), 0) + doneTasks.reduce((total, index) => total + Number(taskItems[index]?.[3].replace(/\D/g, '') || 0), 0);
  const dayCompletion = Math.round((completion + taskCompletion) / 2);
  const liveWeekProgress = weekProgress.map((value, index) => index === calendar.todayIndex ? completion : value);

  useEffect(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const dayLetters = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const days = dayLetters.map((day, index) => { const date = new Date(monday); date.setDate(monday.getDate() + index); return { day, date: String(date.getDate()) }; });
    setCalendar({ label: now.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }), date: now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }), todayIndex: (now.getDay() + 6) % 7, days });
  }, []);

  const chooseLevel = (next: number) => {
    if (next > 40) return;
    setLevel(next);
    setCompleted(false);
    setActive('HOME');
  };

  const toggleActivity = (index: number) => setDoneActivities((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  const toggleTask = (index: number) => setDoneTasks((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  const toggleReminder = (index: number) => setDoneReminders((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
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

  return (
    <main className="stage">
      <section className="dashboard" aria-label="Panel de progreso personal">
        <header className="topbar">
          <div className="profile"><div className={`avatar ${levelTier}`} role="img" aria-label={`Nivel ${level}, categoría ${levelTierLabel}`}><b>{level}</b></div><div><strong>DANIEL</strong><span>Nivel {level} <i /></span></div></div>
          <div className="topStats">
            <div className="statCard"><img src="/icons/xp.webp" alt="" /><span><b>XP</b><strong>2,450</strong></span></div>
            <div className="statCard"><img src="/icons/coins.webp" alt="" /><span><b>Monedas</b><strong>3,800</strong></span></div>
            <div className="statCard streakCard"><img src="/icons/streak.webp" alt="" /><span><b>Racha</b><strong>28 <small>días</small></strong></span></div>
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
        ) : active === 'Misiones' ? (
          <section className="levelsView" aria-label="Portadas de niveles">
            <div className="levelsHeading"><div><span>RECORRIDO</span><h1>40 niveles</h1></div><p>40 portadas disponibles · recorrido completo</p></div>
            <div className="levelGrid">
              {Array.from({ length: 40 }, (_, index) => {
                const number = index + 1;
                const unlocked = number <= 40;
                return <button className={`levelCard ${unlocked ? '' : 'locked'} ${level === number ? 'selected' : ''}`} onClick={() => chooseLevel(number)} disabled={!unlocked} key={number} aria-label={unlocked ? `Abrir nivel ${number}: ${levelNames[index]}` : `Nivel ${number} bloqueado`}>
                  {unlocked && <img src={`/levels/level-${String(number).padStart(2, '0')}.webp`} alt="" />}
                  <span>{unlocked ? `NIVEL ${number}` : '🔒'}</span><b>{unlocked ? levelNames[index] : `Nivel ${number}`}</b>
                </button>;
              })}
            </div>
          </section>
        ) : active === 'Actividades' ? (
          <section className="activitiesView" aria-label="Panel de actividades">
            <div className="activitiesHeading"><div><span>HOY · {calendar.date || 'FECHA ACTUAL'}</span><h1>Actividades</h1><p>Pequeñas acciones, grandes resultados.</p></div><div className="dailyScore"><b>{doneActivities.length}/{activityItems.length}</b><span>completadas</span></div></div>
            <div className="activitySummary">
              <article><img src="/icons/streak.webp" alt="" /><span><small>Racha</small><b>28 días</b></span></article>
              <article><img src="/icons/xp.webp" alt="" /><span><small>XP de hoy</small><b>+420</b></span></article>
              <article><img src="/icons/habits.webp" alt="" /><span><small>Objetivo diario</small><b>{completion}%</b></span></article>
              <article><img src="/icons/pending.webp" alt="" /><span><small>Pendientes</small><b>{taskItems.length} activos</b></span></article>
            </div>
            <div className="activityBoard">
              <article className="activityBox habitsBox"><header><div><b>Hábitos de hoy</b><small>Marca lo que vayas completando</small></div><div className="boxActions"><strong>{doneActivities.length}/{activityItems.length}</strong><button onClick={() => openItemModal('habit')}>＋ Agregar hábito</button></div></header><div className="activityList">{activityItems.map(([name, detail, icon, xp], index) => <button className={doneActivities.includes(index) ? 'done' : ''} onClick={() => toggleActivity(index)} key={`${name}-${index}`}><i>{doneActivities.includes(index) ? '✓' : ''}</i><img src={icon} alt="" /><span><b>{name}</b><small>{detail}</small></span><em>{xp}</em></button>)}</div></article>
              <article className="activityBox pendingBox"><header><div><b>Pendientes prioritarios</b><small>Enfócate en lo importante</small></div><div className="boxActions"><strong>{doneTasks.length}/{taskItems.length}</strong><button onClick={() => openItemModal('task')}>＋ Agregar tarea</button></div></header><div className="pendingList">{taskItems.map(([name, description, difficulty, xp], index) => <button className={doneTasks.includes(index) ? 'done' : ''} onClick={() => toggleTask(index)} key={`${name}-${index}`}><i>{doneTasks.includes(index) ? '✓' : ''}</i><span><b>{name}</b><small>{description}</small></span><span className="taskMeta"><em className={`priority ${difficulty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>{difficulty}</em><small>{xp}</small></span></button>)}</div></article>
              <article className="activityBox statsBox"><header><div><b>▥ Estadísticas de hoy</b><small>Tu progreso en números</small></div><button>Ver detalles →</button></header><div className="todayStats"><div><span>✓ Hábitos</span><b>{doneActivities.length} / {activityItems.length}</b><i><em style={{width:`${completion}%`}} /></i><small>{completion}%</small></div><div><span>▣ Pendientes</span><b>{doneTasks.length} / {taskItems.length}</b><i><em style={{width:`${taskCompletion}%`}} /></i><small>{taskCompletion}%</small></div><div><span>✦ XP ganado</span><b>+{earnedXp}</b><i><em style={{width:`${Math.min(earnedXp / 3, 100)}%`}} /></i><small>{earnedXp} XP</small></div><div><span>★ Día completado</span><b>{dayCompletion}%</b><i><em style={{width:`${dayCompletion}%`}} /></i><small>{dayCompletion}%</small></div></div></article>
              <article className="activityBox weeklyBox"><header><div><b>Progreso semanal</b><small>{calendar.label} · hoy se actualiza al marcar hábitos</small></div><strong>{completion}%</strong></header><div className="weekChart">{liveWeekProgress.map((value, index) => <div className={index === calendar.todayIndex ? 'todayBar' : ''} key={index}><span><i style={{ height: `${value}%` }} /></span><b>{calendar.days[index].day}<small>{calendar.days[index].date}</small></b></div>)}</div></article>
              <article className="activityBox generalBox"><header><div><b>▰ Pendientes generales</b><small>Ideas, compras y recordatorios sin fecha · sin XP ni monedas</small></div><button onClick={() => openItemModal('reminder')}>＋ Agregar</button></header><div className="reminderList">{reminderItems.map(([name, description, category], index) => <button className={doneReminders.includes(index) ? 'done' : ''} onClick={() => toggleReminder(index)} key={`${name}-${index}`}><i>{doneReminders.includes(index) ? '✓' : ''}</i><span><b>{name}</b><small>{description}</small></span><em className={`reminderTag ${category.toLowerCase()}`}>{category}</em><strong>⋮</strong></button>)}</div></article>
            </div>
          </section>
        ) : (
          <>
            <section className="hero coverHero" style={{ backgroundImage: `url(${cover})` }} aria-label={completed ? 'Pantalla final del recorrido' : `Portada del nivel ${level}: ${levelNames[level - 1]}`}>
              <div className="coverShade" />
              <button className="coverArrow left" onClick={() => completed ? setCompleted(false) : setLevel(Math.max(1, level - 1))} disabled={level === 1 && !completed} aria-label={completed ? 'Volver al nivel 40' : 'Nivel anterior'}>‹</button>
              <div className="coverInfo"><span>{completed ? 'RECORRIDO COMPLETADO' : `NIVEL ${level} DE 40`}</span><b>{completed ? 'Felicidades, has ganado en la vida' : levelNames[level - 1]}</b></div>
              <button className="coverArrow right" onClick={() => level === 40 ? setCompleted(true) : setLevel(level + 1)} disabled={completed} aria-label={level === 40 ? 'Ver final' : 'Nivel siguiente'}>›</button>
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

        {modalType && <div className="modalBackdrop" role="presentation" onMouseDown={() => setModalType(null)}><section className="itemModal" role="dialog" aria-modal="true" aria-label={modalType === 'habit' ? 'Agregar hábito' : 'Agregar pendiente'} onMouseDown={(event) => event.stopPropagation()}><header><div><span>{modalType === 'habit' ? 'NUEVO HÁBITO' : modalType === 'task' ? 'NUEVA TAREA' : 'NUEVO RECORDATORIO'}</span><h2>{modalType === 'habit' ? 'Agregar hábito' : modalType === 'task' ? 'Agregar pendiente' : 'Pendiente general'}</h2></div><button onClick={() => setModalType(null)} aria-label="Cerrar">×</button></header><label>{modalType === 'habit' ? 'Hábito' : 'Tarea'}<input autoFocus value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder={modalType === 'habit' ? 'Ej. Ir al gimnasio' : 'Ej. Llamar a proveedor'} /></label><label>Descripción {modalType === 'habit' && <small>Máximo 3 palabras</small>}<input value={itemDescription} onChange={(event) => setItemDescription(modalType === 'habit' ? event.target.value.split(/\s+/).slice(0, 3).join(' ') : event.target.value)} placeholder="Detalle breve" /></label>{modalType === 'reminder' ? <fieldset><legend>Categoría</legend><div className="categoryOptions">{reminderCategories.map((category) => <button className={itemCategory === category ? 'selected' : ''} onClick={() => setItemCategory(category)} key={category}>{category}</button>)}</div><p className="noReward">Este recordatorio no otorga XP ni monedas.</p></fieldset> : <fieldset><legend>Valor XP</legend><div className="xpOptions">{(modalType === 'habit' ? habitXp : taskXp).map(([xp, label]) => <button className={itemXp === xp ? 'selected' : ''} onClick={() => setItemXp(xp)} key={xp}><b>{xp} XP</b><span>{label}</span></button>)}</div></fieldset>}<button className="saveItem" onClick={saveItem}>Guardar {modalType === 'habit' ? 'hábito' : modalType === 'task' ? 'tarea' : 'recordatorio'}</button></section></div>}

        <nav className="nav" aria-label="Navegación principal">
          {['Ideas', 'Misiones'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Ideas' ? '✦' : '◎'}</span>{item}</button>)}
          <button className={`homeButton ${active === 'HOME' ? 'active' : ''}`} onClick={() => setActive('HOME')} aria-label="Ir a la página principal"><span>⌂</span>HOME</button>
          {['Actividades', 'Perfil'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Actividades' ? '▦' : '♙'}</span>{item}</button>)}
        </nav>
      </section>
    </main>
  );
}
