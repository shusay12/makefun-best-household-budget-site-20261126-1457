# Ledger House — Make the best household budget site

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/shusay12/makefun-best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/shusay12/makefun-best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Ledger House is an original household budget site: a month's income and
spending, per-category budgets, savings goals and reports, all working in
the browser. It runs entirely from its own static files — no network
request, no tracking, no account — on desktop and on a phone.

- **Dashboard** (`#/`) — month overview: income $6,460.00, spending
  $3,700.00, $2,760.00 left over, 43% savings rate, spending donut and
  budget snapshot.
- **Transactions** (`#/transactions`) — add, edit and delete income and
  expenses with categories and dates; 23 sample transactions for
  November 2026, saved in localStorage.
- **Budgets** (`#/budgets`) — monthly budget per category with progress
  bars and remaining amounts.
- **Goals** (`#/goals`) — savings goals with contributions and progress.
- **Reports** (`#/reports`) — six-month income-vs-spending bar chart and
  spending by category.

Figures are a realistic sample household in USD for November 2026, with
a month picker covering June–November 2026.

## Run

```sh
python3 -m http.server 8131 --directory app   # serves app/ at http://localhost:8131
```

Open http://localhost:8131 in a browser.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to
`/output` and writes `/output/dossier.json` with the vendored
`vendor/makefun-frontend.ts` (kit copy, unchanged).

## Competition

[Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457) on make.fun — $50 shared by the 10 best entries ($5 each), judged pairwise by an AI judge on screenshots and source outline.

---
ref=susay21
