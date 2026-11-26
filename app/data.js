// Ledger House seed data: one sample household's money, June–November 2026.
// All figures are USD. data.js owns the starting content only; state.js owns
// loading, saving and changing it.

export const CATEGORIES = {
  expense: [
    { name: "Housing", color: "#1e4d3a" },
    { name: "Groceries", color: "#2f7d6d" },
    { name: "Utilities", color: "#d9902f" },
    { name: "Transport", color: "#5b7fa6" },
    { name: "Dining Out", color: "#b4552d" },
    { name: "Health", color: "#7a4a8c" },
    { name: "Kids & School", color: "#c25e7a" },
    { name: "Entertainment", color: "#4a6b2f" },
    { name: "Clothing", color: "#8a6d3b" },
    { name: "Household", color: "#6b7a70" },
  ],
  income: [
    { name: "Salary", color: "#1e4d3a" },
    { name: "Freelance", color: "#2f7d6d" },
    { name: "Other Income", color: "#d9902f" },
  ],
};

export function categoryColor(kind, name) {
  const list = CATEGORIES[kind] || [];
  const found = list.find((c) => c.name === name);
  return found ? found.color : "#6b7a70";
}

export const MONTHS = ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"];

export function monthLabel(ym) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// One row: [id, kind, description, amount, category, date]
const SEED_ROWS = [
  // June 2026
  [1, "income", "Monthly salary — Rivera household", 5400, "Salary", "2026-06-01"],
  [2, "income", "Weekend design work", 420, "Freelance", "2026-06-12"],
  [3, "expense", "Rent — Maple Street apartment", 1650, "Housing", "2026-06-01"],
  [4, "expense", "Weekly groceries at Market Street", 168, "Groceries", "2026-06-06"],
  [5, "expense", "Electricity and water", 214, "Utilities", "2026-06-10"],
  [6, "expense", "Bus passes for two", 96, "Transport", "2026-06-03"],
  [7, "expense", "Groceries — mid-month top-up", 142, "Groceries", "2026-06-18"],
  [8, "expense", "Family pizza night", 46, "Dining Out", "2026-06-20"],
  [9, "expense", "Kids' school supplies", 88, "Kids & School", "2026-06-15"],
  [10, "expense", "Cinema tickets", 38, "Entertainment", "2026-06-27"],
  [11, "expense", "Pharmacy — allergy medicine", 34, "Health", "2026-06-22"],
  // July 2026
  [12, "income", "Monthly salary — Rivera household", 5400, "Salary", "2026-07-01"],
  [13, "income", "Weekend design work", 610, "Freelance", "2026-07-16"],
  [14, "expense", "Rent — Maple Street apartment", 1650, "Housing", "2026-07-01"],
  [15, "expense", "Weekly groceries at Market Street", 176, "Groceries", "2026-07-04"],
  [16, "expense", "Electricity, water and internet", 268, "Utilities", "2026-07-09"],
  [17, "expense", "Car fuel and parking", 132, "Transport", "2026-07-11"],
  [18, "expense", "Groceries — mid-month top-up", 158, "Groceries", "2026-07-19"],
  [19, "expense", "Birthday dinner out", 74, "Dining Out", "2026-07-24"],
  [20, "expense", "Summer camp fee — Maya", 220, "Kids & School", "2026-07-06"],
  [21, "expense", "New school shoes", 64, "Clothing", "2026-07-28"],
  [22, "expense", "Streaming and board games", 52, "Entertainment", "2026-07-13"],
  // August 2026
  [23, "income", "Monthly salary — Rivera household", 5400, "Salary", "2026-08-01"],
  [24, "income", "Sold old bicycle", 180, "Other Income", "2026-08-08"],
  [25, "expense", "Rent — Maple Street apartment", 1650, "Housing", "2026-08-01"],
  [26, "expense", "Weekly groceries at Market Street", 171, "Groceries", "2026-08-05"],
  [27, "expense", "Electricity and water", 231, "Utilities", "2026-08-10"],
  [28, "expense", "Car fuel and parking", 148, "Transport", "2026-08-12"],
  [29, "expense", "Groceries — mid-month top-up", 149, "Groceries", "2026-08-20"],
  [30, "expense", "Back-to-school clothes", 132, "Clothing", "2026-08-22"],
  [31, "expense", "School books and bag", 96, "Kids & School", "2026-08-24"],
  [32, "expense", "Dentist check-up — Leo", 85, "Health", "2026-08-17"],
  [33, "expense", "Takeaway Friday", 41, "Dining Out", "2026-08-28"],
  // September 2026
  [34, "income", "Monthly salary — Rivera household", 5400, "Salary", "2026-09-01"],
  [35, "income", "Weekend design work", 540, "Freelance", "2026-09-18"],
  [36, "expense", "Rent — Maple Street apartment", 1650, "Housing", "2026-09-01"],
  [37, "expense", "Weekly groceries at Market Street", 182, "Groceries", "2026-09-03"],
  [38, "expense", "Electricity, water and internet", 259, "Utilities", "2026-09-09"],
  [39, "expense", "Car fuel and parking", 141, "Transport", "2026-09-10"],
  [40, "expense", "Groceries — mid-month top-up", 163, "Groceries", "2026-09-17"],
  [41, "expense", "School lunch program", 120, "Kids & School", "2026-09-07"],
  [42, "expense", "Family dinner out", 58, "Dining Out", "2026-09-19"],
  [43, "expense", "Household cleaning supplies", 47, "Household", "2026-09-14"],
  [44, "expense", "Flu shots for the family", 60, "Health", "2026-09-26"],
  [45, "expense", "Movie night at home", 24, "Entertainment", "2026-09-25"],
  // October 2026
  [46, "income", "Monthly salary — Rivera household", 5400, "Salary", "2026-10-01"],
  [47, "income", "Weekend design work", 730, "Freelance", "2026-10-15"],
  [48, "expense", "Rent — Maple Street apartment", 1650, "Housing", "2026-10-01"],
  [49, "expense", "Weekly groceries at Market Street", 189, "Groceries", "2026-10-03"],
  [50, "expense", "Electricity, water and internet", 274, "Utilities", "2026-10-08"],
  [51, "expense", "Car fuel, parking and tolls", 156, "Transport", "2026-10-11"],
  [52, "expense", "Groceries — mid-month top-up", 171, "Groceries", "2026-10-18"],
  [53, "expense", "Halloween costumes", 72, "Kids & School", "2026-10-21"],
  [54, "expense", "Winter jackets for the kids", 148, "Clothing", "2026-10-24"],
  [55, "expense", "Anniversary dinner", 86, "Dining Out", "2026-10-16"],
  [56, "expense", "Eye test and new glasses", 140, "Health", "2026-10-27"],
  [57, "expense", "Board game night supplies", 36, "Entertainment", "2026-10-30"],
  // November 2026 — the current month, in full detail
  [58, "income", "Monthly salary — Rivera household", 5400, "Salary", "2026-11-01"],
  [59, "expense", "Rent — Maple Street apartment", 1650, "Housing", "2026-11-01"],
  [60, "expense", "Weekly groceries at Market Street", 184, "Groceries", "2026-11-02"],
  [61, "expense", "Bus passes for two", 96, "Transport", "2026-11-03"],
  [62, "expense", "School lunch program", 120, "Kids & School", "2026-11-04"],
  [63, "expense", "Electricity and water", 198, "Utilities", "2026-11-05"],
  [64, "expense", "Pharmacy — vitamins and cold medicine", 42, "Health", "2026-11-06"],
  [65, "expense", "Groceries — mid-month top-up", 167, "Groceries", "2026-11-09"],
  [66, "expense", "Car fuel and parking", 118, "Transport", "2026-11-10"],
  [67, "expense", "Family dinner at Rosa's", 64, "Dining Out", "2026-11-11"],
  [68, "income", "Weekend design work", 850, "Freelance", "2026-11-14"],
  [69, "expense", "Weekly groceries at Market Street", 176, "Groceries", "2026-11-14"],
  [70, "expense", "Internet and mobile plans", 112, "Utilities", "2026-11-15"],
  [71, "expense", "Kids' art class fee", 90, "Kids & School", "2026-11-16"],
  [72, "expense", "Takeaway Friday", 44, "Dining Out", "2026-11-17"],
  [73, "expense", "New running shoes", 78, "Clothing", "2026-11-18"],
  [74, "expense", "Groceries — Thanksgiving week", 212, "Groceries", "2026-11-20"],
  [75, "expense", "Thanksgiving dinner groceries", 96, "Groceries", "2026-11-23"],
  [76, "expense", "Cinema — family film night", 52, "Entertainment", "2026-11-21"],
  [77, "income", "Sold old bicycle parts", 210, "Other Income", "2026-11-22"],
  [78, "expense", "Dentist check-up — Maya", 95, "Health", "2026-11-24"],
  [79, "expense", "Household — new kettle and bulbs", 58, "Household", "2026-11-25"],
  [80, "expense", "Bus passes top-up", 48, "Transport", "2026-11-25"],
];

