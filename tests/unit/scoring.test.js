import { describe, expect, test } from "vitest";
import { calcOverall, calcScores } from "../../src/assessment/scoring";

describe("Scoring Engine", () => {
  test("all option-1 answers produce all 1.0", () => {
    const answers = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    const scores = calcScores(answers);
    scores.forEach((s) => expect(s.score).toBe(1));
    expect(calcOverall(scores)).toBe(1);
  });

  test("all option-5 answers produce all 5.0", () => {
    const answers = { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4 };
    const scores = calcScores(answers);
    scores.forEach((s) => expect(s.score).toBe(5));
    expect(calcOverall(scores)).toBe(5);
  });

  test("dimension averaging and overall arithmetic mean", () => {
    const answers = { 0: 4, 1: 4, 2: 0, 3: 0, 4: 2, 5: 2, 6: 3, 7: 3, 8: 1, 9: 1 };
    const scores = calcScores(answers);
    expect(scores.find((s) => s.key === "architecture")?.score).toBe(5);
    expect(scores.find((s) => s.key === "security")?.score).toBe(1);
    expect(calcOverall(scores)).toBe(3);
  });

  test("partial answers only count answered dimensions in overall", () => {
    const scores = calcScores({ 0: 4, 1: 4 });
    expect(scores.find((s) => s.key === "architecture")?.score).toBe(5);
    expect(scores.find((s) => s.key === "security")?.score).toBe(0);
    expect(calcOverall(scores)).toBe(5);
  });

  test("no answers gives all zero and overall zero", () => {
    const scores = calcScores({});
    scores.forEach((s) => expect(s.score).toBe(0));
    expect(calcOverall(scores)).toBe(0);
  });
});
