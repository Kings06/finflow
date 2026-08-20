import { BrowserRouter, Route, Routes } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Analytics from "./pages/Analytics"
import Accounts from "./pages/Accounts"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex">
          <Sidebar />

          <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
            <div className="mx-auto max-w-7xl">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/accounts" element={<Accounts />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App