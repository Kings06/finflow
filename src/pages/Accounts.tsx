import { useTransactionsContext } from "../context/TransactionsContext"
import { calculateFinancialSummary } from "../utils/financial"
import { formatCurrency } from "../utils/currency"

function Accounts() {
  const { transactions, loading, error } =
    useTransactionsContext()

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-(--text-primary)">
          Accounts
        </h1>

        <p className="mt-2 text-(--text-secondary)">
          Manage your connected accounts.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl bg-(--surface)"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-(--text-primary)">
          Accounts
        </h1>

        <p className="mt-4 text-red-400">
          {error}
        </p>
      </div>
    )
  }

  const summary = calculateFinancialSummary(transactions)

  const accounts = [
    {
      name: "Main Account",
      type: "Current Balance",
      amount: summary.totalBalance,
      description: "Available balance",
      className:
        summary.totalBalance >= 0
          ? "text-emerald-400"
          : "text-red-400",
    },
    {
      name: "Income",
      type: "Money Received",
      amount: summary.totalIncome,
      description: "Total incoming funds",
      className: "text-emerald-400",
    },
    {
      name: "Expenses",
      type: "Money Spent",
      amount: summary.totalExpenses,
      description: "Total outgoing funds",
      className: "text-red-400",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-(--text-primary)">
        Accounts
      </h1>

      <p className="mt-2 text-(--text-secondary)">
        Manage your connected accounts.
      </p>

      {/* Account Summary */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {accounts.map((account) => (
          <div
            key={account.name}
            className="rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors duration-200 hover:border-(--text-secondary)"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-(--text-secondary)">
                  {account.type}
                </p>

                <h2 className="mt-2 text-xl font-semibold text-(--text-primary)">
                  {account.name}
                </h2>
              </div>

              <span className="rounded-full bg-(--surface-hover) px-3 py-1 text-xs text-(--text-secondary)">
                Active
              </span>
            </div>

            <p
              className={`mt-8 text-3xl font-bold ${account.className}`}
            >
              {formatCurrency(account.amount)}
            </p>

            <p className="mt-2 text-sm text-(--text-secondary)">
              {account.description}
            </p>
          </div>
        ))}
      </section>

      {/* Connected Accounts */}
      <section className="mt-8 rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-(--text-primary)">
          Connected Accounts
        </h2>

        <p className="mt-1 text-sm text-(--text-secondary)">
          Your financial data is currently being managed
          through FinFlow.
        </p>

        <div className="mt-6 rounded-xl border border-dashed border-(--border) p-6 text-center">
          <p className="font-medium text-(--text-primary)">
            No external accounts connected
          </p>

          <p className="mt-2 text-sm text-(--text-secondary)">
            Bank account connections can be added here in
            a future integration.
          </p>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-8 rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-(--text-primary)">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-(--text-secondary)">
              Your latest account transactions.
            </p>
          </div>

          <span className="text-sm text-(--text-secondary)">
            {transactions.length} total
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-xl border border-(--border) bg-(--background) p-4 transition-colors duration-200"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-(--text-primary)">
                  {transaction.description}
                </p>

                <p className="mt-1 text-sm text-(--text-secondary)">
                  {transaction.category} ·{" "}
                  {new Date(
                    transaction.date,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <p
                className={`ml-4 shrink-0 font-semibold ${
                  transaction.type === "income"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}

          {transactions.length === 0 && (
            <p className="py-6 text-center text-sm text-(--text-secondary)">
              No account activity yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Accounts