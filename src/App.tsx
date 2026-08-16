import type { Transaction } from "./types/transaction"

function App() {
  const transaction: Transaction = {
    id: 1,
    description: "Netflix Subscription",
    amount: 15000,
    category: "Entertainment",
    date: "2026-08-16",
    type: "expense",
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold">
        FinFlow
      </h1>

      <p className="mt-4 text-xl">
        {transaction.description}
      </p>

      <p className="mt-2">
        ₦{transaction.amount.toLocaleString()}
      </p>

      <p className="mt-2">
        {transaction.category} · {transaction.type}
      </p>
    </div>
  )
}

export default App