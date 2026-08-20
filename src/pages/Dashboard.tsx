import Header from "../components/Header"
import SummaryCards from "../components/SummaryCards"
import FinancialChart from "../components/FinancialChart"
import TransactionList from "../components/TransactionList"

function Dashboard() {
  return (
    <>
      <Header />
      <SummaryCards />
      <FinancialChart />
      <TransactionList />
    </>
  )
}

export default Dashboard