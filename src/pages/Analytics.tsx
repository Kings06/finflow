import { useMemo, useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Lightbulb,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"

import FinancialChart from "../components/FinancialChart"
import { useTransactionsContext } from "../context/TransactionsContext"
import { calculateFinancialSummary } from "../utils/financial"
import { buildExpenseBreakdown } from "../utils/expenseBreakdown"
import { formatCurrency } from "../utils/currency"

type AnalyticsPeriod =
  | "month"
  | "30days"
  | "3months"
  | "year"
  | "all"

type ComparisonResult = {
  current: number
  previous: number
  percentageChange: number
}

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

function getComparisonDates(
  period: AnalyticsPeriod,
) {
  const now = new Date()

  if (period === "month") {
  const previousStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  )

  const previousEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
  )

  return {
    previousStart,
    previousEnd,
  }
}

  if (period === "30days") {
    const currentStart = new Date(now)
    currentStart.setDate(
      currentStart.getDate() - 30,
    )

    const previousStart = new Date(now)
    previousStart.setDate(
      previousStart.getDate() - 60,
    )

    return {
      previousStart,
      previousEnd: currentStart,
    }
  }

  if (period === "3months") {
    const currentStart = new Date(now)
    currentStart.setMonth(
      currentStart.getMonth() - 3,
    )

    const previousStart = new Date(now)
    previousStart.setMonth(
      previousStart.getMonth() - 6,
    )

    return {
      previousStart,
      previousEnd: currentStart,
    }
  }

  if (period === "year") {
    const previousStart = new Date(
      now.getFullYear() - 1,
      0,
      1,
    )

    const previousEnd = new Date(
      now.getFullYear() - 1,
      11,
      31,
    )

    return {
      previousStart,
      previousEnd,
    }
  }

  return null
}

function calculatePercentageChange(
  current: number,
  previous: number,
) {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }

  return (
    ((current - previous) /
      Math.abs(previous)) *
    100
  )
}

function getComparisonLabel(
  percentageChange: number,
) {
  if (percentageChange === 0) {
    return "No change"
  }

  return `${Math.abs(percentageChange).toFixed(1)}%`
}

function ComparisonIndicator({
  comparison,
  positiveDirection = "up",
}: {
  comparison: ComparisonResult
  positiveDirection?: "up" | "down"
}) {
  if (comparison.previous === 0) {
    if (comparison.current === 0) {
      return (
        <span className="text-xs text-[var(--text-muted)]">
          No change vs previous period
        </span>
      )
    }

    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium ${
          comparison.current > 0
            ? positiveDirection === "up"
              ? "text-emerald-600"
              : "text-red-500"
            : "text-[var(--text-muted)]"
        }`}
      >
        {positiveDirection === "up" ? (
          <ArrowUpRight size={14} />
        ) : (
          <ArrowDownRight size={14} />
        )}
        New activity this period
      </span>
    )
  }

  if (comparison.percentageChange === 0) {
    return (
      <span className="text-xs text-[var(--text-muted)]">
        No change vs previous period
      </span>
    )
  }

  const increased =
    comparison.percentageChange > 0

  const isPositive =
    positiveDirection === "up"
      ? increased
      : !increased

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isPositive
          ? "text-emerald-600"
          : "text-red-500"
      }`}
    >
      {increased ? (
        <ArrowUpRight size={14} />
      ) : (
        <ArrowDownRight size={14} />
      )}

      {getComparisonLabel(
        comparison.percentageChange,
      )}{" "}
      vs previous period
    </span>
  )
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
        new Date(
          transaction.date,
        ).getTime() >= startTime,
    )
  }, [transactions, period])

  const previousTransactions = useMemo(() => {
    const dates = getComparisonDates(period)

    if (!dates) {
      return []
    }

    const previousStart =
      dates.previousStart.getTime()

    const previousEnd =
      dates.previousEnd.getTime()

    return transactions.filter(
      (transaction) => {
        const transactionTime =
          new Date(
            transaction.date,
          ).getTime()

        return (
          transactionTime >= previousStart &&
          transactionTime <= previousEnd
        )
      },
    )
  }, [transactions, period])

  const summary = useMemo(
    () =>
      calculateFinancialSummary(
        filteredTransactions,
      ),
    [filteredTransactions],
  )

  const previousSummary = useMemo(
    () =>
      calculateFinancialSummary(
        previousTransactions,
      ),
    [previousTransactions],
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

  const previousSavingsRate =
    previousSummary.totalIncome > 0
      ? (previousSummary.totalBalance /
          previousSummary.totalIncome) *
        100
      : 0

  const incomeComparison: ComparisonResult =
    {
      current: summary.totalIncome,
      previous: previousSummary.totalIncome,
      percentageChange:
        calculatePercentageChange(
          summary.totalIncome,
          previousSummary.totalIncome,
        ),
    }

  const expenseComparison: ComparisonResult =
    {
      current: summary.totalExpenses,
      previous: previousSummary.totalExpenses,
      percentageChange:
        calculatePercentageChange(
          summary.totalExpenses,
          previousSummary.totalExpenses,
        ),
    }

  const balanceComparison: ComparisonResult =
    {
      current: summary.totalBalance,
      previous: previousSummary.totalBalance,
      percentageChange:
        calculatePercentageChange(
          summary.totalBalance,
          previousSummary.totalBalance,
        ),
    }

  const savingsComparison: ComparisonResult =
    {
      current: savingsRate,
      previous: previousSavingsRate,
      percentageChange:
        calculatePercentageChange(
          savingsRate,
          previousSavingsRate,
        ),
    }

  const topExpense =
    expenseBreakdown.length > 0
      ? expenseBreakdown[0]
      : null

  const highestExpense = useMemo(() => {
    const expenses =
      filteredTransactions.filter(
        (transaction) =>
          transaction.type === "expense",
      )

    if (expenses.length === 0) {
      return null
    }

    return expenses.reduce(
      (highest, transaction) =>
        transaction.amount >
        highest.amount
          ? transaction
          : highest,
    )
  }, [filteredTransactions])

  const averageTransaction =
    filteredTransactions.length > 0
      ? (summary.totalIncome +
          summary.totalExpenses) /
        filteredTransactions.length
      : 0

  const expenseChangeIsGood =
    expenseComparison.percentageChange < 0

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
        {/* Income */}
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

          <div className="mt-2">
            <ComparisonIndicator
              comparison={incomeComparison}
              positiveDirection="up"
            />
          </div>
        </div>

        {/* Expenses */}
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

          <div className="mt-2">
            <ComparisonIndicator
              comparison={expenseComparison}
              positiveDirection="down"
            />
          </div>
        </div>

        {/* Net balance */}
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

          <div className="mt-2">
            <ComparisonIndicator
              comparison={balanceComparison}
              positiveDirection="up"
            />
          </div>
        </div>

        {/* Savings */}
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

          <div className="mt-2">
            <ComparisonIndicator
              comparison={savingsComparison}
              positiveDirection="up"
            />
          </div>
        </div>
      </div>

      {/* Empty state */}
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
          {/* Financial chart */}
          <FinancialChart
            transactions={filteredTransactions}
          />

          {/* Breakdown + insights */}
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
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="font-medium text-[var(--text-primary)]">
                            {expense.category}
                          </span>

                          <span className="shrink-0 text-[var(--text-secondary)]">
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
                {/* Income insight */}
                <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                  <div className="flex items-start gap-3">
                    {incomeComparison.percentageChange >=
                    0 ? (
                      <TrendingUp
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                    ) : (
                      <TrendingDown
                        size={18}
                        className="mt-0.5 shrink-0 text-red-500"
                      />
                    )}

                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {incomeComparison.percentageChange >=
                        0
                          ? "Income improved"
                          : "Income declined"}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                        {incomeComparison.percentageChange ===
                        0
                          ? "Your income is unchanged compared with the previous period."
                          : `Your income is ${getComparisonLabel(
                              incomeComparison.percentageChange,
                            )} ${
                              incomeComparison.percentageChange >
                              0
                                ? "higher"
                                : "lower"
                            } than the previous period.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expense insight */}
                <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                  <div className="flex items-start gap-3">
                    {expenseChangeIsGood ? (
                      <TrendingDown
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                    ) : (
                      <TrendingUp
                        size={18}
                        className="mt-0.5 shrink-0 text-red-500"
                      />
                    )}

                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {expenseChangeIsGood
                          ? "Spending decreased"
                          : "Spending increased"}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                        {expenseComparison.percentageChange ===
                        0
                          ? "Your spending is unchanged compared with the previous period."
                          : `Your expenses are ${getComparisonLabel(
                              expenseComparison.percentageChange,
                            )} ${
                              expenseComparison.percentageChange >
                              0
                                ? "higher"
                                : "lower"
                            } than the previous period.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Savings insight */}
                <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                  <div className="flex items-start gap-3">
                    <PiggyBank
                      size={18}
                      className="mt-0.5 shrink-0 text-purple-600"
                    />

                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Savings performance
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                        You retained{" "}
                        <strong>
                          {savingsRate.toFixed(
                            1,
                          )}
                          %
                        </strong>{" "}
                        of your income during this
                        period.
                        {savingsRate >
                        previousSavingsRate
                          ? " That's an improvement over the previous period."
                          : savingsRate <
                              previousSavingsRate
                            ? " That's lower than the previous period."
                            : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top category */}
                {topExpense && (
                  <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Largest spending category
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                      <strong>
                        {topExpense.category}
                      </strong>{" "}
                      accounts for{" "}
                      <strong>
                        {topExpense.percentage.toFixed(
                          1,
                        )}
                        %
                      </strong>{" "}
                      of your total expenses.
                    </p>
                  </div>
                )}

                {/* Highest expense */}
                {highestExpense && (
                  <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Highest individual expense
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                      <strong>
                        {highestExpense.description}
                      </strong>{" "}
                      was your largest single expense
                      at{" "}
                      <strong>
                        {formatCurrency(
                          highestExpense.amount,
                        )}
                      </strong>
                      .
                    </p>
                  </div>
                )}

                {/* Activity */}
                <div className="rounded-xl bg-[var(--surface-hover)] p-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Transaction activity
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                    You recorded{" "}
                    <strong>
                      {filteredTransactions.length}
                    </strong>{" "}
                    transaction
                    {filteredTransactions.length ===
                    1
                      ? ""
                      : "s"} in this period, with
                    an average value of{" "}
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