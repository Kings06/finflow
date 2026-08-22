import { useTransactionsContext } from "../context/TransactionsContext"
import { calculateFinancialSummary } from "../utils/financial"

function SummaryCards() {
  const { transactions, loading, error } = useTransactionsContext()

  const summary = calculateFinancialSummary(transactions)

  if (loading) {
    return (
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {["Balance", "Income", "Expenses"].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl bg-slate-900"
          />
        ))}
      </section>
    )
  }

  if (error) {
    return (
      <div className="mt-8 rounded-2xl bg-red-950/40 p-6 text-red-400">
        {error}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Balance",
      amount: summary.totalBalance,
      description: "Available balance",
    },
    {
      title: "Total Income",
      amount: summary.totalIncome,
      description: "Money received",
    },
    {
      title: "Total Expenses",
      amount: summary.totalExpenses,
      description: "Money spent",
    },
  ]

  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-slate-900 p-6"
        >
          <p className="text-sm text-slate-400">
            {card.title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            ₦{card.amount.toLocaleString()}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {card.description}
          </p>
        </div>
      ))}
    </section>
  )
}

export default SummaryCards