import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { Account } from "../types/account"

type NewAccount = Omit<Account, "id" | "createdAt">

type AccountUpdates = Partial<
  Omit<Account, "id" | "createdAt">
>

type AccountsContextValue = {
  accounts: Account[]
  loading: boolean
  error: string | null
  addAccount: (account: NewAccount) => void
  updateAccount: (
    id: string,
    updates: AccountUpdates,
  ) => void
  deleteAccount: (id: string) => void
}

const AccountsContext =
  createContext<AccountsContextValue | undefined>(
    undefined,
  )

const STORAGE_KEY = "finflow-accounts"

function AccountsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const storedAccounts =
        localStorage.getItem(STORAGE_KEY)

      if (!storedAccounts) {
        setAccounts([])
        return
      }

      const parsedAccounts = JSON.parse(
        storedAccounts,
      )

      if (!Array.isArray(parsedAccounts)) {
        throw new Error("Invalid account data")
      }

      setAccounts(parsedAccounts)
    } catch {
      setError("Unable to load your accounts.")
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (loading) {
      return
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(accounts),
      )
    } catch {
      setError("Unable to save your accounts.")
    }
  }, [accounts, loading])

  const addAccount = useCallback(
    (account: NewAccount) => {
      setAccounts((currentAccounts) => [
        ...currentAccounts,
        {
          ...account,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
      ])

      setError(null)
    },
    [],
  )

  const updateAccount = useCallback(
    (id: string, updates: AccountUpdates) => {
      setAccounts((currentAccounts) =>
        currentAccounts.map((account) =>
          account.id === id
            ? {
                ...account,
                ...updates,
              }
            : account,
        ),
      )

      setError(null)
    },
    [],
  )

  const deleteAccount = useCallback((id: string) => {
    setAccounts((currentAccounts) =>
      currentAccounts.filter(
        (account) => account.id !== id,
      ),
    )

    setError(null)
  }, [])

  const value = useMemo(
    () => ({
      accounts,
      loading,
      error,
      addAccount,
      updateAccount,
      deleteAccount,
    }),
    [
      accounts,
      loading,
      error,
      addAccount,
      updateAccount,
      deleteAccount,
    ],
  )

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  )
}

function useAccountsContext() {
  const context = useContext(AccountsContext)

  if (!context) {
    throw new Error(
      "useAccountsContext must be used inside AccountsProvider",
    )
  }

  return context
}

export {
  AccountsProvider,
  useAccountsContext,
}