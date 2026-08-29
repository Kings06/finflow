import { useMemo } from "react"
import { useTransactionsContext } from "../context/TransactionsContext"
import { useBillsContext } from "../context/BillsContext"
import { usePreferences } from "../context/PreferencesContext"
import { calculateCashFlowForecast } from "../utils/cashFlow"
import { formatCurrency } from "../utils/currency"

function CashFlowForecast() {
  const { transactions } = useTransactionsContext()
  const { bills } = useBillsContext()
  const { currency } = usePreferences()

  const forecast = useMemo(
    () =>
      calculateCashFlowForecast(
        transactions,
        bills,
      ),
    [transactions, bills],
  )

  const isHealthy = forecast.projectedBalance >= 0

  return (
    <section
      className="mt-8 overflow-hidden rounded-2xl border shadow-sm"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      {/* Header */}
      <div
        className="border-b p-6"
        style={{
          borderColor: "var(--border)",
        }}
      >
        <p
          className="text-sm font-medium"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Cash-flow forecast
        </p>

        <h2
          className="mt-2 text-2xl font-bold"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Projected balance
        </h2>

        <p
          className={`mt-2 text-3xl font-bold ${
            isHealthy
              ? "text-emerald-500"
              : "text-red-500"
          }`}
        >
          {formatCurrency(
            forecast.projectedBalance,
            currency,
          )}
        </p>

        <p
          className="mt-2 max-w-xl text-sm leading-6"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Your estimated balance after accounting for
          upcoming bills.
        </p>
      </div>

      {/* Forecast breakdown */}
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface-hover)",
          }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Current balance
          </p>

          <p
            className="mt-2 text-lg font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {formatCurrency(
              forecast.currentBalance,
              currency,
            )}
          </p>
        </div>

        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface-hover)",
          }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Upcoming bills
          </p>

          <p className="mt-2 text-lg font-semibold text-red-500">
            {formatCurrency(
              forecast.upcomingBills,
              currency,
            )}
          </p>
        </div>
      </div>

      {/* Status */}
      <div
        className="border-t px-6 py-4"
        style={{
          borderColor: "var(--border)",
        }}
      >
        <p
          className={`text-sm font-medium ${
            isHealthy
              ? "text-emerald-500"
              : "text-red-500"
          }`}
        >
          {isHealthy
            ? "Your projected balance remains positive."
            : "Your upcoming obligations may exceed your available balance."}
        </p>
      </div>
    </section>
  )
}

export default CashFlowForecast