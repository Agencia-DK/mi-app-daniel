'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_STORE_REWARDS, REWARD_CONFIG, STORE_CATEGORIES, type RewardRequirements, type StoreCategory, type StoreReward } from './config/rewardConfig';
import './store.css';

type Redemption = { id: string; date: string; rewardId: string; reward: string; category: StoreCategory; coinsSpent: number; realValue?: number; balanceBefore: number; balanceAfter: number };
type Metrics = { level: number; stability: number; stability30: number; habits14: number; savingsGoal: boolean; incomeGoal: boolean; netIncome: number };
type Props = { coins: number; metrics: Metrics; onSpend: (amount: number) => boolean };
type FormState = { id?: string; name: string; category: StoreCategory; coinCost: string; realValue: string; icon: string; description: string; repeatable: boolean; cooldownDays: string; level: string; stability: string; habits14: string; netIncome: string; savingsGoal: boolean; incomeGoal: boolean; custom?: boolean };

const emptyForm = (): FormState => ({ name: '', category: 'Pequeñas recompensas', coinCost: '', realValue: '', icon: '🎁', description: '', repeatable: true, cooldownDays: '', level: '', stability: '', habits14: '', netIncome: '', savingsGoal: false, incomeGoal: false, custom: true });
const money = (value: number) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const daysUntil = (date: Date) => Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000));

const automaticRequirements = (reward: StoreReward): RewardRequirements => {
  if (reward.id === 'premium_polo' || reward.id === 'clothes_3000' || reward.id === 'premium_outfit' || reward.id === 'designer_clothes') return {};
  const value = reward.realValue || 0;
  if (value >= 3001) return { stability: 80, savingsGoal: true, incomeGoal: true };
  if (value >= 1501) return { stability: 75, savingsGoal: true };
  if (value >= 501) return { habits14: 75 };
  return {};
};

