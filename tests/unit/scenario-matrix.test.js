import { describe, expect, test } from "vitest";
import { getDetail, getLevel } from "../../src/assessment/classification";
import { calcOverall, calcScores } from "../../src/assessment/scoring";

function toAnswerMap(arr) {
  return Object.fromEntries(arr.map((v, i) => [i, v]));
}

describe("Score Scenario Matrix", () => {
  const scenarios = [
    { name: "All lowest", answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], overall: 1.0, level: "Initial" },
    { name: "All highest", answers: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4], overall: 5.0, level: "Leading" },
    { name: "All middle", answers: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2], overall: 3.0, level: "Established" },
    { name: "Ascending", answers: [0, 1, 1, 2, 2, 3, 3, 4, 4, 4], overall: 3.4, level: "Established" },
    { name: "Descending", answers: [4, 4, 3, 3, 2, 2, 1, 1, 0, 0], overall: 3.0, level: "Established" },
    { name: "Strong security only", answers: [0, 0, 4, 4, 0, 0, 0, 0, 0, 0], overall: 1.8, level: "Developing" },
    { name: "All 4s", answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], overall: 4.0, level: "Advanced" },
  ];

  test.each(scenarios)("$name", ({ answers, overall, level }) => {
    const scores = calcScores(toAnswerMap(answers));
    expect(calcOverall(scores)).toBe(overall);
    expect(getLevel(overall).label).toBe(level);
  });
});

describe("Boundary Conditions", () => {
  test("2.0 low, 2.1 mid, 3.5 mid, 3.6 high", () => {
    expect(getDetail("architecture", 2).headline).toContain("fragmentation");
    expect(getDetail("architecture", 2.1).headline).toContain("Partial centralization");
    expect(getDetail("architecture", 3.5).headline).toContain("Partial centralization");
    expect(getDetail("architecture", 3.6).headline).toContain("Strong foundation");
  });

  test("exact level boundaries", () => {
    expect(getLevel(2.5).label).toBe("Established");
    expect(getLevel(3.5).label).toBe("Advanced");
    expect(getLevel(4.5).label).toBe("Leading");
  });

  test("mixed decimal overall rounds correctly to 3.4", () => {
    const answers = { 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 4 };
    const scores = calcScores(answers);
    expect(scores.find((s) => s.key === "architecture")?.score).toBe(1.5);
    expect(scores.find((s) => s.key === "security")?.score).toBe(2.5);
    expect(scores.find((s) => s.key === "operations")?.score).toBe(3.5);
    expect(scores.find((s) => s.key === "devex")?.score).toBe(4.5);
    expect(scores.find((s) => s.key === "compliance")?.score).toBe(5);
    expect(calcOverall(scores)).toBe(3.4);
  });
});
