import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type Theme = "dark" | "light" | "system"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<
  ThemeContextValue | undefined
>(undefined)

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem("finflow-theme")

  if (
    savedTheme === "dark" ||
    savedTheme === "light" ||
    savedTheme === "system"
  ) {
    return savedTheme
  }

  return "dark"
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement

    root.classList.remove("dark", "light")

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches

      root.classList.add(prefersDark ? "dark" : "light")
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem("finflow-theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(
      "useTheme must be used within a ThemeProvider",
    )
  }

  return context
}

export { ThemeProvider, useTheme }