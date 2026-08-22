import Header from "../components/Header"
import SummaryCards from "../components/SummaryCards"
import FinancialChart from "../components/FinancialChart"
import TransactionList from "../components/TransactionList"
import FinancialSummary from "../components/FinancialSummary"

function Dashboard() {
  return (
    <>
      <Header />
      <SummaryCards />
      <FinancialSummary />
      <FinancialChart />
      <TransactionList />
    </>
  )
}

export default Dashboard