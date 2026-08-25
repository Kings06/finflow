import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import TransactionsProvider from "./context/TransactionsProvider"
import { ThemeProvider } from "./context/ThemeContext"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TransactionsProvider>
        <App />
      </TransactionsProvider>
    </ThemeProvider>
  </StrictMode>,
)