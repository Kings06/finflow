import { Link } from "react-router-dom"
import { useTransactionsContext } from "../context/TransactionsContext"
import TransactionItem from "./TransactionItem"

function TransactionList() {
  const { transactions, loading, error } =
    useTransactionsContext()

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Your latest financial activity.
          </p>
        </div>

        <Link
          to="/transactions"
          className="text-sm font-medium text-emerald-500 transition hover:text-emerald-400"
        >
          View all →
        </Link>
      </div>

      {loading && (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl bg-[var(--surface)]"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="mt-8 space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default TransactionList