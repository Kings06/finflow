import {
  useMemo,
} from "react"

import {
  useTransactionsContext,
} from "../context/TransactionsContext"

import {
  calculateFinancialSummary,
} from "../utils/financial"

import {
  formatCurrency,
} from "../utils/currency"

import {
  buildExpenseBreakdown,
} from "../utils/expenseBreakdown"

import FinancialChart from "../components/FinancialChart"

function Analytics() {
  const {
    transactions,
    loading,
    error,
  } = useTransactionsContext()

  const summary = useMemo(
    () =>
      calculateFinancialSummary(
        transactions,
      ),
    [transactions],
  )

  const expenseBreakdown = useMemo(
    () =>
      buildExpenseBreakdown(
        transactions,
      ),
    [transactions],
  )

  const topExpenseCategory =
    expenseBreakdown[0]

  const savingsRate =
    summary.totalIncome > 0
      ? (summary.totalBalance /
          summary.totalIncome) *
        100
      : 0

  const metrics = [
    {
      title: "Total Income",
      value: formatCurrency(
        summary.totalIncome,
      ),
      description:
        "Total money received",
      className:
        "text-emerald-500",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(
        summary.totalExpenses,
      ),
      description:
        "Total money spent",
      className: "text-red-500",
    },
    {
      title: "Net Balance",
      value: formatCurrency(
        summary.totalBalance,
      ),
      description:
        "Income minus expenses",
      className:
        summary.totalBalance >= 0
          ? "text-emerald-500"
          : "text-red-500",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      description:
        "Percentage of income retained",
      className:
        "text-[var(--text-primary)]",
    },
    {
      title: "Top Expense",
      value: topExpenseCategory
        ? topExpenseCategory.category
        : "No data",
      description:
        topExpenseCategory
          ? formatCurrency(
              topExpenseCategory.amount,
            )
          : "No expenses recorded",
      className:
        "text-[var(--text-primary)]",
    },
  ]

  if (loading) {
    return (
      <div>
        <header>
          <p className="text-sm font-medium text-emerald-500">
            Financial insights
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
            Analytics
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Understand your financial
            performance.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              />
            ),
          )}
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <header>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Analytics
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Understand your financial
            performance.
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
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

  return (
    <div>
      <header>
        <p className="text-sm font-medium text-emerald-500">
          Financial insights
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
          Analytics
        </h1>

        <p className="mt-2 text-[var(--text-secondary)]">
          Understand your financial
          performance.
        </p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-hover)]"
          >
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {metric.title}
            </p>

            <h2
              className={`mt-3 truncate text-3xl font-bold tracking-tight ${metric.className}`}
            >
              {metric.value}
            </h2>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {metric.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div>
          <p className="text-sm font-medium text-emerald-500">
            Spending insights
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
            Expense Breakdown
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            See how your expenses are
            distributed across categories.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {expenseBreakdown.length > 0 ? (
            expenseBreakdown.map(
              (item) => (
                <div
                  key={item.category}
                >
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--text-primary)]">
                        {item.category}
                      </p>

                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {item.percentage.toFixed(
                          1,
                        )}
                        % of expenses
                      </p>
                    </div>

                    <p className="shrink-0 font-semibold text-[var(--text-primary)]">
                      {formatCurrency(
                        item.amount,
                      )}
                    </p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          item.percentage,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
              <p className="font-medium text-[var(--text-secondary)]">
                No expense data available
              </p>

              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Expense insights will
                appear once you have
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