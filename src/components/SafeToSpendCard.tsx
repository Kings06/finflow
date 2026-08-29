import { useMemo } from "react"
import { useTransactionsContext } from "../context/TransactionsContext"
import { useBillsContext } from "../context/BillsContext"
import { usePreferences } from "../context/PreferencesContext"
import { calculateSafeToSpend } from "../utils/safeToSpend"
import { formatCurrency } from "../utils/currency"

function SafeToSpendCard() {
  const { transactions } = useTransactionsContext()
  const { bills } = useBillsContext()
  const { currency } = usePreferences()

  const safeToSpend = useMemo(
    () => calculateSafeToSpend(transactions, bills),
    [transactions, bills],
  )

  const hasSafeToSpend = safeToSpend.safeToSpend > 0

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      {/* Main summary */}
      <div className="border-b border-[var(--border)] bg-emerald-500/5 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-500">
                ₦
              </span>

              <p className="text-sm font-semibold text-emerald-500">
                Safe to Spend
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {formatCurrency(
                safeToSpend.safeToSpend,
                currency,
              )}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
              After accounting for your upcoming bills,
              this is the amount FinFlow estimates you can
              safely spend.
            </p>
          </div>

          {/* Current balance */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Current balance
            </p>

            <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
              {formatCurrency(
                safeToSpend.currentBalance,
                currency,
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid divide-y divide-[var(--border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="p-5">
          <p className="text-sm text-[var(--text-secondary)]">
            Upcoming bills
          </p>

          <p className="mt-2 text-xl font-bold text-amber-500">
            {formatCurrency(
              safeToSpend.upcomingExpenses,
              currency,
            )}
          </p>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Reserved for bills due from today onward
          </p>
        </div>

        <div className="p-5">
          <p className="text-sm text-[var(--text-secondary)]">
            Available after bills
          </p>

          <p
            className={`mt-2 text-xl font-bold ${
              hasSafeToSpend
                ? "text-emerald-500"
                : "text-red-500"
            }`}
          >
            {formatCurrency(
              safeToSpend.safeToSpend,
              currency,
            )}
          </p>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Your current spending room
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="border-t border-[var(--border)] px-5 py-4">
        <p className="text-xs leading-5 text-[var(--text-secondary)]">
          FinFlow calculates this using your recorded
          income, expenses, and upcoming bills. As we add
          savings goals and cash-flow forecasting, this
          estimate will become smarter.
        </p>
      </div>
    </section>
  )
}

export default SafeToSpendCard