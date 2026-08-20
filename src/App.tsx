import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import SummaryCards from "./components/SummaryCards"
import FinancialChart from "./components/FinancialChart"
import TransactionList from "./components/TransactionList"

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Header />

            <SummaryCards />

            <FinancialChart />

            <TransactionList />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App