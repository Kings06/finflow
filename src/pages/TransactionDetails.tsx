import { Link, useParams } from "react-router-dom"
import { formatCurrency } from "../utils/currency"
import { useTransactionsContext } from "../context/TransactionsContext"

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
          We couldn't find that transaction.
        </p>

        <Link
          to="/transactions"
          className="mt-6 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Back to Transactions
        </Link>
      </div>
    )
  }

  const isIncome = transaction.type === "income"

  return (
    <div>
      <Link
        to="/transactions"
        className="text-sm text-slate-400 transition hover:text-white"
      >
        ← Back to Transactions
      </Link>

      <div className="mt-6 rounded-2xl bg-slate-900 p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <p className="text-sm text-slate-400">
              Transaction Details
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {transaction.description}
            </h1>
          </div>

          <span
            className={
              isIncome
                ? "text-2xl font-bold text-emerald-400"
                : "text-2xl font-bold text-red-400"
            }
          >
            {isIncome ? "+" : "-"}
         {formatCurrency(transaction.amount)}
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-950 p-5">
            <p className="text-sm text-slate-500">
              Type
            </p>

            <p className="mt-2 font-semibold capitalize">
              {transaction.type}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-5">
            <p className="text-sm text-slate-500">
              Category
            </p>

            <p className="mt-2 font-semibold">
              {transaction.category}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-5">
            <p className="text-sm text-slate-500">
              Date
            </p>

            <p className="mt-2 font-semibold">
              {new Date(
                transaction.date,
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetails