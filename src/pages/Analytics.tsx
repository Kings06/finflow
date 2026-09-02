import { useMemo, useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Lightbulb,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react"

import FinancialChart from "../components/FinancialChart"
import { useTransactionsContext } from "../context/TransactionsContext"
import {
  calculateFinancialSummary,
} from "../utils/financial"
import {
  buildExpenseBreakdown,
} from "../utils/expenseBreakdown"
import { formatCurrency } from "../utils/currency"

type AnalyticsPeriod =
  | "month"
  | "30days"
  | "3months"
  | "year"
  | "all"

const periodOptions: {
  value: AnalyticsPeriod
  label: string
}[] = [
  { value: "month", label: "This Month" },
  { value: "30days", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
]

function getPeriodStart(period: AnalyticsPeriod) {
  const now = new Date()

  if (period === "month") {
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    )
  }

  if (period === "30days") {
    const start = new Date(now)
    start.setDate(start.getDate() - 30)
    return start
  }

  if (period === "3months") {
    const start = new Date(now)
    start.setMonth(start.getMonth() - 3)
    return start
  }

  if (period === "year") {
    return new Date(
      now.getFullYear(),
      0,
      1,
    )
  }

  return null
}

function Analytics() {
  const {
    transactions,
    loading,
    error,
  } = useTransactionsContext()

  const [period, setPeriod] =
    useState<AnalyticsPeriod>("month")

  const filteredTransactions = useMemo(() => {
    const periodStart = getPeriodStart(period)

    if (!periodStart) {
      return transactions
    }

    const startTime = periodStart.getTime()

    return transactions.filter(
      (transaction) =>
        new Date(transaction.date).getTime() >=
        startTime,
    )
  }, [transactions, period])

  const summary = useMemo(
    () =>
      calculateFinancialSummary(
        filteredTransactions,
      ),
    [filteredTransactions],
  )

  const expenseBreakdown = useMemo(
    () =>
      buildExpenseBreakdown(
        filteredTransactions,
      ),
    [filteredTransactions],
  )

  const savingsRate =
    summary.totalIncome > 0
      ? (summary.totalBalance /
          summary.totalIncome) *
        100
      : 0

  const topExpense =
    expenseBreakdown.length > 0
      ? expenseBreakdown[0]
      : null

  const averageTransaction =
    filteredTransactions.length > 0
      ? (summary.totalIncome +
          summary.totalExpenses) /
        filteredTransactions.length
      : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--surface-hover)]" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              />
            ),
          )}
        </div>

        <div className="h-[420px] animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        <h2 className="font-semibold">
          Unable to load analytics
        </h2>

        <p className="mt-1 text-sm">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3
              size={22}
              className="text-emerald-500"
            />

            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Analytics
            </h1>
          </div>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Understand your financial performance
            and spending habits.
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2">
          <CalendarDays
            size={18}
            className="text-[var(--text-muted)]"
          />

          <select
            value={period}
            onChange={(event) =>
              setPeriod(
                event.target
                  .value as AnalyticsPeriod,
              )
            }
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
          >
            {periodOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              Total Income
            </span>

            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-emerald-600">
            {formatCurrency(
              summary.totalIncome,
            )}
          </p>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Money received
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              Total Expenses
            </span>

            <div className="rounded-xl bg-red-50 p-2 text-red-500">
              <ArrowDownRight size={18} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-red-500">
            {formatCurrency(
              summary.totalExpenses,
            )}
          </p>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Money spent
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              Net Balance
            </span>

            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Wallet size={18} />
            </div>
          </div>

          <p
            className={`mt-4 text-2xl font-bold ${
              summary.totalBalance >= 0
                ? "text-[var(--text-primary)]"
                : "text-red-500"
            }`}
          >
            {formatCurrency(
              summary.totalBalance,
            )}
          </p>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Income minus expenses
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              Savings Rate
            </span>

            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <PiggyBank size={18} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
            {savingsRate.toFixed(1)}%
          </p>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Of your income retained
          </p>
        </div>
      </div>

      {/* Chart + breakdown */}
      {filteredTransactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <BarChart3 size={26} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
            No financial activity yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
            There are no transactions in the
            selected period. Add some transactions
            to start seeing your financial insights.
          </p>
        </div>
      ) : (
        <>
          <FinancialChart
            transactions={filteredTransactions}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Expense breakdown */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    Expense Breakdown
                  </h2>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Where your money is going
                  </p>
                </div>

                <TrendingUp
                  size={20}
                  className="text-emerald-500"
                />
              </div>

              <div className="mt-6 space-y-5">
                {expenseBreakdown.length ===
                0 ? (
                  <p className="py-6 text-center text-sm text-[var(--text-muted)]">
                    No expenses in this period.
                  </p>
                ) : (
                  expenseBreakdown
                    .slice(0, 6)
                    .map((expense) => (
                      <div
                        key={expense.category}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[var(--text-primary)]">
                            {expense.category}
                          </span>

                          <span className="text-[var(--text-secondary)]">
                            {formatCurrency(
                              expense.amount,
                            )}
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{
                              width: `${Math.min(
                                expense.percentage,
                                100,
                              )}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {expense.percentage.toFixed(
                            1,
                          )}
                          %
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Financial insights */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                  <Lightbulb size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    Financial Insights
                  </h2>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Highlights from this period
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {summary.totalBalance >=
                    0
                      ? "You're spending within your income."
                      : "Your expenses are higher than your income."}
                  </p>

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Your net position for this period
                    is{" "}
                    <strong>
                      {formatCurrency(
                        Math.abs(
                          summary.totalBalance,
                        ),
                      )}
                    </strong>
                    .
                  </p>
                </div>

                {topExpense && (
                  <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Top spending category
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {topExpense.category} accounts
                      for{" "}
                      <strong>
                        {topExpense.percentage.toFixed(
                          1,
                        )}
                        %
                      </strong>{" "}
                      of your expenses.
                    </p>
                  </div>
                )}

                <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Transaction activity
                  </p>

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    You recorded{" "}
                    <strong>
                      {filteredTransactions.length}
                    </strong>{" "}
                    transaction
                    {filteredTransactions.length ===
                    1
                      ? ""
                      : "s"} in this period.
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Average transaction
                  </p>

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Your average transaction value
                    was{" "}
                    <strong>
                      {formatCurrency(
                        averageTransaction,
                      )}
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics