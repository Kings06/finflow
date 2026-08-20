import { transactions } from "./data/transactions"

function App() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">FinFlow</h1>

        <p className="mt-2 text-slate-400">
          Recent Transactions
        </p>

        <div className="mt-8 space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-xl bg-slate-900 p-5"
            >
              <div>
                <h2 className="font-semibold">
                  {transaction.description}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {transaction.category} · {transaction.date}
                </p>
              </div>

              <p
                className={
                  transaction.type === "income"
                    ? "font-semibold text-emerald-400"
                    : "font-semibold text-red-400"
                }
              >
                {transaction.type === "income" ? "+" : "-"}₦
                {transaction.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App