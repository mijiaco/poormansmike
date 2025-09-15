import { describe, it, expect } from "vitest";
import {
  calculateMonthlyYield,
  annualizedSimple,
  annualizedCompounded,
  expectedMonthlyReturn,
  estimateAssignmentProbabilityFromDelta,
} from "./formulas";

describe("formulas", () => {
  it("calculates monthly yield", () => {
    expect(calculateMonthlyYield({ longCallPrice: 10, shortCallPrice: 1 })).toBeCloseTo(0.1, 6);
  });

  it("annualizes simple and compounded", () => {
    const m = 0.1;
    expect(annualizedSimple(m)).toBeCloseTo(1.2, 6);
    expect(annualizedCompounded(m)).toBeCloseTo(Math.pow(1.1, 12) - 1, 6);
  });

  it("expected monthly return accounts for assignment prob", () => {
    const m = 0.1;
    const p = 0.3;
    expect(expectedMonthlyReturn(m, p)).toBeCloseTo(0.07, 6);
  });

  it("estimates assignment probability from delta", () => {
    expect(estimateAssignmentProbabilityFromDelta(-0.25)).toBeCloseTo(0.25, 6);
  });
});


