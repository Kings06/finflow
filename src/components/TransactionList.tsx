import { useTransactions } from "../hooks/useTransactions"
import TransactionItem from "./TransactionItem"

function TransactionList() {
  const { transactions, loading, error } = useTransactions()

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Recent Transactions
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Your latest financial activity.
        </p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl bg-slate-900"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-950/40 p-6 text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
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