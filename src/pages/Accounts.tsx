import { useTransactionsContext } from "../context/TransactionsContext"
import { calculateFinancialSummary } from "../utils/financial"
import { formatCurrency } from "../utils/currency"

function Accounts() {
  const { transactions, loading, error } =
    useTransactionsContext()

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Accounts
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your connected accounts.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl bg-slate-900"
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
      <h1 className="text-3xl font-bold">
        Accounts
      </h1>

      <p className="mt-2 text-slate-400">
        Manage your connected accounts.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {accounts.map((account) => (
          <div
            key={account.name}
            className="rounded-2xl bg-slate-900 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {account.type}
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {account.name}
                </h2>
              </div>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                Active
              </span>
            </div>

            <p
              className={`mt-8 text-3xl font-bold ${account.className}`}
            >
              {formatCurrency(account.amount)}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {account.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">
          Connected Accounts
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Your financial data is currently being managed
          through FinFlow.
        </p>

        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-6 text-center">
          <p className="font-medium">
            No external accounts connected
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Bank account connections can be added here in
            a future integration.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-slate-900 p-6">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl font-semibold">
        Recent Activity
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Your latest account transactions.
      </p>
    </div>

    <span className="text-sm text-slate-500">
      {transactions.length} total
    </span>
  </div>

  <div className="mt-6 space-y-3">
    {transactions.slice(0, 5).map((transaction) => (
      <div
        key={transaction.id}
        className="flex items-center justify-between rounded-xl bg-slate-800/60 p-4"
      >
        <div className="min-w-0">
          <p className="truncate font-medium">
            {transaction.description}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {transaction.category} ·{" "}
            {new Date(transaction.date).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )}
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
      <p className="py-6 text-center text-sm text-slate-500">
        No account activity yet.
      </p>
    )}
  </div>
</section>
    </div>
  )
}

export default Accounts