import { useTransactionsContext } from "../context/TransactionsContext"
import { calculateFinancialSummary } from "../utils/financial"
import { formatCurrency } from "../utils/currency"
import { getFinancialStatus } from "../utils/financialStatus"

function SummaryCards() {
  const { transactions, loading, error } =
    useTransactionsContext()

  const summary = calculateFinancialSummary(transactions)

  if (loading) {
    return (
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {["Balance", "Income", "Expenses"].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl"
            style={{
              backgroundColor: "var(--surface)",
            }}
          />
        ))}
      </section>
    )
  }

  if (error) {
    return (
      <div
        className="mt-8 rounded-2xl border p-6 text-red-400"
        style={{
          borderColor: "rgba(239, 68, 68, 0.2)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
        }}
      >
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

  const balanceStatus = getFinancialStatus(
    summary.totalBalance,
  )

  const balanceColor =
    balanceStatus === "positive"
      ? "text-emerald-500"
      : balanceStatus === "negative"
        ? "text-red-500"
        : ""

  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const isBalance =
          card.title === "Total Balance"

        return (
          <div
            key={card.title}
            className="rounded-2xl border p-6 transition duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor =
                "var(--surface-hover)"
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor =
                "var(--surface)"
            }}
          >
            <p
              className="text-sm font-medium"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {card.title}
            </p>

            <h2
              className={`mt-3 text-3xl font-bold tracking-tight ${
                isBalance
                  ? balanceColor
                  : ""
              }`}
              style={
                !isBalance ||
                balanceStatus === "neutral"
                  ? {
                      color: "var(--text-primary)",
                    }
                  : undefined
              }
            >
              {formatCurrency(card.amount)}
            </h2>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--text-muted)",
              }}
            >
              {card.description}
            </p>
          </div>
        )
      })}
    </section>
  )
}

export default SummaryCards