export type YieldInputs = {
  longCallPrice: number;
  shortCallPrice: number;
};

export function calculateMonthlyYield(inputs: YieldInputs): number {
  const { longCallPrice, shortCallPrice } = inputs;
  if (longCallPrice <= 0) throw new Error("longCallPrice must be > 0");
  if (shortCallPrice < 0) throw new Error("shortCallPrice must be >= 0");
  return shortCallPrice / longCallPrice;
}

export function annualizedSimple(monthlyYield: number): number {
  return monthlyYield * 12;
}

export function annualizedCompounded(monthlyYield: number): number {
  return Math.pow(1 + monthlyYield, 12) - 1;
}

export function expectedMonthlyReturn(
  monthlyYield: number,
  probabilityOfAssignment: number
): number {
  const p = Math.min(Math.max(probabilityOfAssignment, 0), 1);
  return monthlyYield * (1 - p);
}

export function estimateAssignmentProbabilityFromDelta(shortCallDelta: number): number {
  // Treat absolute delta as rough ITM probability proxy
  const d = Math.abs(shortCallDelta);
  return Math.min(Math.max(d, 0), 1);
}


