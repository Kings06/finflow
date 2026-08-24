import { useTransactionsContext } from "../context/TransactionsContext"
import { calculateFinancialSummary } from "../utils/financial"
import { formatCurrency } from "../utils/currency"
import { buildExpenseBreakdown } from "../utils/expenseBreakdown"
import FinancialChart from "../components/FinancialChart"

function Analytics() {
  const { transactions, loading, error } =
    useTransactionsContext()

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="mt-2 text-slate-400">
          Understand your financial performance.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl bg-slate-900"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/30 p-6">
          <p className="font-medium text-red-400">
            Unable to load analytics
          </p>

          <p className="mt-2 text-sm text-red-400/80">
            {error}
          </p>
        </div>
      </div>
    )
  }

  const summary = calculateFinancialSummary(transactions)

  const expenseBreakdown =
    buildExpenseBreakdown(transactions)

  const topExpenseCategory = expenseBreakdown[0]

  const savingsRate =
    summary.totalIncome > 0
      ? (summary.totalBalance / summary.totalIncome) * 100
      : 0

  const metrics = [
    {
      title: "Total Income",
      value: formatCurrency(summary.totalIncome),
      description: "Total money received",
      className: "text-emerald-400",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(summary.totalExpenses),
      description: "Total money spent",
      className: "text-red-400",
    },
    {
      title: "Net Balance",
      value: formatCurrency(summary.totalBalance),
      description: "Income minus expenses",
      className:
        summary.totalBalance >= 0
          ? "text-emerald-400"
          : "text-red-400",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      description: "Percentage of income retained",
      className: "text-white",
    },
    {
      title: "Top Expense",
      value: topExpenseCategory
        ? topExpenseCategory.category
        : "No data",
      description: topExpenseCategory
        ? formatCurrency(topExpenseCategory.amount)
        : "No expenses recorded",
      className: "text-white",
    },
  ]

  return (
    <div>
      <header>
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="mt-2 text-slate-400">
          Understand your financial performance.
        </p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
          >
            <p className="text-sm font-medium text-slate-400">
              {metric.title}
            </p>

            <h2
              className={`mt-3 truncate text-2xl font-bold ${metric.className}`}
            >
              {metric.value}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {metric.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div>
          <p className="text-sm font-medium text-emerald-400">
            Spending insights
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Expense Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            See how your expenses are distributed across
            categories.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {expenseBreakdown.length > 0 ? (
            expenseBreakdown.map((item) => (
              <div key={item.category}>
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {item.category}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.percentage.toFixed(1)}% of expenses
                    </p>
                  </div>

                  <p className="shrink-0 font-semibold">
                    {formatCurrency(item.amount)}
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
              <p className="font-medium text-slate-300">
                No expense data available
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Expense insights will appear once you have
                recorded expenses.
              </p>
            </div>
          )}
        </div>
      </section>

      <FinancialChart />
    </div>
  )
}

export default Analytics