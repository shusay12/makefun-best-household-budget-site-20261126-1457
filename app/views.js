// views.js — renders every section from state. Each function rebuilds its
// section's HTML from the live ledger, so any change shows up everywhere.

import { CATEGORIES, categoryColor, monthLabel, MONTHS } from "./data.js";
import {
  getState, transactionsForMonth, monthTotals, allMonthTotals,
  spendingByCategory, budgetStatus, money, money0,
} from "./state.js";
import { incomeSpendingBars, spendingDonut } from "./charts.js";

export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function progressBar(pct) {
  const clamped = Math.max(0, Math.min(1, pct));
  const cls = pct > 1 ? "progress over" : pct > 0.85 ? "progress warn" : "progress";
  return `<div class="${cls}" role="progressbar" aria-valuenow="${Math.round(clamped * 100)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${(clamped * 100).toFixed(1)}%"></span></div>`;
}

function txRow(t, withActions) {
  const sign = t.kind === "income" ? "+" : "−";
  const cls = t.kind === "income" ? "pos" : "neg";
  const actions = withActions
    ? `<td><button class="button small" type="button" data-edit="${t.id}">Edit</button> <button class="button small danger" type="button" data-delete="${t.id}">Delete</button></td>`
    : "";
  return `<tr>
    <td>${esc(t.date)}</td>
    <td>${esc(t.description)}</td>
    <td><span class="cat-dot" style="background:${categoryColor(t.kind, t.category)}"></span>${esc(t.category)}</td>
    <td>${esc(t.kind === "income" ? "Income" : "Expense")}</td>
    <td class="num"><span class="${cls}">${sign}${money(t.amount)}</span></td>
    ${actions}
  </tr>`;
}

export function renderDashboard(month) {
  const { income, spending, balance } = monthTotals(month);
  const rate = income > 0 ? Math.max(0, (balance / income) * 100) : 0;
  document.getElementById("kpis").innerHTML = `
    <div class="kpi"><div class="label">Income</div><div class="value">${money(income)}</div><div class="sub">${monthLabel(month)}</div></div>
    <div class="kpi"><div class="label">Spending</div><div class="value">${money(spending)}</div><div class="sub">${transactionsForMonth(month).filter((t) => t.kind === "expense").length} expenses</div></div>
    <div class="kpi good"><div class="label">Left over</div><div class="value">${money(balance)}</div><div class="sub">Income minus spending</div></div>
    <div class="kpi"><div class="label">Savings rate</div><div class="value">${rate.toFixed(0)}%</div><div class="sub">Of income kept this month</div></div>`;

  const cats = spendingByCategory(month);
  document.getElementById("dashDonut").innerHTML = spendingDonut(cats, spending);
  document.getElementById("dashTopCats").innerHTML = cats.slice(0, 5).map((c) =>
    `<li><span><span class="cat-dot" style="background:${categoryColor("expense", c.category)}"></span>${esc(c.category)}</span><strong>${money(c.amount)}</strong></li>`
  ).join("");

  const budgets = budgetStatus(month).sort((a, b) => b.pct - a.pct).slice(0, 4);
  document.getElementById("dashBudgets").innerHTML = budgets.map((b) => `
    <div class="budget-row">
      <div class="budget-head"><span>${esc(b.category)}</span><span>${money0(b.spent)} of ${money0(b.limit)}</span></div>
      ${progressBar(b.pct)}
      <div class="budget-sub"><span>${Math.round(b.pct * 100)}% used</span><span>${b.remaining >= 0 ? money0(b.remaining) + " left" : money0(-b.remaining) + " over"}</span></div>
    </div>`).join("");

  const recent = transactionsForMonth(month).slice(0, 6);
  document.getElementById("dashRecent").innerHTML = recent.length
    ? `<table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th class="num">Amount</th></tr></thead><tbody>${recent.map((t) => txRow(t, false)).join("")}</tbody></table>`
    : "<p class='muted'>No transactions this month yet.</p>";
}

export function renderTransactions(month, filters) {
  const all = transactionsForMonth(month);
  let rows = all;
  if (filters.kind !== "all") rows = rows.filter((t) => t.kind === filters.kind);
  if (filters.category !== "all") rows = rows.filter((t) => t.category === filters.category);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter((t) => t.description.toLowerCase().includes(q));
  }
  document.getElementById("txCount").textContent = `— ${rows.length} of ${all.length} in ${monthLabel(month)}`;
  document.getElementById("txTableWrap").innerHTML = rows.length
    ? `<table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th class="num">Amount</th><th>Actions</th></tr></thead><tbody>${rows.map((t) => txRow(t, true)).join("")}</tbody></table>`
    : "<p class='muted'>Nothing matches. Try a different filter, or add a transaction above.</p>";
}

