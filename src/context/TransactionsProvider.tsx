import { useCallback, useEffect, useState } from "react"
import { getTransactions } from "../api/transactions"
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
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export default TransactionsProvider