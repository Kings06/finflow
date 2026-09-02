import type { Transaction } from "../types/transaction"

export type TransactionSort =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest"

export function sortTransactions(
  transactions: Transaction[],
  sort: TransactionSort,
): Transaction[] {
  return [...transactions].sort((a, b) => {
    switch (sort) {
      case "newest":
        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        )

      case "oldest":
        return (
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
        )

      case "highest":
        return b.amount - a.amount

      case "lowest":
        return a.amount - b.amount

      default:
        return 0
    }
  })
}

export function calculateTransactionTotals(
  transactions: Transaction[],
) {
  return transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === "income") {
        totals.income += transaction.amount
      } else {
        totals.expenses += transaction.amount
      }

      return totals
    },
    {
      income: 0,
      expenses: 0,
    },
  )
}