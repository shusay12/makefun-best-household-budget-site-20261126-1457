// main.js — entrypoint: hash routing, form wiring and re-rendering.
// Views read state; this file only connects the page's controls to them.

import { DEFAULT_MONTH, getState, addTransaction, deleteTransaction, updateTransaction, setBudget, addGoal, addToGoal, resetState } from "./state.js";
import { renderDashboard, renderTransactions, renderBudgets, renderGoals, renderReports, fillMonthOptions, fillCategoryOptions } from "./views.js";

const ROUTES = ["dashboard", "transactions", "budgets", "goals", "reports"];

let currentMonth = DEFAULT_MONTH;
let editingTxId = null;
const filters = { kind: "all", category: "all", search: "" };

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  return ROUTES.includes(hash) ? hash : "dashboard";
}

function showRoute(route) {
  for (const r of ROUTES) {
    document.getElementById("view-" + r).hidden = r !== route;
  }
  document.querySelectorAll(".mainnav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
  window.scrollTo(0, 0);
  renderAll();
}

function renderAll() {
  const route = currentRoute();
  if (route === "dashboard") renderDashboard(currentMonth);
  if (route === "transactions") renderTransactions(currentMonth, filters);
  if (route === "budgets") renderBudgets(currentMonth);
  if (route === "goals") renderGoals();
  if (route === "reports") renderReports(currentMonth);
  document.getElementById("view-dashboard").querySelector("h2").textContent =
    document.getElementById("monthSelect").selectedOptions[0].textContent + " at a glance";
}

function note(el, text) {
  el.textContent = text;
  setTimeout(() => { el.textContent = ""; }, 4000);
}

function wireMonthPicker() {
  const sel = document.getElementById("monthSelect");
  fillMonthOptions(currentMonth);
  sel.addEventListener("change", () => {
    currentMonth = sel.value;
    renderAll();
  });
}

function wireTxForm() {
  const form = document.getElementById("txForm");
  const kindSel = document.getElementById("txKind");
  const catSel = document.getElementById("txCategory");
  const submitBtn = form.querySelector("button[type=submit]");

  kindSel.addEventListener("change", () => {
    catSel.innerHTML = kindSel.value === "income" ? catSel.dataset.income : catSel.dataset.expense;
  });

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const amount = parseFloat(document.getElementById("txAmount").value);
    const date = document.getElementById("txDate").value;
    const description = document.getElementById("txDesc").value;
    if (!description.trim() || !(amount > 0) || !date) return;
    const patch = {
      kind: kindSel.value,
      description,
      amount,
      category: catSel.value,
      date,
    };
    if (editingTxId !== null) {
      updateTransaction(editingTxId, patch);
      note(document.getElementById("txFormMsg"), "Transaction updated.");
      editingTxId = null;
      submitBtn.textContent = "Add transaction";
    } else {
      addTransaction(patch);
      note(document.getElementById("txFormMsg"), "Transaction added.");
    }
    form.reset();
    catSel.innerHTML = catSel.dataset.expense;
    renderAll();
  });

  document.getElementById("txTableWrap").addEventListener("click", (ev) => {
    const del = ev.target.closest("[data-delete]");
    const edit = ev.target.closest("[data-edit]");
    if (del) {
      deleteTransaction(Number(del.dataset.delete));
      renderAll();
      return;
    }
    if (edit) {
      const row = getState().transactions.find((t) => t.id === Number(edit.dataset.edit));
      if (!row) return;
      editingTxId = row.id;
      kindSel.value = row.kind;
      catSel.innerHTML = row.kind === "income" ? catSel.dataset.income : catSel.dataset.expense;
      catSel.value = row.category;
      document.getElementById("txDesc").value = row.description;
      document.getElementById("txAmount").value = row.amount;
      document.getElementById("txDate").value = row.date;
      submitBtn.textContent = "Save changes";
      form.scrollIntoView({ block: "start" });
    }
  });

  document.getElementById("txFilterKind").addEventListener("change", (ev) => {
    filters.kind = ev.target.value;
    renderTransactions(currentMonth, filters);
  });
  document.getElementById("txFilterCat").addEventListener("change", (ev) => {
    filters.category = ev.target.value;
    renderTransactions(currentMonth, filters);
  });
  document.getElementById("txSearch").addEventListener("input", (ev) => {
    filters.search = ev.target.value;
    renderTransactions(currentMonth, filters);
  });
}

function wireBudgetForm() {
  const form = document.getElementById("budgetForm");
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const limit = parseFloat(document.getElementById("budgetAmount").value);
    const category = document.getElementById("budgetCategory").value;
    if (!(limit >= 0)) return;
    setBudget(category, limit);
    note(document.getElementById("budgetMsg"), `Budget for ${category} saved.`);
    renderAll();
  });
}

function wireGoalForms() {
  const form = document.getElementById("goalForm");
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = document.getElementById("goalName").value;
    const target = parseFloat(document.getElementById("goalTarget").value);
    const saved = parseFloat(document.getElementById("goalSaved").value) || 0;
    const date = document.getElementById("goalDate").value;
    if (!name.trim() || !(target > 0)) return;
    addGoal({ name, target, saved, date });
    note(document.getElementById("goalMsg"), `Goal “${name.trim()}” added.`);
    form.reset();
    renderAll();
  });

  document.getElementById("goalList").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const f = ev.target.closest("form[data-goal]");
    if (!f) return;
    const input = f.querySelector("input");
    const amount = parseFloat(input.value);
    if (!(amount > 0)) return;
    addToGoal(Number(f.dataset.goal), amount);
    input.value = "";
    renderAll();
  });
}

function wireReset() {
  document.getElementById("resetDemo").addEventListener("click", () => {
    if (confirm("Reset Ledger House to the sample household? Your changes will be lost.")) {
      resetState();
      renderAll();
    }
  });
}

fillCategoryOptions();
wireMonthPicker();
wireTxForm();
wireBudgetForm();
wireGoalForms();
wireReset();
window.addEventListener("hashchange", () => showRoute(currentRoute()));
document.getElementById("txDate").value = "2026-11-26";
showRoute(currentRoute());
