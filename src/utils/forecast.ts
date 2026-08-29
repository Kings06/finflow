import type { Transaction } from "../types/transaction"

export type CashFlowForecast = {
  currentBalance: number
  averageDailyExpense: number
  projectedExpenses: number
  projectedBalance: number
}

export function calculateCashFlowForecast(
  transactions: Transaction[],
  days = 30,
): CashFlowForecast {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0,
    )

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0,
    )

  const currentBalance = income - expenses

  if (transactions.length === 0) {
    return {
      currentBalance: 0,
      averageDailyExpense: 0,
      projectedExpenses: 0,
      projectedBalance: 0,
    }
  }

  const dates = transactions.map((transaction) =>
    new Date(transaction.date).getTime(),
  )

  const earliestDate = Math.min(...dates)
  const latestDate = Math.max(...dates)

  const daysCovered = Math.max(
    1,
    Math.ceil(
      (latestDate - earliestDate) /
        (1000 * 60 * 60 * 24),
    ) + 1,
  )

  const averageDailyExpense =
    expenses / daysCovered

  const projectedExpenses =
    averageDailyExpense * days

  const projectedBalance =
    currentBalance - projectedExpenses

  return {
    currentBalance,
    averageDailyExpense,
    projectedExpenses,
    projectedBalance,
  }
}