import { useMemo } from "react"
import { useTransactionsContext } from "../context/TransactionsContext"
import { usePreferences } from "../context/PreferencesContext"
import { formatCurrency } from "../utils/currency"
import { detectRecurringExpenses } from "../utils/recurring"

function RecurringExpenses() {
  const { transactions } = useTransactionsContext()
  const { currency } = usePreferences()

  const recurringExpenses = useMemo(() => {
    return detectRecurringExpenses(transactions)
  }, [transactions])

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      {/* Header */}
      <div className="border-b border-[var(--border)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Recurring Expenses
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              FinFlow detected expenses that appear regularly.
            </p>
          </div>

          {recurringExpenses.length > 0 && (
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
              {recurringExpenses.length} detected
            </span>
          )}
        </div>
      </div>

      {/* Recurring expenses */}
      {recurringExpenses.length > 0 ? (
        <div className="divide-y divide-[var(--border)]">
          {recurringExpenses.map((expense) => (
            <div
              key={`${expense.description}-${expense.category}`}
              className="p-6 transition hover:bg-[var(--surface-hover)]"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {expense.description}
                    </h3>

                    <span className="rounded-full bg-[var(--surface-hover)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
                      {expense.category}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Approximately every{" "}
                    <span className="font-medium text-[var(--text-primary)]">
                      {expense.averageInterval} days
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Detected from {expense.occurrences} transactions
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {formatCurrency(
                      expense.amount,
                      currency,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    average payment
                  </p>
                </div>
              </div>

              {/* Cost estimates */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-4">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Estimated monthly
                  </p>

                  <p className="mt-1 font-semibold text-[var(--text-primary)]">
                    {formatCurrency(
                      expense.estimatedMonthlyCost,
                      currency,
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-4">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Estimated yearly
                  </p>

                  <p className="mt-1 font-semibold text-[var(--text-primary)]">
                    {formatCurrency(
                      expense.estimatedYearlyCost,
                      currency,
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            No recurring expenses detected yet.
          </p>

          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
            Keep adding transactions and FinFlow will look
            for repeated spending patterns automatically.
          </p>
        </div>
      )}
    </section>
  )
}

export default RecurringExpenses