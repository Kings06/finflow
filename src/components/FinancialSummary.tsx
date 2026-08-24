import { useTransactionsContext } from "../context/TransactionsContext"
import { calculateFinancialSummary } from "../utils/financial"
import { formatCurrency } from "../utils/currency"

function FinancialSummary() {
  const { transactions, loading, error } =
    useTransactionsContext()

  if (loading) {
    return (
      <section className="mt-6 h-32 animate-pulse rounded-2xl bg-slate-900" />
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
    <section className="mt-6 rounded-2xl bg-slate-900 p-6">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-slate-400">
            Financial Snapshot
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            You're keeping{" "}
            <span className="text-emerald-400">
              {formatCurrency(summary.totalBalance)}
            </span>
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Based on your current income and expenses.
          </p>
        </div>

        <div className="grid gap-4 border-t border-slate-800 pt-5">
          <div>
            <p className="text-sm text-slate-500">
              Income
            </p>

            <p className="mt-1 font-semibold text-emerald-400">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Expenses
            </p>

            <p className="mt-1 font-semibold text-red-400">
              {formatCurrency(summary.totalExpenses)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Retained
            </p>

            <p className="mt-1 font-semibold text-white">
              {savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinancialSummary