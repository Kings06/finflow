import type { Transaction } from "../types/transaction"
import type { Bill } from "../types/bill"

export type CashFlowForecast = {
  currentBalance: number
  upcomingIncome: number
  upcomingBills: number
  projectedBalance: number
}

export function calculateCashFlowForecast(
  transactions: Transaction[],
  bills: Bill[],
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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingBills = bills
    .filter((bill) => {
      const dueDate = new Date(bill.dueDate)
      dueDate.setHours(0, 0, 0, 0)

      return dueDate >= today
    })
    .reduce(
      (total, bill) => total + bill.amount,
      0,
    )

  const projectedBalance =
    currentBalance - upcomingBills

  return {
    currentBalance,
    upcomingIncome: 0,
    upcomingBills,
    projectedBalance,
  }
}