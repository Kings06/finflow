import { createContext, useContext } from "react"
import type { Transaction } from "../types/transaction"

type TransactionsContextValue = {
  transactions: Transaction[]
  loading: boolean
  error: string | null

  refreshTransactions: () => Promise<void>

  addTransaction: (
    transaction: Omit<Transaction, "id">,
  ) => Promise<Transaction>

  editTransaction: (
    id: number,
    transaction: Omit<Transaction, "id">,
  ) => Promise<Transaction>

  removeTransaction: (
    id: number,
  ) => Promise<void>
}

const TransactionsContext =
  createContext<TransactionsContextValue | undefined>(
    undefined,
  )

export function useTransactionsContext() {
  const context = useContext(TransactionsContext)

  if (!context) {
    throw new Error(
      "useTransactionsContext must be used inside TransactionsProvider",
    )
  }

  return context
}

export { TransactionsContext }