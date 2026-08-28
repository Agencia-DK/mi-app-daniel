'use client';

import { useState } from 'react';

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
  const [ideas, setIdeas] = useState(12);

  return (
    <main className="stage">
      <section className="dashboard" aria-label="Panel de progreso personal">
        <header className="topbar">
          <div className="profile"><div className="avatar">D</div><div><strong>DANIEL</strong><span>Nivel 27 <i /></span></div></div>
          <div className="topStats"><div><b>XP</b><strong>2,450</strong></div><div><b>Monedas</b><strong>3,800</strong></div></div>
        </header>

        <div className="hero">
          <aside className="streak"><span>RACHA</span><b>🔥 28</b><small>días</small></aside>
          <div className="room" aria-hidden="true"><div className="shelf shelfOne">◈　▣　✦</div><div className="shelf shelfTwo">♜　◇　♛</div><div className="desk">▰ ▰ ▰</div></div>
          <div className="character" aria-label="Avatar de Daniel"><div className="hair">♠</div><div className="face">•‿•</div><div className="body">D</div><div className="legs">╱ ╲</div></div>
          <aside className="motto"><span>✧</span><b>ENFOQUE<br/>DISCIPLINA<br/>LIBERTAD</b></aside>
        </div>

        <section className="skills" aria-label="Habilidades">
          {skills.map(([name, value, width, icon], index) => <article className="skill" key={name}><div><span className={`dot c${index}`}>{icon}</span>{name}<small>Nivel 2{index + 3}</small></div><div className="bar"><i style={{ width }} /></div><p>{value}</p></article>)}
        </section>

        <section className="lower">
          <div className="today"><div className="sectionTitle"><b>HOY</b><span>Jueves, 27 de agosto</span></div><div className="habitGrid">
            {habits.map(([name, value, icon, color]) => <article className="habit" key={name}><span className={color}>{icon}</span><div><small>{name}</small><b>{value}</b></div></article>)}
          </div></div>
          <article className="mission"><div className="sectionTitle"><b>MISIÓN PRINCIPAL</b></div><h2>Convertirme en<br/>Creative Strategist</h2><div className="missionBody"><ul><li>Diseño visual</li><li>Psicología del consumidor</li></ul><div className="crystal">◆</div></div></article>
        </section>

        <nav className="nav" aria-label="Navegación principal">
          {['Inicio', 'Misiones'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Inicio' ? '⌂' : '◎'}</span>{item}</button>)}
          <button className="idea" onClick={() => setIdeas(ideas + 1)} aria-label="Añadir idea"><b>＋</b>IDEA <em>{ideas}</em></button>
          {['Progreso', 'Perfil'].map((item) => <button className={active === item ? 'active' : ''} onClick={() => setActive(item)} key={item}><span>{item === 'Progreso' ? '▥' : '♙'}</span>{item}</button>)}
        </nav>
      </section>
    </main>
  );
}
