import type { Transaction } from "../types/transaction"

export type RecurringExpense = {
  description: string
  category: string
  amount: number
  occurrences: number
  averageInterval: number
  estimatedMonthlyCost: number
  estimatedYearlyCost: number
}

export function detectRecurringExpenses(
  transactions: Transaction[],
): RecurringExpense[] {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense",
  )

  const groups = new Map<string, Transaction[]>()

  expenses.forEach((transaction) => {
    const key = `${transaction.description.toLowerCase().trim()}-${transaction.category}`

    const existing = groups.get(key) ?? []

    groups.set(key, [...existing, transaction])
  })

  const recurringExpenses: RecurringExpense[] = []

  groups.forEach((items) => {
    if (items.length < 3) {
      return
    }

    const sorted = [...items].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )

    const intervals: number[] = []

    for (let index = 1; index < sorted.length; index++) {
      const previousDate = new Date(
        sorted[index - 1].date,
      ).getTime()

      const currentDate = new Date(
        sorted[index].date,
      ).getTime()

      const difference =
        (currentDate - previousDate) /
        (1000 * 60 * 60 * 24)

      intervals.push(difference)
    }

    if (intervals.length === 0) {
      return
    }

    const averageInterval =
      intervals.reduce(
        (total, interval) => total + interval,
        0,
      ) / intervals.length

    const consistentIntervals = intervals.every(
      (interval) =>
        Math.abs(interval - averageInterval) <= 7,
    )

    if (!consistentIntervals) {
      return
    }

    const averageAmount =
      items.reduce(
        (total, transaction) =>
          total + transaction.amount,
        0,
      ) / items.length

    const estimatedMonthlyCost =
      averageAmount * (30 / averageInterval)

    const estimatedYearlyCost =
      averageAmount * (365 / averageInterval)

    recurringExpenses.push({
      description: sorted[0].description,
      category: sorted[0].category,
      amount: averageAmount,
      occurrences: items.length,
      averageInterval: Math.round(averageInterval),
      estimatedMonthlyCost,
      estimatedYearlyCost,
    })
  })

  return recurringExpenses.sort(
    (a, b) =>
      b.estimatedYearlyCost -
      a.estimatedYearlyCost,
  )
}