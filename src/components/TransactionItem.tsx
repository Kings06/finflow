import type { Transaction } from "../types/transaction"
import { formatCurrency } from "../utils/currency"
import { Link } from "react-router-dom"

type TransactionItemProps = {
  transaction: Transaction
}

function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <Link
      to={`/transactions/${transaction.id}`}
      className="block"
    >
      <div className="flex items-center justify-between rounded-xl bg-slate-900 p-5 transition hover:bg-slate-800">
        <div>
          <h3 className="font-semibold">
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
          className={
            transaction.type === "income"
              ? "font-semibold text-emerald-400"
              : "font-semibold text-red-400"
          }
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </Link>
  )
}

export default TransactionItem