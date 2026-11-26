// charts.js — hand-rolled SVG charts. No library: two small builders that take
// plain numbers and return an SVG string.

import { categoryColor, monthLabel } from "./data.js";
import { money0 } from "./state.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Grouped bars: income (green) vs spending (brick) for each month.
export function incomeSpendingBars(months) {
  const W = 640, H = 280, padL = 56, padB = 34, padT = 16;
  const maxV = Math.max(1, ...months.flatMap((m) => [m.income, m.spending]));
  const innerW = W - padL - 16;
  const innerH = H - padT - padB;
  const slot = innerW / months.length;
  const barW = Math.min(30, (slot - 18) / 2);
  const y = (v) => padT + innerH - (v / maxV) * innerH;

  let bars = "";
  months.forEach((m, i) => {
    const cx = padL + slot * i + slot / 2;
    const label = monthLabel(m.month).replace(" 2026", "");
    bars += `<rect x="${(cx - barW - 3).toFixed(1)}" y="${y(m.income).toFixed(1)}" width="${barW}" height="${(padT + innerH - y(m.income)).toFixed(1)}" rx="3" fill="#1e4d3a"><title>Income ${label}: ${money0(m.income)}</title></rect>`;
    bars += `<rect x="${(cx + 3).toFixed(1)}" y="${y(m.spending).toFixed(1)}" width="${barW}" height="${(padT + innerH - y(m.spending)).toFixed(1)}" rx="3" fill="#b4552d"><title>Spending ${label}: ${money0(m.spending)}</title></rect>`;
    bars += `<text x="${cx.toFixed(1)}" y="${(H - 12).toFixed(0)}" text-anchor="middle" font-size="12" fill="#6b7a70">${esc(label)}</text>`;
  });

  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + innerH - f * innerH;
    return `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${W - 16}" y2="${gy.toFixed(1)}" stroke="#e4ddc9" stroke-width="1"/><text x="${padL - 6}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#6b7a70">${money0(maxV * f)}</text>`;
  }).join("");

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart of income versus spending by month">
    ${grid}
    <line x1="${padL}" y1="${padT + innerH}" x2="${W - 16}" y2="${padT + innerH}" stroke="#b9bfae" stroke-width="1"/>
    ${bars}
    <g font-size="12" font-weight="600">
      <rect x="${padL}" y="2" width="12" height="12" rx="3" fill="#1e4d3a"/><text x="${padL + 17}" y="12" fill="#22302a">Income</text>
      <rect x="${padL + 82}" y="2" width="12" height="12" rx="3" fill="#b4552d"/><text x="${padL + 99}" y="12" fill="#22302a">Spending</text>
    </g>
  </svg>`;
}

// Donut: share of spending by category, with a centre total.
export function spendingDonut(cats, total) {
  const size = 260, cx = 130, cy = 130, r = 96, hole = 58;
  if (!cats.length || total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending recorded"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#dfe8dd" stroke-width="34"/><text x="${cx}" y="${cy}" text-anchor="middle" font-size="14" fill="#6b7a70">No spending</text></svg>`;
  }
  let offset = 0;
  let slices = "";
  for (const c of cats) {
    const frac = c.amount / total;
    const len = frac * 2 * Math.PI * r;
    const gap = frac > 0.98 ? 0 : 2;
    slices += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${categoryColor("expense", c.category)}" stroke-width="34" stroke-dasharray="${Math.max(0, len - gap).toFixed(1)} ${(2 * Math.PI * r - Math.max(0, len - gap)).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"><title>${esc(c.category)}: ${money0(c.amount)}</title></circle>`;
    offset += len;
  }
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Donut chart of spending by category">
    ${slices}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="13" fill="#6b7a70">Spent in month</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="21" font-weight="800" fill="#143627">${money0(total)}</text>
  </svg>`;
}
