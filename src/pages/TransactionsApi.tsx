import { useTransactions } from "../hooks/useTransactions"

function TransactionsApi() {
  const { transactions, loading, error } = useTransactions()

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          API Transactions
        </h1>

        <p className="mt-4 text-slate-400">
          Loading transactions...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          API Transactions
        </h1>

        <p className="mt-4 text-red-400">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        API Transactions
      </h1>

      <p className="mt-2 text-slate-400">
        Transactions transformed into the FinFlow model.
      </p>

      <div className="mt-8 space-y-4">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-2xl bg-slate-900 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {transaction.description}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {transaction.category} · {transaction.date}
                </p>
              </div>

              <span
                className={
                  transaction.type === "income"
                    ? "font-semibold text-emerald-400"
                    : "font-semibold text-red-400"
                }
              >
                {transaction.type === "income" ? "+" : "-"}₦
                {transaction.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionsApi