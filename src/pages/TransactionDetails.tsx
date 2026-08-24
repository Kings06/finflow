import { Link, useParams } from "react-router-dom"
import { useTransactionsContext } from "../context/TransactionsContext"
import { formatCurrency } from "../utils/currency"

function TransactionDetails() {
  const { id } = useParams()
  const { transactions, loading, error } =
    useTransactionsContext()

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transaction Details
        </h1>

        <p className="mt-4 text-slate-400">
          Loading transaction...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transaction Details
        </h1>

        <p className="mt-4 text-red-400">
          {error}
        </p>
      </div>
    )
  }

  const transaction = transactions.find(
    (item) => item.id === Number(id),
  )

  if (!transaction) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transaction Not Found
        </h1>

        <p className="mt-4 text-slate-400">
          We couldn't find the transaction you're looking for.
        </p>

        <Link
          to="/transactions"
          className="mt-6 inline-block text-emerald-400 transition hover:text-emerald-300"
        >
          ← Back to Transactions
        </Link>
      </div>
    )
  }

  const isIncome = transaction.type === "income"

  const formattedDate = new Date(
    transaction.date,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div>
      <Link
        to="/transactions"
        className="text-sm text-slate-400 transition hover:text-white"
      >
        ← Back to Transactions
      </Link>

      <div className="mt-6">
        <p className="text-sm text-slate-400">
          Transaction Details
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          {transaction.description}
        </h1>
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Amount
              </p>

              <h2
                className={`mt-2 text-4xl font-bold ${
                  isIncome
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </h2>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                isIncome
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {isIncome ? "Income" : "Expense"}
            </span>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-sm text-slate-500">
              Description
            </p>

            <p className="mt-2 leading-6 text-slate-200">
              {transaction.description}
            </p>
          </div>

          <div className="mt-8 grid gap-6 border-t border-slate-800 pt-6 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">
                Category
              </p>

              <p className="mt-2 font-medium">
                {transaction.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Date
              </p>

              <p className="mt-2 font-medium">
                {formattedDate}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Transaction ID
              </p>

              <p className="mt-2 font-medium">
                #{transaction.id}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TransactionDetails