'use client';

import { useEffect, useState } from 'react';

const STATUSES = ['Nueva', 'En análisis', 'En desarrollo', 'Pausada', 'Descartada', 'Completada'] as const;
const POTENTIALS = ['Bajo', 'Medio', 'Alto'] as const;
const DEFAULT_CATEGORIES = ['Software', 'Servicios', 'Inmobiliario', 'Comercio', 'Contenido', 'Turismo', 'Salud', 'Otros'];
const STORAGE = 'daniel-os-ideas-v2';
const CATEGORY_STORAGE = 'daniel-os-idea-categories-v2';
const DRAFT_STORAGE = 'daniel-os-idea-draft-v1';

type Status = typeof STATUSES[number];
type Potential = typeof POTENTIALS[number];
type Idea = {
  id: string; name: string; description: string; category: string; tags: string[]; status: Status;
  createdAt: string; notes: string; potential: Potential; investment: string; favorite: boolean; image: string;
  problem: string; customer: string; revenue: string; competition: string; advantages: string; risks: string; nextSteps: string;
};

const blankIdea = (): Idea => ({
  id: crypto.randomUUID(), name: '', description: '', category: 'Software', tags: [], status: 'Nueva',
  createdAt: new Date().toISOString().slice(0, 10), notes: '', potential: 'Medio', investment: '', favorite: false, image: '',
  problem: '', customer: '', revenue: '', competition: '', advantages: '', risks: '', nextSteps: '',
});

const formatDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
const potentialRank = { Bajo: 1, Medio: 2, Alto: 3 };

export default function IdeasView({ onCountChange }: { onCountChange: (count: number) => void }) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todas');
  const [category, setCategory] = useState('Todas');
  const [potential, setPotential] = useState('Todos');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [date, setDate] = useState('');
  const [sort, setSort] = useState('recent');
  const [editing, setEditing] = useState<Idea | null>(null);
  const [tagText, setTagText] = useState('');
  const [menu, setMenu] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    try {
      setIdeas(JSON.parse(localStorage.getItem(STORAGE) || '[]'));
      setCategories(JSON.parse(localStorage.getItem(CATEGORY_STORAGE) || 'null') || DEFAULT_CATEGORIES);
      const draft = JSON.parse(localStorage.getItem(DRAFT_STORAGE) || 'null') as Idea | null;
      if (draft) { setEditing(draft); setTagText(draft.tags.join(', ')); }
    } catch { /* ponytail: invalid local data starts clean. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE, JSON.stringify(ideas));
    localStorage.setItem(CATEGORY_STORAGE, JSON.stringify(categories));
    onCountChange(ideas.length);
  }, [ready, ideas, categories, onCountChange]);

  useEffect(() => {
    if (!ready || !editing) return;
    localStorage.setItem(DRAFT_STORAGE, JSON.stringify(editing));
    if (!editing.name.trim()) return;
    setIdeas((items) => items.some((item) => item.id === editing.id) ? items.map((item) => item.id === editing.id ? editing : item) : [editing, ...items]);
    if (!categories.includes(editing.category)) setCategories((items) => [...items, editing.category]);
  }, [ready, editing, categories]);

  const counts = Object.fromEntries(STATUSES.map((item) => [item, ideas.filter((idea) => idea.status === item).length]));
  const visible = ideas.filter((idea) => {
    const text = `${idea.name} ${idea.description} ${idea.tags.join(' ')}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (status === 'Todas' || idea.status === status) &&
      (category === 'Todas' || idea.category === category) && (potential === 'Todos' || idea.potential === potential) &&
      (!favoritesOnly || idea.favorite) && (!date || idea.createdAt === date);
  }).sort((a, b) => sort === 'oldest' ? a.createdAt.localeCompare(b.createdAt) : sort === 'potential' ? potentialRank[b.potential] - potentialRank[a.potential] : b.createdAt.localeCompare(a.createdAt));
  const featured = ideas.find((idea) => idea.favorite);

  const openEditor = (idea = blankIdea()) => { setEditing({ ...idea }); setTagText(idea.tags.join(', ')); setMenu(null); };
  const save = () => {
    if (!editing?.name.trim()) return;
    const next = { ...editing, name: editing.name.trim(), tags: tagText.split(',').map((tag) => tag.trim()).filter(Boolean) };
    setIdeas((items) => items.some((item) => item.id === next.id) ? items.map((item) => item.id === next.id ? next : item) : [next, ...items]);
    if (!categories.includes(next.category)) setCategories((items) => [...items, next.category]);
    localStorage.removeItem(DRAFT_STORAGE);
    setEditing(null);
  };
  const update = <K extends keyof Idea>(key: K, value: Idea[K]) => setEditing((idea) => idea ? { ...idea, [key]: value } : idea);
  const changeStatus = (id: string, next: Status) => setIdeas((items) => items.map((idea) => idea.id === id ? { ...idea, status: next } : idea));
  const toggleFavorite = (id: string) => setIdeas((items) => items.map((idea) => ({ ...idea, favorite: idea.id === id ? !idea.favorite : idea.favorite })));
  const duplicate = (idea: Idea) => setIdeas((items) => [{ ...idea, id: crypto.randomUUID(), name: `${idea.name} (copia)`, createdAt: new Date().toISOString().slice(0, 10), favorite: false }, ...items]);
  const remove = (id: string) => setIdeas((items) => items.filter((idea) => idea.id !== id));
  const addCategory = () => { const value = newCategory.trim(); if (value && !categories.includes(value)) setCategories((items) => [...items, value]); setNewCategory(''); };
  const removeCategory = (item: string) => { if (!ideas.some((idea) => idea.category === item)) setCategories((items) => items.filter((categoryName) => categoryName !== item)); };

  return <section className="ideasView ideasWorkspace" aria-label="Panel de ideas de negocio">
    <header className="ideaToolbar">
      <div><span>💡</span><h1>Ideas</h1><p>Grandes ideas, grandes oportunidades.</p></div>
      <label className="ideaSearch">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ideas..." /></label>
      <button className="primaryIdeaButton" onClick={() => openEditor()}>＋ Nueva idea</button>
      <blockquote>“Una idea hoy,<br />puede ser tu mayor libertad mañana.”</blockquote>
    </header>

    <div className="ideaTabs">
      {['Todas', ...STATUSES].map((item) => <button className={status === item ? 'active' : ''} onClick={() => setStatus(item)} key={item}>{item}<b>{item === 'Todas' ? ideas.length : counts[item]}</b></button>)}
    </div>

    <div className="ideaControls">
      <select value={category} onChange={(event) => setCategory(event.target.value)}><option>Todas</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      <select value={potential} onChange={(event) => setPotential(event.target.value)}><option>Todos</option>{POTENTIALS.map((item) => <option key={item}>{item}</option>)}</select>
      <label><input type="checkbox" checked={favoritesOnly} onChange={(event) => setFavoritesOnly(event.target.checked)} /> ★ Favoritas</label>
      <input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filtrar por fecha" />
      <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar ideas"><option value="recent">Más recientes</option><option value="oldest">Más antiguas</option><option value="potential">Mayor potencial</option></select>
      <button onClick={() => { setCategory('Todas'); setPotential('Todos'); setFavoritesOnly(false); setDate(''); }}>Limpiar</button>
    </div>

    <div className="ideasLayout">
      <div className="ideaCardGrid">
        {visible.map((idea) => <article className={`ideaCard ${idea.favorite ? 'featured' : ''}`} key={idea.id} onClick={() => openEditor(idea)}>
          {idea.image ? <img src={idea.image} alt="" /> : <div className="ideaPlaceholder">💡</div>}
          <div className="ideaCardBody">
            <select className={`status ${idea.status.toLowerCase().replaceAll(' ', '-')}`} value={idea.status} onClick={(event) => event.stopPropagation()} onChange={(event) => changeStatus(idea.id, event.target.value as Status)}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
            <button className="ideaMenuButton" onClick={(event) => { event.stopPropagation(); setMenu(menu === idea.id ? null : idea.id); }}>⋮</button>
            {menu === idea.id && <div className="ideaMenu" onClick={(event) => event.stopPropagation()}><button onClick={() => openEditor(idea)}>Editar</button><button onClick={() => duplicate(idea)}>Duplicar</button><button onClick={() => toggleFavorite(idea.id)}>{idea.favorite ? 'Quitar destacada' : 'Destacar'}</button><button className="danger" onClick={() => remove(idea.id)}>Eliminar</button></div>}
            <h2>{idea.favorite && '★ '}{idea.name}</h2><p>{idea.description || 'Sin descripción.'}</p>
            <div className="ideaTags"><span>{idea.category}</span>{idea.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <footer><span>▣ {formatDate(idea.createdAt)}</span><b>Potencial {idea.potential}</b></footer>
          </div>
        </article>)}
        {!visible.length && <div className="emptyIdeas"><b>{ideas.length ? 'No hay coincidencias' : 'Tu próxima gran idea empieza aquí'}</b><p>{ideas.length ? 'Prueba otros filtros.' : 'Crea tu primera idea para comenzar.'}</p><button onClick={() => openEditor()}>＋ Nueva idea</button></div>}
      </div>

      <aside className="ideasAside">
        <section><header><b>💡 Resumen de ideas</b></header><div className="ideaStats"><article><b>{ideas.length}</b><span>Total</span></article><article><b>{counts['En desarrollo']}</b><span>En desarrollo</span></article><article><b>{counts['En análisis']}</b><span>En análisis</span></article><article><b>{counts.Pausada + counts.Descartada + counts.Completada + counts.Nueva}</b><span>Otras</span></article></div></section>
        <section><header><b>▣ Categorías</b><button onClick={() => setShowCategories(!showCategories)}>Gestionar →</button></header>{categories.map((item) => <p className="categoryCount" key={item}><span>{item}</span><b>{ideas.filter((idea) => idea.category === item).length}</b>{showCategories && <button disabled={ideas.some((idea) => idea.category === item)} onClick={() => removeCategory(item)}>×</button>}</p>)}{showCategories && <div className="addCategory"><input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addCategory()} placeholder="Nueva categoría" /><button onClick={addCategory}>＋</button></div>}</section>
        <section className="featuredIdea"><header><b>⭐ Idea destacada</b></header>{featured ? <><div>{featured.image ? <img src={featured.image} alt="" /> : <span>💡</span>}<section><em>{featured.status}</em><b>{featured.name}</b><p>{featured.description}</p></section></div><button onClick={() => openEditor(featured)}>Ver detalles →</button></> : <><p>Marca una idea como favorita para verla aquí.</p><button onClick={() => ideas[0] && toggleFavorite(ideas[0].id)} disabled={!ideas.length}>Destacar una idea</button></>}</section>
      </aside>
    </div>

    {editing && <div className="ideaModalBackdrop" onMouseDown={() => setEditing(null)}><section className="ideaEditor" role="dialog" aria-modal="true" aria-label="Editor de idea" onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>BANCO DE OPORTUNIDADES</span><h2>{ideas.some((idea) => idea.id === editing.id) ? 'Detalle de idea' : 'Nueva idea'}</h2></div><button onClick={() => setEditing(null)}>×</button></header>
      <div className="ideaFormGrid">
        <label className="wide">Nombre de la idea<input autoFocus value={editing.name} onChange={(event) => update('name', event.target.value)} /></label>
        <label className="wide">Descripción corta<textarea value={editing.description} onChange={(event) => update('description', event.target.value)} /></label>
        <label>Categoría<input list="idea-categories" value={editing.category} onChange={(event) => update('category', event.target.value)} /><datalist id="idea-categories">{categories.map((item) => <option key={item}>{item}</option>)}</datalist></label>
        <label>Etiquetas separadas por coma<input value={tagText} onChange={(event) => setTagText(event.target.value)} /></label>
        <label>Estado<select value={editing.status} onChange={(event) => update('status', event.target.value as Status)}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Potencial<select value={editing.potential} onChange={(event) => update('potential', event.target.value as Potential)}>{POTENTIALS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Fecha de creación<input type="date" value={editing.createdAt} onChange={(event) => update('createdAt', event.target.value)} /></label>
        <label>Inversión estimada<input value={editing.investment} onChange={(event) => update('investment', event.target.value)} placeholder="$0 (opcional)" /></label>
        <label className="wide">Imagen opcional (URL)<input value={editing.image} onChange={(event) => update('image', event.target.value)} placeholder="https://..." /></label>
        <label className="wide check"><input type="checkbox" checked={editing.favorite} onChange={(event) => update('favorite', event.target.checked)} /> Marcar como favorita / destacada</label>
        {[['problem','Problema que resuelve'],['customer','Cliente ideal'],['revenue','Cómo ganaría dinero'],['competition','Competencia'],['advantages','Ventajas'],['risks','Riesgos'],['nextSteps','Próximos pasos'],['notes','Notas libres']].map(([key, label]) => <label className="wide" key={key}>{label}<textarea value={editing[key as keyof Idea] as string} onChange={(event) => update(key as keyof Idea, event.target.value)} /></label>)}
      </div>
      <footer><button onClick={() => setEditing(null)}>Cancelar</button><button className="saveIdea" onClick={save}>Guardar idea</button></footer>
    </section></div>}
  </section>;
}
