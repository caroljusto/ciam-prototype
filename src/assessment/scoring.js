import { DIMS, QS } from "./constants";

export function calcScores(ans) {
  const grouped = {};
  DIMS.forEach((d) => {
    grouped[d.key] = [];
  });

  QS.forEach((q, i) => {
    if (ans[i] !== undefined) {
      grouped[q.dim].push(q.opts[ans[i]].s);
    }
  });

  return DIMS.map((d) => {
    const arr = grouped[d.key];
    const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    return { ...d, score: Math.round(avg * 10) / 10 };
  });
}

export function calcOverall(scores) {
  const vals = scores.map((s) => s.score).filter(Boolean);
  return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0;
}
