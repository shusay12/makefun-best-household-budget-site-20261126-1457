// state.js — the household's ledger in memory, saved to localStorage.
// Every view reads through here, so an edit in one place updates all pages.

import { seedState, MONTHS } from "./data.js";

const STORAGE_KEY = "ledger-house-state-v1";

export const DEFAULT_MONTH = "2026-11";

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || typeof parsed.budgets !== "object") return seedState();
    return parsed;
  } catch (err) {
    return seedState();
  }
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Storage full or unavailable: the page still works for this visit.
  }
}

export function resetState() {
  state = seedState();
  saveState();
  return state;
}

export function getState() {
  return state;
}

export function monthOf(dateStr) {
  return dateStr.slice(0, 7);
}

export function transactionsForMonth(ym) {
  return state.transactions
    .filter((t) => monthOf(t.date) === ym)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id));
}

export function monthTotals(ym) {
  let income = 0;
  let spending = 0;
  for (const t of state.transactions) {
    if (monthOf(t.date) !== ym) continue;
    if (t.kind === "income") income += t.amount;
    else spending += t.amount;
  }
  return { income, spending, balance: income - spending };
}

export function allMonthTotals() {
  return MONTHS.map((ym) => ({ month: ym, ...monthTotals(ym) }));
}

export function spendingByCategory(ym) {
  const totals = new Map();
  for (const t of state.transactions) {
    if (t.kind !== "expense" || monthOf(t.date) !== ym) continue;
    totals.set(t.category, (totals.get(t.category) || 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function budgetStatus(ym) {
  return Object.entries(state.budgets).map(([category, limit]) => {
    const spent = state.transactions
      .filter((t) => t.kind === "expense" && t.category === category && monthOf(t.date) === ym)
      .reduce((sum, t) => sum + t.amount, 0);
    return { category, limit, spent, remaining: limit - spent, pct: limit > 0 ? spent / limit : 0 };
  });
}

export function addTransaction(tx) {
  const row = {
    id: state.nextTxId++,
    kind: tx.kind,
    description: tx.description.trim(),
    amount: Math.round(tx.amount * 100) / 100,
    category: tx.category,
    date: tx.date,
  };
  state.transactions.push(row);
  saveState();
  return row;
}

export function deleteTransaction(id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState();
}

export function updateTransaction(id, patch) {
  const row = state.transactions.find((t) => t.id === id);
  if (!row) return null;
  if (patch.description !== undefined) row.description = patch.description.trim();
  if (patch.amount !== undefined) row.amount = Math.round(patch.amount * 100) / 100;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.date !== undefined) row.date = patch.date;
  saveState();
  return row;
}

export function setBudget(category, limit) {
  state.budgets[category] = Math.round(limit * 100) / 100;
  saveState();
}

export function addGoal(goal) {
  const row = {
    id: state.nextGoalId++,
    name: goal.name.trim(),
    target: goal.target,
    saved: goal.saved || 0,
    date: goal.date || "",
    note: "",
  };
  state.goals.push(row);
  saveState();
  return row;
}

export function addToGoal(id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (!goal) return null;
  goal.saved = Math.round((goal.saved + amount) * 100) / 100;
  saveState();
  return goal;
}

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}
