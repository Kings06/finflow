import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import MobileNav from "./components/MobileNav"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Analytics from "./pages/Analytics"
import Accounts from "./pages/Accounts"
import ApiTest from "./pages/ApiTest"
import TransactionsApi from "./pages/TransactionsApi"

function App() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const toggleMobileNav = () => {
    setIsMobileNavOpen((current) => !current)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
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
                  path="/analytics"
                  element={<Analytics />}
                />
                <Route
                  path="/accounts"
                  element={<Accounts />}
                />
                <Route path="/api-test" element={<ApiTest />} />
                <Route
                  path="/transactions-api"
                  element={<TransactionsApi />}
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