export function renderBudgets(month) {
  const list = budgetStatus(month).sort((a, b) => b.pct - a.pct);
  const totalLimit = list.reduce((s, b) => s + b.limit, 0);
  const totalSpent = list.reduce((s, b) => s + b.spent, 0);
  document.getElementById("budgetList").innerHTML = `
    <article class="card"><h3>${monthLabel(month)} totals</h3>
    <p>Budgeted <strong>${money(totalLimit)}</strong> · spent <strong>${money(totalSpent)}</strong> · <strong>${money(totalLimit - totalSpent)}</strong> still in the plan.</p>
    ${progressBar(totalLimit > 0 ? totalSpent / totalLimit : 0)}</article>
    ` + list.map((b) => `
    <article class="card">
      <div class="budget-head"><span><span class="cat-dot" style="background:${categoryColor("expense", b.category)}"></span>${esc(b.category)}</span><span>${money(b.spent)} of ${money(b.limit)}</span></div>
      ${progressBar(b.pct)}
      <div class="budget-sub"><span>${Math.round(b.pct * 100)}% of budget used</span><span class="remaining${b.remaining < 0 ? " over" : ""}">${b.remaining >= 0 ? money(b.remaining) + " remaining" : money(-b.remaining) + " over budget"}</span></div>
      <p class="muted">${b.pct > 1 ? "Over budget — move money from a category with room, or raise the limit below." : b.pct >= 1 ? "Fully used — the budget is spent for the month." : b.pct > 0.85 ? "Nearly used up — a few careful days will keep it inside the limit." : "On track for the month."}</p>
    </article>`).join("");
}

export function renderGoals() {
  const goals = getState().goals;
  document.getElementById("goalList").innerHTML = goals.map((g) => {
    const pct = g.target > 0 ? g.saved / g.target : 0;
    const left = Math.max(0, g.target - g.saved);
    return `<article class="card goal-card">
      <h3>${esc(g.name)}</h3>
      <p class="muted">${esc(g.note || "")}</p>
      <div class="pct">${Math.round(pct * 100)}%</div>
      ${progressBar(pct)}
      <div class="target-line"><span><strong>${money(g.saved)}</strong> saved</span><span>Target ${money(g.target)}${g.date ? " · by " + esc(g.date) : ""}</span></div>
      <p class="muted">${left > 0 ? money(left) + " still to save." : "Goal reached — well done!"}</p>
      <form class="add-money" data-goal="${g.id}">
        <label class="muted" for="add-${g.id}">Add savings</label>
        <input id="add-${g.id}" type="number" min="0.01" step="0.01" placeholder="25.00" required>
        <button class="button small" type="submit">Add</button>
      </form>
    </article>`;
  }).join("");
}

export function renderReports(month) {
  document.getElementById("reportBars").innerHTML = incomeSpendingBars(allMonthTotals());
  const months = allMonthTotals();
  document.getElementById("reportMonthTable").innerHTML = `<table>
    <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spending</th><th class="num">Left over</th></tr></thead>
    <tbody>${months.map((m) => `<tr><td>${monthLabel(m.month)}</td><td class="num">${money(m.income)}</td><td class="num">${money(m.spending)}</td><td class="num"><strong>${money(m.balance)}</strong></td></tr>`).join("")}</tbody>
  </table>`;

  const cats = spendingByCategory(month);
  const { spending } = monthTotals(month);
  document.getElementById("reportDonut").innerHTML = spendingDonut(cats, spending);
  document.getElementById("reportCatTable").innerHTML = `<table>
    <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Share</th></tr></thead>
    <tbody>${cats.map((c) => `<tr><td><span class="cat-dot" style="background:${categoryColor("expense", c.category)}"></span>${esc(c.category)}</td><td class="num">${money(c.amount)}</td><td class="num">${spending > 0 ? ((c.amount / spending) * 100).toFixed(1) + "%" : "—"}</td></tr>`).join("")}</tbody>
  </table>`;

  const txs = transactionsForMonth(month).filter((t) => t.kind === "expense");
  const biggest = txs.reduce((a, b) => (b.amount > (a ? a.amount : 0) ? b : a), null);
  const freq = {};
  for (const t of txs) freq[t.category] = (freq[t.category] || 0) + 1;
  const topFreq = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("noteBiggest").textContent = biggest
    ? `${biggest.description} — ${money(biggest.amount)} on ${biggest.date}`
    : "—";
  document.getElementById("noteFrequent").textContent = topFreq
    ? `${topFreq[0]} (${topFreq[1]} purchases)`
    : "—";
  document.getElementById("noteDaily").textContent = money(spending / 26);
  document.getElementById("noteKept").textContent = money(monthTotals(month).balance);
}

export function fillMonthOptions(current) {
  const sel = document.getElementById("monthSelect");
  sel.innerHTML = MONTHS.map((ym) =>
    `<option value="${ym}"${ym === current ? " selected" : ""}>${monthLabel(ym)}</option>`).join("");
}

export function fillCategoryOptions() {
  const txCat = document.getElementById("txCategory");
  const filterCat = document.getElementById("txFilterCat");
  const budgetCat = document.getElementById("budgetCategory");
  const expOpts = CATEGORIES.expense.map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("");
  const incOpts = CATEGORIES.income.map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("");
  txCat.dataset.expense = expOpts;
  txCat.dataset.income = incOpts;
  txCat.innerHTML = expOpts;
  filterCat.innerHTML = `<option value="all">All categories</option>` +
    [...CATEGORIES.expense, ...CATEGORIES.income].map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("");
  budgetCat.innerHTML = expOpts;
}
