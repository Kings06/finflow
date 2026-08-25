import { useTransactionsContext } from "../context/TransactionsContext"
import { calculateFinancialSummary } from "../utils/financial"
import { formatCurrency } from "../utils/currency"

function FinancialSummary() {
  const { transactions, loading, error } =
    useTransactionsContext()

  if (loading) {
    return (
      <section
        className="mt-6 h-64 animate-pulse rounded-2xl"
        style={{
          backgroundColor: "var(--surface)",
        }}
      />
    )
  }

  if (error) {
    return null
  }

  const summary = calculateFinancialSummary(transactions)

  const savingsRate =
    summary.totalIncome > 0
      ? (summary.totalBalance / summary.totalIncome) * 100
      : 0

  const balanceIsPositive =
    summary.totalBalance >= 0

  return (
    <section
      className="mt-6 rounded-2xl border p-6 transition duration-200"
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
      <div>
        <p
          className="text-sm font-medium"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Financial Snapshot
        </p>

        <h2
          className="mt-2 text-2xl font-bold tracking-tight"
          style={{
            color: "var(--text-primary)",
          }}
        >
          You're keeping{" "}
          <span
            className={
              balanceIsPositive
                ? "text-emerald-500"
                : "text-red-500"
            }
          >
            {formatCurrency(summary.totalBalance)}
          </span>
        </h2>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Based on your current income and expenses.
        </p>
      </div>

      <div
        className="mt-6 grid gap-5 border-t pt-5 sm:grid-cols-3"
        style={{
          borderColor: "var(--border)",
        }}
      >
        <div>
          <p
            className="text-sm"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Income
          </p>

          <p className="mt-1 font-semibold text-emerald-500">
            {formatCurrency(summary.totalIncome)}
          </p>
        </div>

        <div>
          <p
            className="text-sm"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Expenses
          </p>

          <p className="mt-1 font-semibold text-red-500">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </div>

        <div>
          <p
            className="text-sm"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Retained
          </p>

          <p
            className="mt-1 font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </section>
  )
}

export default FinancialSummary