import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Currency = "NGN" | "USD" | "EUR" | "GBP"

type Preferences = {
  name: string
  email: string
  currency: Currency
  notifications: boolean
}

type PreferencesContextValue = Preferences & {
  setName: (name: string) => void
  setEmail: (email: string) => void
  setCurrency: (currency: Currency) => void
  setNotifications: (enabled: boolean) => void
}

const defaultPreferences: Preferences = {
  name: "FinFlow User",
  email: "user@finflow.app",
  currency: "NGN",
  notifications: true,
}

const PreferencesContext =
  createContext<PreferencesContextValue | null>(null)

const STORAGE_KEY = "finflow-preferences"

function PreferencesProvider({
  children,
}: {
  children: ReactNode
}) {
  const [preferences, setPreferences] =
    useState<Preferences>(() => {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (!stored) {
        return defaultPreferences
      }

      try {
        return {
          ...defaultPreferences,
          ...JSON.parse(stored),
        }
      } catch {
        return defaultPreferences
      }
    })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(preferences),
    )
  }, [preferences])

  const value = useMemo(
    () => ({
      ...preferences,

      setName: (name: string) => {
        setPreferences((current) => ({
          ...current,
          name,
        }))
      },

      setEmail: (email: string) => {
        setPreferences((current) => ({
          ...current,
          email,
        }))
      },

      setCurrency: (currency: Currency) => {
        setPreferences((current) => ({
          ...current,
          currency,
        }))
      },

      setNotifications: (enabled: boolean) => {
        setPreferences((current) => ({
          ...current,
          notifications: enabled,
        }))
      },
    }),
    [preferences],
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error(
      "usePreferences must be used inside PreferencesProvider",
    )
  }

  return context
}

export default PreferencesProvider