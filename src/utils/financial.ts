import type { Transaction } from "../types/transaction"

export type FinancialSummary = {
  totalIncome: number
  totalExpenses: number
  totalBalance: number
}

export function calculateFinancialSummary(
  transactions: Transaction[],
): FinancialSummary {
  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income",
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0,
    )

  const totalExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense",
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0,
    )

  return {
    totalIncome,
    totalExpenses,
    totalBalance:
      totalIncome - totalExpenses,
  }
}