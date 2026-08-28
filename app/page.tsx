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
  const [ideas, setIdeas] = useState(12);
  const cover = `/levels/level-${String(level).padStart(2, '0')}.webp`;

  const chooseLevel = (next: number) => {
    if (next > 10) return;
    setLevel(next);
    setActive('Inicio');
  };

  return (
    <main className="stage">
      <section className="dashboard" aria-label="Panel de progreso personal">
        <header className="topbar">
          <div className="profile"><div className="avatar">D</div><div><strong>DANIEL</strong><span>Nivel {level} <i /></span></div></div>
          <div className="topStats"><div><b>XP</b><strong>2,450</strong></div><div><b>Monedas</b><strong>3,800</strong></div></div>
        </header>

        {active === 'Misiones' ? (
          <section className="levelsView" aria-label="Portadas de niveles">
            <div className="levelsHeading"><div><span>RECORRIDO</span><h1>40 niveles</h1></div><p>10 portadas disponibles · 30 por descubrir</p></div>
            <div className="levelGrid">
              {Array.from({ length: 40 }, (_, index) => {
                const number = index + 1;
                const unlocked = number <= 10;
                return <button className={`levelCard ${unlocked ? '' : 'locked'} ${level === number ? 'selected' : ''}`} onClick={() => chooseLevel(number)} disabled={!unlocked} key={number} aria-label={unlocked ? `Abrir nivel ${number}: ${levelNames[index]}` : `Nivel ${number} bloqueado`}>
                  {unlocked && <img src={`/levels/level-${String(number).padStart(2, '0')}.webp`} alt="" />}
                  <span>{unlocked ? `NIVEL ${number}` : '🔒'}</span><b>{unlocked ? levelNames[index] : `Nivel ${number}`}</b>
                </button>;
              })}
            </div>
          </section>
        ) : (
          <>
            <section className="hero coverHero" style={{ backgroundImage: `url(${cover})` }} aria-label={`Portada del nivel ${level}: ${levelNames[level - 1]}`}>
              <div className="coverShade" />
              <button className="coverArrow left" onClick={() => setLevel(Math.max(1, level - 1))} disabled={level === 1} aria-label="Nivel anterior">‹</button>
              <div className="coverInfo"><span>NIVEL {level} DE 40</span><b>{levelNames[level - 1]}</b></div>
              <button className="coverArrow right" onClick={() => setLevel(Math.min(10, level + 1))} disabled={level === 10} aria-label="Nivel siguiente">›</button>
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
