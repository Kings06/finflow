export type FinancialStatus =
  | "positive"
  | "negative"
  | "neutral"

export function getFinancialStatus(
  amount: number,
): FinancialStatus {
  if (amount > 0) {
    return "positive"
  }

  if (amount < 0) {
    return "negative"
  }

  return "neutral"
}