import type { Transaction } from "../types/transaction"

export type ExpenseBreakdown = {
  category: string
  amount: number
  percentage: number
}

export function buildExpenseBreakdown(
  transactions: Transaction[],
): ExpenseBreakdown[] {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense",
  )

  const totalExpenses = expenses.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  )

  const grouped = new Map<string, number>()

  expenses.forEach((transaction) => {
    const current = grouped.get(transaction.category) ?? 0

    grouped.set(
      transaction.category,
      current + transaction.amount,
    )
  })

  return Array.from(grouped.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage:
        totalExpenses > 0
          ? (amount / totalExpenses) * 100
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}