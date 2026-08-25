import { useTransactionsContext } from "../context/TransactionsContext"
import { calculateFinancialSummary } from "../utils/financial"
import { formatCurrency } from "../utils/currency"

function FinancialSummary() {
  const { transactions, loading, error } =
    useTransactionsContext()

  if (loading) {
    return (
      <section className="mt-6 h-32 animate-pulse rounded-2xl bg-[var(--surface)]" />
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

  return (
    <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition duration-200 hover:bg-[var(--surface-hover)]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Financial Snapshot
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            You're keeping{" "}
            <span className="text-emerald-500">
              {formatCurrency(summary.totalBalance)}
            </span>
          </h2>

          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Based on your current income and expenses.
          </p>
        </div>

        <div className="grid gap-5 border-t border-[var(--border)] pt-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-[var(--text-muted)]">
              Income
            </p>

            <p className="mt-1 font-semibold text-emerald-500">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--text-muted)]">
              Expenses
            </p>

            <p className="mt-1 font-semibold text-red-500">
              {formatCurrency(summary.totalExpenses)}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--text-muted)]">
              Retained
            </p>

            <p className="mt-1 font-semibold text-[var(--text-primary)]">
              {savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinancialSummary