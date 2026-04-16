import { describe, expect, test } from "vitest";
import { DIMS, DIM_DETAIL, LEVELS, OVERALL_DESC, QS } from "../../src/assessment/constants";

describe("Data Integrity", () => {
  test("exactly 10 questions with 5 options each", () => {
    expect(QS.length).toBe(10);
    QS.forEach((q) => expect(q.opts.length).toBe(5));
  });

  test("option scores are sequential 1..5", () => {
    QS.forEach((q) => {
      expect(q.opts.map((o) => o.s)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  test("2 questions per dimension", () => {
    const counts = {};
    QS.forEach((q) => {
      counts[q.dim] = (counts[q.dim] || 0) + 1;
    });
    Object.values(counts).forEach((c) => expect(c).toBe(2));
  });

  test("levels are contiguous and cover production range 1..5+", () => {
    for (let i = 1; i < LEVELS.length; i += 1) {
      expect(LEVELS[i].min).toBe(LEVELS[i - 1].max);
    }
    expect(LEVELS[0].min).toBe(1);
    expect(LEVELS[LEVELS.length - 1].max).toBeGreaterThan(5);
  });

  test("overall descriptions and detail tiers exist for all dimensions", () => {
    LEVELS.forEach((l) => expect(OVERALL_DESC[l.label]).toBeTruthy());
    DIMS.forEach((d) => {
      expect(DIM_DETAIL[d.key]).toBeTruthy();
      expect(DIM_DETAIL[d.key].low).toBeTruthy();
      expect(DIM_DETAIL[d.key].mid).toBeTruthy();
      expect(DIM_DETAIL[d.key].high).toBeTruthy();
    });
  });
});