export default function StoreView({ coins, metrics, onSpend }: Props) {
  const [rewards, setRewards] = useState<StoreReward[]>(DEFAULT_STORE_REWARDS);
  const [history, setHistory] = useState<Redemption[]>([]);
  const [category, setCategory] = useState<'Todas' | StoreCategory>('Todas');
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [confirming, setConfirming] = useState<StoreReward | null>(null);
  const [success, setSuccess] = useState<StoreReward | null>(null);
  const redeeming = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(REWARD_CONFIG.storeStorageKey) || 'null') as { rewards?: StoreReward[]; history?: Redemption[] } | null;
      if (saved?.rewards) setRewards(saved.rewards);
      if (saved?.history) setHistory(saved.history);
    } catch { /* La tienda inicia con su configuración central. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(REWARD_CONFIG.storeStorageKey, JSON.stringify({ rewards, history })); }, [ready, rewards, history]);

  const lastRedemption = (id: string) => history.find((entry) => entry.rewardId === id);
  const cooldownEnd = (reward: StoreReward) => {
    const last = lastRedemption(reward.id);
    if (!last || !reward.cooldownDays) return null;
    const end = new Date(last.date); end.setDate(end.getDate() + reward.cooldownDays);
    return end.getTime() > Date.now() ? end : null;
  };
  const missing = (reward: StoreReward) => {
    const requirements = { ...automaticRequirements(reward), ...reward.requirements };
    const items: string[] = [];
    if (coins < reward.coinCost) items.push(`${(reward.coinCost - coins).toLocaleString('es-MX')} monedas`);
    if ((requirements.habits14 || 0) > metrics.habits14) items.push(`${requirements.habits14! - metrics.habits14}% de hábitos en 14 días`);
    if ((requirements.stability || 0) > metrics.stability) items.push(`${requirements.stability! - metrics.stability}% de estabilidad`);
    if ((requirements.stability30 || 0) > metrics.stability30) items.push(`${requirements.stability30! - metrics.stability30}% de estabilidad en 30 días`);
    if (requirements.savingsGoal && !metrics.savingsGoal) items.push('cumplir la meta mensual de ahorro');
    if (requirements.incomeGoal && !metrics.incomeGoal) items.push('cumplir la meta mensual de ingresos');
    if ((requirements.netIncome || 0) > metrics.netIncome) items.push(`${money(requirements.netIncome! - metrics.netIncome)} de ingreso mensual`);
    if ((requirements.level || 0) > metrics.level) items.push(`alcanzar el Nivel ${requirements.level}`);
    const cooldown = cooldownEnd(reward);
    if (cooldown) items.push(`esperar ${daysUntil(cooldown)} días de cooldown`);
    if (!reward.repeatable && lastRedemption(reward.id)) items.push('recompensa ya canjeada');
    return items;
  };
  const status = (reward: StoreReward) => cooldownEnd(reward) ? 'EN COOLDOWN' : !reward.repeatable && lastRedemption(reward.id) ? 'CANJEADA' : missing(reward).length ? 'BLOQUEADA' : 'DISPONIBLE';
  const filtered = useMemo(() => category === 'Todas' ? rewards : rewards.filter((item) => item.category === category), [category, rewards]);
  const spent = history.reduce((sum, entry) => sum + entry.coinsSpent, 0);

  const openEditor = (reward?: StoreReward) => setEditing(reward ? {
    id: reward.id, name: reward.name, category: reward.category, coinCost: String(reward.coinCost), realValue: reward.realValue ? String(reward.realValue) : '', icon: reward.icon,
    description: reward.description || '', repeatable: reward.repeatable, cooldownDays: reward.cooldownDays ? String(reward.cooldownDays) : '', level: reward.requirements?.level ? String(reward.requirements.level) : '',
    stability: reward.requirements?.stability ? String(reward.requirements.stability) : '', habits14: reward.requirements?.habits14 ? String(reward.requirements.habits14) : '', netIncome: reward.requirements?.netIncome ? String(reward.requirements.netIncome) : '',
    savingsGoal: !!reward.requirements?.savingsGoal, incomeGoal: !!reward.requirements?.incomeGoal, custom: reward.custom,
  } : emptyForm());

  const saveReward = () => {
    if (!editing?.name.trim()) return;
    const coinCost = Math.min(REWARD_CONFIG.maximumCoinCost, Math.max(1, Number(editing.coinCost) || 1));
    const requirements: RewardRequirements = {};
    if (Number(editing.level)) requirements.level = Number(editing.level);
    if (Number(editing.stability)) requirements.stability = Number(editing.stability);
    if (Number(editing.habits14)) requirements.habits14 = Number(editing.habits14);
    if (Number(editing.netIncome)) requirements.netIncome = Number(editing.netIncome);
    if (editing.savingsGoal) requirements.savingsGoal = true;
    if (editing.incomeGoal) requirements.incomeGoal = true;
    const item: StoreReward = { id: editing.id || `custom_${Date.now()}`, name: editing.name.trim(), category: editing.category, coinCost, icon: editing.icon.trim() || '🎁', description: editing.description.trim(), repeatable: editing.repeatable, custom: editing.id ? editing.custom : true,
      ...(Number(editing.realValue) ? { realValue: Number(editing.realValue) } : {}), ...(Number(editing.cooldownDays) ? { cooldownDays: Number(editing.cooldownDays) } : {}), ...(Object.keys(requirements).length ? { requirements } : {}) };
    setRewards((items) => editing.id ? items.map((current) => current.id === editing.id ? item : current) : [...items, item]);
    setEditing(null);
  };

  const redeem = () => {
    const reward = confirming;
    if (!reward || redeeming.current || missing(reward).length) return;
    redeeming.current = true;
    const before = coins;
    if (!onSpend(reward.coinCost)) { redeeming.current = false; return; }
    const entry: Redemption = { id: `redeem_${Date.now()}`, date: new Date().toISOString(), rewardId: reward.id, reward: reward.name, category: reward.category, coinsSpent: reward.coinCost, ...(reward.realValue ? { realValue: reward.realValue } : {}), balanceBefore: before, balanceAfter: before - reward.coinCost };
    setHistory((items) => [entry, ...items]); setConfirming(null); setSuccess(reward);
    window.setTimeout(() => { redeeming.current = false; setSuccess(null); }, 2200);
  };

  return <section className="storeView" aria-label="La Tiendita de recompensas">
    <div className="storeHeading"><div><span>RECOMPENSAS CON DISCIPLINA</span><h1>La Tiendita</h1><p>Disfruta lo que te ganaste. Aquí las monedas solo se gastan.</p></div><button onClick={() => openEditor()}>＋ Nueva recompensa</button></div>
    <div className="coinWallet"><span>🪙</span><div><small>MIS MONEDAS</small><b>{coins.toLocaleString('es-MX')}</b></div><p><span>Ganadas históricamente <b>{(coins + spent).toLocaleString('es-MX')}</b></span><span>Gastadas históricamente <b>{spent.toLocaleString('es-MX')}</b></span></p></div>
    <div className="storeFilters"><button className={category === 'Todas' ? 'active' : ''} onClick={() => setCategory('Todas')}>Todas</button>{STORE_CATEGORIES.map((item) => <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    <div className="rewardGrid">{filtered.length ? filtered.map((reward) => { const state = status(reward); const unmet = missing(reward); const last = lastRedemption(reward.id); const cooldown = cooldownEnd(reward); return <article className={`rewardTile ${reward.category === 'Excepciones controladas' ? 'exception' : ''}`} key={reward.id}>
      <header><i>{reward.icon}</i><span><small>{reward.category}</small><h2>{reward.name}</h2></span><button onClick={() => openEditor(reward)} aria-label={`Editar ${reward.name}`}>✎</button></header>
      {reward.description && <p>{reward.description}</p>}<div className="rewardFacts"><b>🪙 {reward.coinCost.toLocaleString('es-MX')}</b>{(reward.realValueLabel || reward.realValue) && <span>{reward.realValueLabel || money(reward.realValue!)}</span>}<em className={state.toLowerCase().replace(' ', '-')}>{state}</em></div>
      {reward.id === REWARD_CONFIG.exceptionRewardId && <div className="cooldownInfo"><span>Último canje: <b>{last ? new Date(last.date).toLocaleDateString('es-MX') : 'Nunca'}</b></span><span>Disponible: <b>{cooldown ? cooldown.toLocaleDateString('es-MX') : 'Ahora'}</b></span></div>}
      {unmet.length > 0 && state !== 'CANJEADA' && <div className="rewardMissing"><b>TE FALTA:</b>{unmet.map((item) => <span key={item}>• {item}</span>)}</div>}
      <button className="redeemButton" disabled={state !== 'DISPONIBLE'} onClick={() => setConfirming(reward)}>{state === 'DISPONIBLE' ? 'CANJEAR' : state}</button>
    </article>; }) : <p className="emptyStore">No hay recompensas en esta categoría.</p>}</div>
    <section className="rewardHistory"><header><div><span>HISTORIAL</span><h2>Historial de recompensas</h2></div><b>{history.length} canjes</b></header>{history.length ? history.map((entry) => <article key={entry.id}><span><b>{entry.reward}</b><small>{new Date(entry.date).toLocaleString('es-MX')} · {entry.category}</small></span><strong>−{entry.coinsSpent} 🪙<small>{entry.balanceBefore} → {entry.balanceAfter}</small></strong></article>) : <p>Aún no has canjeado recompensas.</p>}</section>

    {confirming && <div className="modalBackdrop" onMouseDown={() => setConfirming(null)}><section className="redeemModal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><span>CONFIRMAR CANJE</span><i>{confirming.icon}</i><h2>¿Quieres utilizar esta recompensa?</h2><h3>{confirming.name}</h3><div><p>Costo <b>{confirming.coinCost} 🪙</b></p><p>Saldo actual <b>{coins} 🪙</b></p><p>Saldo después <b>{coins - confirming.coinCost} 🪙</b></p></div><footer><button onClick={() => setConfirming(null)}>Cancelar</button><button onClick={redeem}>Confirmar canje</button></footer></section></div>}
    {success && <div className="rewardSuccess"><i>✓</i><span><b>RECOMPENSA DESBLOQUEADA</b><strong>{success.name}</strong><small>−{success.coinCost} 🪙</small></span></div>}
    {editing && <div className="modalBackdrop" onMouseDown={() => setEditing(null)}><section className="rewardEditor" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><header><div><span>CONFIGURACIÓN</span><h2>{editing.id ? 'Editar recompensa' : 'Nueva recompensa'}</h2></div><button onClick={() => setEditing(null)}>×</button></header>
      <div className="rewardForm"><label>Nombre<input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label><label>Categoría<select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as StoreCategory })}>{STORE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label><label>Costo en monedas<input type="number" min="1" max="2000" value={editing.coinCost} onChange={(e) => setEditing({ ...editing, coinCost: e.target.value })} /></label><label>Valor real opcional<input type="number" min="0" value={editing.realValue} onChange={(e) => setEditing({ ...editing, realValue: e.target.value })} /></label><label>Icono<input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></label><label>Cooldown (días)<input type="number" min="0" value={editing.cooldownDays} onChange={(e) => setEditing({ ...editing, cooldownDays: e.target.value })} /></label><label className="wide">Descripción<input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label></div>
      <fieldset><legend>Requisitos opcionales</legend><div className="rewardForm"><label>Nivel mínimo<input type="number" min="1" max="40" value={editing.level} onChange={(e) => setEditing({ ...editing, level: e.target.value })} /></label><label>Estabilidad mínima<input type="number" min="0" max="100" value={editing.stability} onChange={(e) => setEditing({ ...editing, stability: e.target.value })} /></label><label>Hábitos 14 días<input type="number" min="0" max="100" value={editing.habits14} onChange={(e) => setEditing({ ...editing, habits14: e.target.value })} /></label><label>Ingreso neto mínimo<input type="number" min="0" value={editing.netIncome} onChange={(e) => setEditing({ ...editing, netIncome: e.target.value })} /></label></div><div className="rewardChecks"><label><input type="checkbox" checked={editing.repeatable} onChange={(e) => setEditing({ ...editing, repeatable: e.target.checked })} /> Repetible</label><label><input type="checkbox" checked={editing.savingsGoal} onChange={(e) => setEditing({ ...editing, savingsGoal: e.target.checked })} /> Meta de ahorro</label><label><input type="checkbox" checked={editing.incomeGoal} onChange={(e) => setEditing({ ...editing, incomeGoal: e.target.checked })} /> Meta de ingresos</label></div></fieldset>
      <footer>{editing.custom && editing.id && <button className="deleteReward" onClick={() => { setRewards((items) => items.filter((item) => item.id !== editing.id)); setEditing(null); }}>Eliminar</button>}<button onClick={() => setEditing(null)}>Cancelar</button><button className="saveReward" onClick={saveReward}>Guardar</button></footer>
    </section></div>}
  </section>;
}
