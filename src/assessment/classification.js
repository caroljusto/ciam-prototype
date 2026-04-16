import { DIM_DETAIL, LEVELS } from "./constants";

export function getLevel(score) {
  return LEVELS.find((l) => score >= l.min && score < l.max) || LEVELS[0];
}

export function getDetail(dim, score) {
  if (score <= 2) return DIM_DETAIL[dim].low;
  if (score <= 3.5) return DIM_DETAIL[dim].mid;
  return DIM_DETAIL[dim].high;
}
