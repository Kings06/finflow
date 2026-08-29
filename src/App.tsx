import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import MobileNav from "./components/MobileNav"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import AddTransaction from "./pages/AddTransaction"
import TransactionDetails from "./pages/TransactionDetails"
import Analytics from "./pages/Analytics"
import Accounts from "./pages/Accounts"
import Settings from "./pages/Settings"
import Bills from "./pages/Bills"

import PreferencesProvider from "./context/PreferencesContext"
import BillsProvider from "./context/BillsContext"

function App() {
  const [isMobileNavOpen, setIsMobileNavOpen] =
    useState(false)

  const toggleMobileNav = () => {
    setIsMobileNavOpen((current) => !current)
  }

  return (
    <BrowserRouter>
      <PreferencesProvider>
        <BillsProvider>
          <div className="min-h-screen bg-(--background) text-(--text-primary) transition-colors duration-200">
            <MobileNav
              isOpen={isMobileNavOpen}
              onToggle={toggleMobileNav}
            />

            <div className="flex">
              <Sidebar />

              <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
                <div className="mx-auto max-w-7xl">
                  <Routes>
                    <Route
                      path="/"
                      element={<Dashboard />}
                    />

                    <Route
                      path="/transactions"
                      element={<Transactions />}
                    />

                    <Route
                      path="/transactions/new"
                      element={<AddTransaction />}
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
                      path="/bills"
                      element={<Bills />}
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
        </BillsProvider>
      </PreferencesProvider>
    </BrowserRouter>
  )
}

export default App