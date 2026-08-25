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

const STORAGE_KEY = "finflow-transactions"

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

      const storedTransactions =
        localStorage.getItem(STORAGE_KEY)

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions))
        return
      }

      const data = await getTransactions()

      setTransactions(data)

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data),
      )
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

        setTransactions((current) => {
          const updatedTransactions = [
            newTransaction,
            ...current,
          ]

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedTransactions),
          )

          return updatedTransactions
        })

        return newTransaction
      } catch {
        setError("Failed to create transaction.")
        throw new Error(
          "Failed to create transaction.",
        )
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

        setTransactions((current) => {
          const updatedTransactions = current.map(
            (item) =>
              item.id === id
                ? updatedTransaction
                : item,
          )

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedTransactions),
          )

          return updatedTransactions
        })

        return updatedTransaction
      } catch {
        setError("Failed to update transaction.")
        throw new Error(
          "Failed to update transaction.",
        )
      }
    },
    [],
  )

  const removeTransaction = useCallback(
    async (id: number) => {
      try {
        setError(null)

        await deleteTransaction(id)

        setTransactions((current) => {
          const updatedTransactions =
            current.filter(
              (item) => item.id !== id,
            )

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedTransactions),
          )

          return updatedTransactions
        })
      } catch {
        setError("Failed to delete transaction.")
        throw new Error(
          "Failed to delete transaction.",
        )
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