import { Link } from "react-router-dom"
import type { Transaction } from "../types/transaction"
import { formatCurrency } from "../utils/currency"

type TransactionItemProps = {
  transaction: Transaction
}

function TransactionItem({
  transaction,
}: TransactionItemProps) {
  const isIncome = transaction.type === "income"

  return (
    <Link
      to={`/transactions/${transaction.id}`}
      className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
    >
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-800">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">
            {transaction.description}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
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
          className={`shrink-0 font-semibold ${
            isIncome
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </Link>
  )
}

export default TransactionItem