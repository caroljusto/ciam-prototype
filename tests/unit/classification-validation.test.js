import { describe, expect, test } from "vitest";
import { getDetail, getLevel } from "../../src/assessment/classification";
import { validateWorkEmail } from "../../src/assessment/validation";

describe("Level Classification", () => {
  test("boundaries map to expected labels", () => {
    expect(getLevel(1.4).label).toBe("Initial");
    expect(getLevel(1.5).label).toBe("Developing");
    expect(getLevel(2.5).label).toBe("Established");
    expect(getLevel(3.5).label).toBe("Advanced");
    expect(getLevel(4.5).label).toBe("Leading");
    expect(getLevel(5.0).label).toBe("Leading");
  });

  test("score 0 uses fallback Initial level", () => {
    expect(getLevel(0).label).toBe("Initial");
  });
});

describe("Insight Selection", () => {
  test("insight thresholds are <=2 low, <=3.5 mid, >3.5 high", () => {
    expect(getDetail("security", 2).headline).toContain("exposed");
    expect(getDetail("security", 2.1).headline).toContain("Basic defenses");
    expect(getDetail("security", 3.5).headline).toContain("Basic defenses");
    expect(getDetail("security", 3.6).headline).toContain("Strong posture");
  });
});

describe("Email Validation", () => {
  test("invalid format returns emailErr", () => {
    const result = validateWorkEmail("not-an-email");
    expect(result.ok).toBe(false);
    expect(result.emailErr).toBe(true);
  });

  test("personal domains are blocked", () => {
    const result = validateWorkEmail("person@gmail.com");
    expect(result.ok).toBe(false);
    expect(result.domainErr).toBe(true);
  });

  test("work domains pass", () => {
    const result = validateWorkEmail("name@company.com");
    expect(result.ok).toBe(true);
  });
});
