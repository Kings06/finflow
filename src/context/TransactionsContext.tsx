import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

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

const STORAGE_KEY = "finflow-transactions"

const API_URL =
  "https://jsonplaceholder.typicode.com/posts"

function createTransactionId(
  transactions: Transaction[],
) {
  const highestId = transactions.reduce(
    (highest, transaction) =>
      Math.max(highest, transaction.id),
    0,
  )

  return highestId + 1
}

function mapApiTransaction(
  item: {
    id: number
    title: string
    body: string
  },
): Transaction {
  return {
    id: item.id,
    description: item.title,
    amount: Math.floor(Math.random() * 90000) + 10000,
    category: "Others",
    date: new Date().toISOString().split("T")[0],
    type: item.id % 4 === 0 ? "income" : "expense",
  }
}

function TransactionsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [transactions, setTransactions] =
    useState<Transaction[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const refreshTransactions = useCallback(
    async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error(
            "Unable to fetch transactions.",
          )
        }

        const data = (await response.json()) as {
          id: number
          title: string
          body: string
        }[]

        const mappedTransactions =
          data.slice(0, 20).map(mapApiTransaction)

        setTransactions(mappedTransactions)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load transactions.",
        )
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    const storedTransactions =
      localStorage.getItem(STORAGE_KEY)

    if (storedTransactions) {
      try {
        const parsedTransactions =
          JSON.parse(storedTransactions) as Transaction[]

        setTransactions(parsedTransactions)
        setLoading(false)
        return
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    refreshTransactions()
  }, [refreshTransactions])

  useEffect(() => {
    if (loading) return

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions),
    )
  }, [transactions, loading])

  const addTransaction = async (
    transaction: Omit<Transaction, "id">,
  ): Promise<Transaction> => {
    const newTransaction: Transaction = {
      ...transaction,
      id: createTransactionId(transactions),
    }

    setTransactions((currentTransactions) => [
      ...currentTransactions,
      newTransaction,
    ])

    return newTransaction
  }

  const editTransaction = async (
    id: number,
    transaction: Omit<Transaction, "id">,
  ): Promise<Transaction> => {
    const updatedTransaction: Transaction = {
      ...transaction,
      id,
    }

    setTransactions((currentTransactions) =>
      currentTransactions.map((currentTransaction) =>
        currentTransaction.id === id
          ? updatedTransaction
          : currentTransaction,
      ),
    )

    return updatedTransaction
  }

  const removeTransaction = async (
    id: number,
  ): Promise<void> => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) =>
          transaction.id !== id,
      ),
    )
  }

  const contextValue: TransactionsContextValue = {
    transactions,
    loading,
    error,
    refreshTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
  }

  return (
    <TransactionsContext.Provider
      value={contextValue}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactionsContext() {
  const context = useContext(TransactionsContext)

  if (!context) {
    throw new Error(
      "useTransactionsContext must be used inside TransactionsProvider",
    )
  }

  return context
}

export {
  TransactionsContext,
  TransactionsProvider,
}