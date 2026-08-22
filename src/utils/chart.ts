import type { Transaction } from "../types/transaction"

export type FinancialChartPoint = {
  date: string
  income: number
  expenses: number
}

export function buildFinancialChartData(
  transactions: Transaction[],
): FinancialChartPoint[] {
  const grouped = new Map<string, FinancialChartPoint>()

  transactions.forEach((transaction) => {
    const date = transaction.date

    if (!grouped.has(date)) {
      grouped.set(date, {
        date,
        income: 0,
        expenses: 0,
      })
    }

    const point = grouped.get(date)!

    if (transaction.type === "income") {
      point.income += transaction.amount
    } else {
      point.expenses += transaction.amount
    }
  })

  return Array.from(grouped.values()).sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  )
}