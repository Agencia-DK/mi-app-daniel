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
  ['Finanzas', '1,870 / 2,500', '75%', '€'],
  ['Conocimiento', '2,150 / 2,800', '77%', '▣'],
  ['Salud', '1,920 / 2,600', '74%', '♥'],
  ['Disciplina', '2,400 / 2,900', '83%', '◷'],
  ['Negocios', '1,600 / 2,300', '70%', '◆'],
];

const habits = [
  ['Hábitos', '6/8', '✓', 'green'],
  ['Pendientes', '4/7', '!', 'amber'],
  ['Estudio', '1h 20m', '▥', 'blue'],
  ['Trabajo', '3h 40m', '✦', 'purple'],
  ['Ejercicio', '45m', '⌁', 'green'],
];

export default function Home() {
  const [active, setActive] = useState('Inicio');
  const [level, setLevel] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [ideas, setIdeas] = useState(12);
  const levelCover = `/levels/level-${String(level).padStart(2, '0')}.webp`;
  const cover = completed ? '/levels/victory.webp' : levelCover;
  const levelTier = level >= 30 ? 'gold' : level >= 15 ? 'silver' : 'bronze';
  const levelTierLabel = level >= 30 ? 'oro' : level >= 15 ? 'plata' : 'bronce';

  const chooseLevel = (next: number) => {
    if (next > 40) return;
    setLevel(next);
    setCompleted(false);
    setActive('Inicio');
  };

  return (
    <main className="stage">
      <section className="dashboard" aria-label="Panel de progreso personal">
        <header className="topbar">
          <div className="profile"><div className={`avatar ${levelTier}`} role="img" aria-label={`Nivel ${level}, categoría ${levelTierLabel}`}><b>{level}</b></div><div><strong>DANIEL</strong><span>Nivel {level} <i /></span></div></div>
          <div className="topStats"><div><b>XP</b><strong>2,450</strong></div><div><b>Monedas</b><strong>3,800</strong></div></div>
        </header>

        {active === 'Misiones' ? (
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
        ) : (
          <>
            <section className="hero coverHero" style={{ backgroundImage: `url(${cover})` }} aria-label={completed ? 'Pantalla final del recorrido' : `Portada del nivel ${level}: ${levelNames[level - 1]}`}>
              <div className="coverShade" />
              <button className="coverArrow left" onClick={() => completed ? setCompleted(false) : setLevel(Math.max(1, level - 1))} disabled={level === 1 && !completed} aria-label={completed ? 'Volver al nivel 40' : 'Nivel anterior'}>‹</button>
              <div className="coverInfo"><span>{completed ? 'RECORRIDO COMPLETADO' : `NIVEL ${level} DE 40`}</span><b>{completed ? 'Felicidades, has ganado en la vida' : levelNames[level - 1]}</b></div>
              <button className="coverArrow right" onClick={() => level === 40 ? setCompleted(true) : setLevel(level + 1)} disabled={completed} aria-label={level === 40 ? 'Ver final' : 'Nivel siguiente'}>›</button>
            </section>

            <section className="skills" aria-label="Habilidades">
              {skills.map(([name, value, width, icon], index) => <article className="skill" key={name}><div><span className={`dot c${index}`}>{icon}</span>{name}<small>Nivel 2{index + 3}</small></div><div className="bar"><i style={{ width }} /></div><p>{value}</p></article>)}
            </section>

            <section className="lower">
              <div className="today"><div className="sectionTitle"><b>HOY</b><span>Jueves, 27 de agosto</span></div><div className="habitGrid">{habits.map(([name, value, icon, color]) => <article className="habit" key={name}><span className={color}>{icon}</span><div><small>{name}</small><b>{value}</b></div></article>)}</div></div>
              <article className="mission"><div className="sectionTitle"><b>MISIÓN PRINCIPAL</b></div><h2>Convertirme en<br/>Creative Strategist</h2><div className="missionBody"><ul><li>Diseño visual</li><li>Psicología del consumidor</li></ul><div className="crystal">◆</div></div></article>
            </section>
          </>
        )}

        <nav className="nav" aria-label="Navegación principal">
          {['Inicio', 'Misiones'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Inicio' ? '⌂' : '◎'}</span>{item}</button>)}
          <button className="idea" onClick={() => setIdeas(ideas + 1)} aria-label="Añadir idea"><b>＋</b>IDEA <em>{ideas}</em></button>
          {['Progreso', 'Perfil'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Progreso' ? '▥' : '♙'}</span>{item}</button>)}
        </nav>
      </section>
    </main>
  );
}
