import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Currency =
  | "NGN"
  | "USD"
  | "EUR"
  | "GBP"

type Preferences = {
  name: string
  email: string
  currency: Currency
  notifications: boolean
}

type PreferencesContextValue =
  Preferences & {
    setName: (name: string) => void
    setEmail: (email: string) => void
    setCurrency: (currency: Currency) => void
    setNotifications: (
      enabled: boolean,
    ) => void
  }

const defaultPreferences: Preferences = {
  name: "FinFlow User",
  email: "user@finflow.app",
  currency: "NGN",
  notifications: true,
}

const STORAGE_KEY = "finflow-preferences"

const PreferencesContext =
  createContext<PreferencesContextValue | null>(
    null,
  )

function getStoredPreferences(): Preferences {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return defaultPreferences
    }

    const parsed = JSON.parse(stored)

    return {
      ...defaultPreferences,
      ...parsed,
    }
  } catch {
    return defaultPreferences
  }
}

function PreferencesProvider({
  children,
}: {
  children: ReactNode
}) {
  const [preferences, setPreferences] =
    useState<Preferences>(
      getStoredPreferences,
    )

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(preferences),
      )
    } catch {
      // Ignore storage failures.
    }
  }, [preferences])

  const setName = useCallback(
    (name: string) => {
      setPreferences((current) => ({
        ...current,
        name,
      }))
    },
    [],
  )

  const setEmail = useCallback(
    (email: string) => {
      setPreferences((current) => ({
        ...current,
        email,
      }))
    },
    [],
  )

  const setCurrency = useCallback(
    (currency: Currency) => {
      setPreferences((current) => ({
        ...current,
        currency,
      }))
    },
    [],
  )

  const setNotifications = useCallback(
    (enabled: boolean) => {
      setPreferences((current) => ({
        ...current,
        notifications: enabled,
      }))
    },
    [],
  )

  const value = useMemo(
    () => ({
      ...preferences,
      setName,
      setEmail,
      setCurrency,
      setNotifications,
    }),
    [
      preferences,
      setName,
      setEmail,
      setCurrency,
      setNotifications,
    ],
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(
    PreferencesContext,
  )

  if (!context) {
    throw new Error(
      "usePreferences must be used inside PreferencesProvider",
    )
  }

  return context
}

export default PreferencesProvider