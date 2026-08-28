'use client';

import { useState } from 'react';

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
  ['Terminar propuesta', 'Trabajo', 'Alta'],
  ['Revisar campaña', 'Negocios', 'Alta'],
  ['Responder mensajes', 'Personal', 'Media'],
  ['Preparar contenido', 'Estudio', 'Media'],
  ['Organizar escritorio', 'Hábitos', 'Baja'],
];

const weekProgress = [65, 80, 55, 90, 72, 45, 30];

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
  const levelCover = `/levels/level-${String(level).padStart(2, '0')}.webp`;
  const cover = completed ? '/levels/victory.webp' : levelCover;
  const levelTier = level >= 30 ? 'gold' : level >= 15 ? 'silver' : 'bronze';
  const levelTierLabel = level >= 30 ? 'oro' : level >= 15 ? 'plata' : 'bronce';

  const chooseLevel = (next: number) => {
    if (next > 40) return;
    setLevel(next);
    setCompleted(false);
    setActive('HOME');
  };

  const toggleActivity = (index: number) => setDoneActivities((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
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
            <div className="activitiesHeading"><div><span>HOY · 28 DE AGOSTO</span><h1>Actividades</h1><p>Pequeñas acciones, grandes resultados.</p></div><div className="dailyScore"><b>{doneActivities.length}/{dailyActivities.length}</b><span>completadas</span></div></div>
            <div className="activitySummary">
              <article><img src="/icons/streak.webp" alt="" /><span><small>Racha</small><b>28 días</b></span></article>
              <article><img src="/icons/xp.webp" alt="" /><span><small>XP de hoy</small><b>+420</b></span></article>
              <article><img src="/icons/habits.webp" alt="" /><span><small>Objetivo diario</small><b>{Math.round(doneActivities.length / dailyActivities.length * 100)}%</b></span></article>
              <article><img src="/icons/pending.webp" alt="" /><span><small>Pendientes</small><b>5 activos</b></span></article>
            </div>
            <div className="activityBoard">
              <article className="activityBox habitsBox"><header><div><b>Hábitos de hoy</b><small>Marca lo que vayas completando</small></div><strong>{doneActivities.length}/{dailyActivities.length}</strong></header><div className="activityList">{dailyActivities.map(([name, detail, icon, xp], index) => <button className={doneActivities.includes(index) ? 'done' : ''} onClick={() => toggleActivity(index)} key={name}><i>{doneActivities.includes(index) ? '✓' : ''}</i><img src={icon} alt="" /><span><b>{name}</b><small>{detail}</small></span><em>{xp}</em></button>)}</div></article>
              <article className="activityBox pendingBox"><header><div><b>Pendientes prioritarios</b><small>Enfócate en lo importante</small></div><strong>5</strong></header><div className="pendingList">{pendingActivities.map(([name, category, priority]) => <div key={name}><i /><span><b>{name}</b><small>{category}</small></span><em className={`priority ${priority.toLowerCase()}`}>{priority}</em></div>)}</div></article>
              <article className="activityBox weeklyBox"><header><div><b>Progreso semanal</b><small>Tu constancia día a día</small></div><strong>72%</strong></header><div className="weekChart">{weekProgress.map((value, index) => <div key={index}><span><i style={{ height: `${value}%` }} /></span><b>{['L','M','X','J','V','S','D'][index]}</b></div>)}</div></article>
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

        <nav className="nav" aria-label="Navegación principal">
          {['Ideas', 'Misiones'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Ideas' ? '✦' : '◎'}</span>{item}</button>)}
          <button className={`homeButton ${active === 'HOME' ? 'active' : ''}`} onClick={() => setActive('HOME')} aria-label="Ir a la página principal"><span>⌂</span>HOME</button>
          {['Actividades', 'Perfil'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Actividades' ? '▦' : '♙'}</span>{item}</button>)}
        </nav>
      </section>
    </main>
  );
}
