import Header from "../components/Header"
import SummaryCards from "../components/SummaryCards"
import FinancialSummary from "../components/FinancialSummary"
import FinancialChart from "../components/FinancialChart"
import SpendingInsights from "../components/SpendingInsights"
import TransactionList from "../components/TransactionList"
import RecurringExpenses from "../components/RecurringExpenses"
import SafeToSpendCard from "../components/SafeToSpendCard"
import CashFlowForecast from "../components/CashFlowForecast"
import { useTransactionsContext } from "../context/TransactionsContext"



function Dashboard() {
    const { transactions } = useTransactionsContext()
  return (
    <div>
      <Header />

      <SummaryCards />

      <SafeToSpendCard />

      <CashFlowForecast />

      <div className="mt-10 grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FinancialChart transactions={transactions} />
        </div>

        <div>
          <FinancialSummary />
        </div>
      </div>

      <SpendingInsights />

      <TransactionList />

      <RecurringExpenses />
    </div>
  )
}

export default Dashboard