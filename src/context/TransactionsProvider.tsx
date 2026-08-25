import { useCallback, useEffect, useState } from "react"
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../api/transactions"
import type { Transaction } from "../types/transaction"
import {
  TransactionsContext,
} from "./TransactionsContext"

type TransactionsProviderProps = {
  children: React.ReactNode
}

function TransactionsProvider({
  children,
}: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const refreshTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getTransactions()

      setTransactions(data)
    } catch {
      setError("Failed to load transactions.")
    } finally {
      setLoading(false)
    }
  }, [])

  const addTransaction = useCallback(
    async (
      transaction: Omit<Transaction, "id">,
    ) => {
      try {
        setError(null)

        const newTransaction =
          await createTransaction(transaction)

        setTransactions((current) => [
          newTransaction,
          ...current,
        ])

        return newTransaction
      } catch {
        setError("Failed to create transaction.")
        throw new Error("Failed to create transaction.")
      }
    },
    [],
  )

  const editTransaction = useCallback(
    async (
      id: number,
      transaction: Omit<Transaction, "id">,
    ) => {
      try {
        setError(null)

        const updatedTransaction =
          await updateTransaction(id, transaction)

        setTransactions((current) =>
          current.map((item) =>
            item.id === id
              ? updatedTransaction
              : item,
          ),
        )

        return updatedTransaction
      } catch {
        setError("Failed to update transaction.")
        throw new Error("Failed to update transaction.")
      }
    },
    [],
  )

  const removeTransaction = useCallback(
    async (id: number) => {
      try {
        setError(null)

        await deleteTransaction(id)

        setTransactions((current) =>
          current.filter((item) => item.id !== id),
        )
      } catch {
        setError("Failed to delete transaction.")
        throw new Error("Failed to delete transaction.")
      }
    },
    [],
  )

  useEffect(() => {
    refreshTransactions()
  }, [refreshTransactions])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        refreshTransactions,
        addTransaction,
        editTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export default TransactionsProvider