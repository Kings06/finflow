import { Link } from "react-router-dom"
import { useTransactionsContext } from "../context/TransactionsContext"
import TransactionItem from "./TransactionItem"

function TransactionList() {
  const { transactions, loading, error } =
    useTransactionsContext()

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            Recent Transactions
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Your latest financial activity.
          </p>
        </div>

        <Link
          to="/transactions"
          className="shrink-0 text-sm font-medium text-emerald-500 transition hover:text-emerald-400"
        >
          View all →
        </Link>
      </div>

      {loading && (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl"
              style={{
                backgroundColor: "var(--surface)",
              }}
            />
          ))}
        </div>
      )}

      {error && (
        <div
          className="mt-8 rounded-2xl border p-6 text-red-500"
          style={{
            borderColor: "rgba(239, 68, 68, 0.2)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
          }}
        >
          <p className="font-medium">
            Unable to load transactions
          </p>

          <p className="mt-1 text-sm opacity-80">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-8 space-y-4">
          {transactions.length > 0 ? (
            transactions
              .slice(0, 5)
              .map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
          ) : (
            <div
              className="rounded-2xl border p-8 text-center"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <h3
                className="text-lg font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                No transactions yet
              </h3>

              <p
                className="mx-auto mt-2 max-w-md text-sm"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Add your first transaction to start
                tracking your financial activity.
              </p>

              <Link
                to="/transactions/new"
                className="mt-5 inline-flex rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                + Add Transaction
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default TransactionList