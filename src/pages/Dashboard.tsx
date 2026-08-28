import Header from "../components/Header"
import SummaryCards from "../components/SummaryCards"
import FinancialSummary from "../components/FinancialSummary"
import FinancialChart from "../components/FinancialChart"
import SpendingInsights from "../components/SpendingInsights"
import TransactionList from "../components/TransactionList"

function Dashboard() {
  return (
    <div>
      <Header />

      <SummaryCards />

      <div className="mt-10 grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FinancialChart />
        </div>

        <div>
          <FinancialSummary />
        </div>
      </div>

      <SpendingInsights />

      <TransactionList />
    </div>
  )
}

export default Dashboard