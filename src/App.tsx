import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import MobileNav from "./components/MobileNav"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import TransactionDetails from "./pages/TransactionDetails"
import Analytics from "./pages/Analytics"
import Accounts from "./pages/Accounts"
import Settings from "./pages/Settings"


function App() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const toggleMobileNav = () => {
    setIsMobileNavOpen((current) => !current)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-200">
        <MobileNav
          isOpen={isMobileNavOpen}
          onToggle={toggleMobileNav}
        />

        <div className="flex">
          <Sidebar />

          <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
            <div className="mx-auto max-w-7xl">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route
                  path="/transactions"
                  element={<Transactions />}
                />
                <Route
                  path="/transactions/:id"
                  element={<TransactionDetails />}
                />
                <Route
                  path="/analytics"
                  element={<Analytics />}
                />
                <Route
                  path="/accounts"
                  element={<Accounts />}
                />
                <Route
                  path="/settings"
                  element={<Settings />}
                />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App