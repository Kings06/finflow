import type { Transaction } from "../types/transaction"
import type { Bill } from "../types/bill"

export type SafeToSpendResult = {
  currentBalance: number
  upcomingExpenses: number
  safeToSpend: number
}

export function calculateSafeToSpend(
  transactions: Transaction[],
  bills: Bill[],
): SafeToSpendResult {
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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingExpenses = bills
    .filter((bill) => {
      const dueDate = new Date(bill.dueDate)
      dueDate.setHours(0, 0, 0, 0)

      return dueDate >= today
    })
    .reduce(
      (total, bill) => total + bill.amount,
      0,
    )

  const safeToSpend = Math.max(
    currentBalance - upcomingExpenses,
    0,
  )

  return {
    currentBalance,
    upcomingExpenses,
    safeToSpend,
  }
}