export function seedTransactions() {
  return SEED_ROWS.map(([id, kind, description, amount, category, date]) => ({
    id, kind, description, amount, category, date,
  }));
}

export const SEED_BUDGETS = {
  "Housing": 1650,
  "Groceries": 750,
  "Utilities": 320,
  "Transport": 300,
  "Dining Out": 350,
  "Health": 250,
  "Kids & School": 450,
  "Entertainment": 200,
  "Clothing": 150,
  "Household": 200,
};

export const SEED_GOALS = [
  { id: 1, name: "Emergency fund", target: 6000, saved: 4350, date: "2027-06-30", note: "Six months of rent, kept where we can reach it fast." },
  { id: 2, name: "Family vacation", target: 2400, saved: 980, date: "2027-03-01", note: "A week by the coast next spring — train tickets and a small cottage." },
  { id: 3, name: "New car down payment", target: 8000, saved: 2100, date: "2027-12-01", note: "Replacing the old sedan before its next big repair bill." },
  { id: 4, name: "Kids' college starter", target: 5000, saved: 1250, date: "2028-01-01", note: "A little each month, started when Maya turned eight." },
];

export function seedState() {
  return {
    transactions: seedTransactions(),
    budgets: { ...SEED_BUDGETS },
    goals: SEED_GOALS.map((g) => ({ ...g })),
    nextTxId: 81,
    nextGoalId: 5,
  };
}
