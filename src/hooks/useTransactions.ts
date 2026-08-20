import { useEffect, useState } from "react"
import { getTransactions } from "../api/transactions"
import type { ApiPost } from "../types/api"

type UseTransactionsResult = {
  transactions: ApiPost[]
  loading: boolean
  error: string | null
}

export function useTransactions(): UseTransactionsResult {
  const [transactions, setTransactions] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTransactions() {
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
    }

    loadTransactions()
  }, [])

  return {
    transactions,
    loading,
    error,
  }
}