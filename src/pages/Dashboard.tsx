import Header from "../components/Header"
import SummaryCards from "../components/SummaryCards"
import FinancialSummary from "../components/FinancialSummary"
import FinancialChart from "../components/FinancialChart"
import TransactionList from "../components/TransactionList"

function Dashboard() {
  return (
    <div>
      <Header />

      <SummaryCards />

      <div className="mt-8 grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FinancialChart />
        </div>

        <div>
          <FinancialSummary />
        </div>
      </div>

      <TransactionList />
    </div>
  )
}

export default Dashboard